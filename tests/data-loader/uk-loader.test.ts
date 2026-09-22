import { beforeEach, describe, expect, test } from "vitest";

import { DonationField, DonorType } from "@/utils/types";

import {
  UkLoader,
  normalizeUkCompanyNumber,
  crnOverrides,
} from "../../tasks/load-data/uk/uk-loader";

let loader: UkLoader;

beforeEach(() => {
  loader = new UkLoader();
});

describe("crnOverrides", () => {
  test("contains known company registration number overrides", () => {
    expect(crnOverrides["00129450"]).toBe("00129430");
    expect(crnOverrides["03299742"]).toBe("03277942");
    expect(crnOverrides["00012011"]).toBe("00120011");
    expect(crnOverrides["00023666"]).toBe("02366682");
  });
});

describe("normalizeUkCompanyNumber", () => {
  test.each([
    ["258706", "00258706"],
    ["00258706", "00258706"],
    ["12345", "00012345"],
    ["12345678", "12345678"],
    ["SC1234", "SC001234"],
    ["SC001234", "SC001234"],
    ["NI123456", "NI123456"],
    ["OC123456", "OC123456"],
    ["", undefined],
    ["   ", undefined],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeUkCompanyNumber(input)).toBe(expected);
  });
});

describe("UK loader extractor", () => {
  // CSV header for reference:
  // ECRef, RegulatedEntityName, RegulatedEntityType, Value, AcceptedDate, AccountingUnitName,
  // DonorName, AccountingUnitsAsCentralParty, IsSponsorship, DonorStatus, RegulatedDoneeType,
  // CompanyRegistrationNumber, Postcode, DonationType, NatureOfDonation, PurposeOfVisit,
  // DonationAction, ReceivedDate, ReportedDate, IsReportedPrePoll, ReportingPeriodName,
  // IsBequest, IsAggregation, RegulatedEntityId, AccountingUnitId, DonorId, CampaigningName,
  // RegisterName, IsIrishSource

  test.each([
    [
      "valid individual donation",
      [
        "12345", // ECRef
        "Labour Party", // RegulatedEntityName
        "Political Party", // RegulatedEntityType
        "£50,000.00", // Value
        "15/03/2024", // AcceptedDate
        "", // AccountingUnitName
        "John Smith", // DonorName
        "",
        "", // AccountingUnitsAsCentralParty, IsSponsorship
        "Individual", // DonorStatus
        "",
        "",
        "",
        "",
        "",
        "", // RegulatedDoneeType through DonationAction
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "", // ReceivedDate through IsIrishSource
      ],
      1,
      {
        amount: 50000,
        name: "John Smith",
        date: "2024-03-15",
        receiver: "Labour Party",
        donorType: DonorType.Individual,
      },
    ],
    [
      "valid company donation with unpadded registration number",
      [
        "67890",
        "Conservative and Unionist Party",
        "Political Party",
        "£100,000.00",
        "20/06/2024",
        "",
        "ACME Corporation Ltd",
        "",
        "",
        "Company",
        "",
        "258706", // CompanyRegistrationNumber unpadded
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      1,
      {
        amount: 100000,
        name: "ACME Corporation Ltd",
        date: "2024-06-20",
        receiver: "Conservative and Unionist Party",
        donorType: DonorType.Company,
        donorRegistrationNumber: "00258706",
      },
    ],
    [
      "company donation with overridden typo registration number",
      [
        "77777",
        "Liberal Democrats",
        "Political Party",
        "£5,000.00",
        "15/04/2022",
        "",
        "Liskeard Liberal Club Company Ltd",
        "",
        "",
        "Company",
        "",
        "00129450", // Reported typo in EC data
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      1,
      {
        amount: 5000,
        name: "Liskeard Liberal Club Company Ltd",
        date: "2022-04-15",
        receiver: "Liberal Democrats",
        donorType: DonorType.Company,
        donorRegistrationNumber: "00129430", // Overridden to correct CRN
      },
    ],
    [
      "trade union donation",
      [
        "11111",
        "Labour Party",
        "Political Party",
        "£250,000.00",
        "01/01/2024",
        "",
        "Unite the Union",
        "",
        "",
        "Trade Union",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      1,
      {
        amount: 250000,
        name: "Unite the Union",
        date: "2024-01-01",
        receiver: "Labour Party",
        donorType: DonorType.TradeUnion,
      },
    ],
    [
      "header row returns undefined",
      [
        "ECRef",
        "RegulatedEntityName",
        "RegulatedEntityType",
        "Value",
        "AcceptedDate",
        "AccountingUnitName",
        "DonorName",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      0,
      undefined,
    ],
    [
      "impermissible donor returns undefined",
      [
        "22222",
        "Some Party",
        "Political Party",
        "£50,000.00",
        "15/03/2024",
        "",
        "Bad Actor",
        "",
        "",
        "Impermissible Donor",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      1,
      undefined,
    ],
    [
      "empty accepted date returns undefined",
      [
        "33333",
        "Some Party",
        "Political Party",
        "£50,000.00",
        "", // empty date
        "",
        "Good Donor",
        "",
        "",
        "Individual",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
      ],
      1,
      undefined,
    ],
  ])(`extracts %s`, (_title, col, idx, expected) => {
    const extracted = loader.extractor(col, idx);

    if (expected === undefined) {
      expect(extracted).toBeUndefined();
    } else {
      expect(extracted).toBeDefined();
      expect(extracted![DonationField.Amount]).toEqual(expected.amount);
      expect(extracted![DonationField.DonorName]).toEqual(expected.name);
      expect(extracted![DonationField.Date]).toEqual(expected.date);
      expect(extracted![DonationField.Receiver]).toEqual(expected.receiver);
      expect(extracted![DonationField.DonorType]).toEqual(expected.donorType);
      if ("donorRegistrationNumber" in expected) {
        expect(extracted![DonationField.DonorRegistrationNumber]).toEqual(
          expected.donorRegistrationNumber,
        );
      }
    }
  });
});

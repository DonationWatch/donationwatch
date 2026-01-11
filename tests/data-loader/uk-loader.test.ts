import { expect, test, beforeEach, describe } from "vitest";

import { UkLoader } from "../../tasks/load-data/uk/uk-loader";

import { DonationField, DonorType } from "@/utils/types";

let loader: UkLoader;

beforeEach(() => {
  loader = new UkLoader();
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
      "valid company donation",
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
        amount: 100000,
        name: "ACME Corporation Ltd",
        date: "2024-06-20",
        receiver: "Conservative and Unionist Party",
        donorType: DonorType.Company,
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
    }
  });
});

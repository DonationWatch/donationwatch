import { expect, test, beforeEach, describe } from "vitest";

import { RsLoader } from "../../tasks/load-data/rs/rs-loader";

import { DonationField } from "@/utils/types";

let loader: RsLoader;

beforeEach(() => {
  loader = new RsLoader();
});

describe("RS loader transformRawDonation", () => {
  // CSV columns: party, year, incomeType, service, user, monetaryContribution, inKindContribution, totalAmount, purpose
  test.each([
    [
      "valid donation row",
      [
        "Srpska napredna stranka (SNS)",
        "2022",
        "Donacije fizičkih lica",
        "",
        "Petar Petrović",
        "50000",
        "0",
        "50000",
        "",
      ],
      0,
      {
        amount: 50000,
        name: "Petar Petrović",
        date: "2022",
        receiver: "Srpska napredna stranka (SNS)",
      },
    ],
    [
      "donation with different party",
      [
        "Demokratska stranka (DS)",
        "2023",
        "Donacije pravnih lica",
        "",
        "Company DOO",
        "100000",
        "0",
        "100000",
        "",
      ],
      1,
      {
        amount: 100000,
        name: "Company DOO",
        date: "2023",
        receiver: "Demokratska stranka (DS)",
      },
    ],
    [
      "non-donation income type returns undefined",
      [
        "Socijalistička partija Srbije (SPS)",
        "2022",
        "Članarina", // not Donacije
        "",
        "Member Name",
        "1000",
        "0",
        "1000",
        "",
      ],
      2,
      undefined,
    ],
    [
      "zero amount returns undefined",
      [
        "Srpski pokret obnove (SPO)",
        "2021",
        "Donacije fizičkih lica",
        "",
        "Empty Donor",
        "0",
        "0",
        "0",
        "",
      ],
      3,
      undefined,
    ],
    [
      "negative amount returns undefined",
      [
        "Narodna stranka (NS)",
        "2020",
        "Donacije pravnih lica",
        "",
        "Negative Corp",
        "-500",
        "0",
        "-500",
        "",
      ],
      4,
      undefined,
    ],
  ])(`transforms %s`, (_title, row, idx, expected) => {
    const extracted = loader.transformRawDonation(row, idx);

    if (expected === undefined) {
      expect(extracted).toBeUndefined();
    } else {
      expect(extracted).toBeDefined();
      expect(extracted![DonationField.Amount]).toEqual(expected.amount);
      expect(extracted![DonationField.DonorName]).toEqual(expected.name);
      expect(extracted![DonationField.Date]).toEqual(expected.date);
      expect(extracted![DonationField.Receiver]).toEqual(expected.receiver);
    }
  });
});

import { expect, test, beforeEach, describe } from "vitest";

import { NoLoader } from "../../tasks/load-data/no/no-loader";

import type { NoDonation } from "../../tasks/load-data/no/no-loader";

import { DonationField } from "@/utils/types";

let loader: NoLoader;

beforeEach(() => {
  loader = new NoLoader();
});

describe("NO loader transformRawDonation", () => {
  test.each([
    [
      "valid donation",
      {
        party: "Arbeiderpartiet",
        partyUnit: "Arbeiderpartiet sentralstyre",
        donator: "Landsorganisasjonen i Norge",
        address: "Youngs gate 11, 0181 Oslo",
        sum: 100000,
      },
      "2024",
      0,
      {
        amount: 100000,
        name: "Landsorganisasjonen i Norge",
        date: "2024",
        receiver: "Arbeiderpartiet",
      },
    ],
    [
      "donation with different party",
      {
        party: "Høyre",
        partyUnit: "Høyre sentralt",
        donator: "Corporate Sponsor AS",
        address: "Karl Johans gate 1, 0154 Oslo",
        sum: 250000,
      },
      "2023",
      1,
      {
        amount: 250000,
        name: "Corporate Sponsor AS",
        date: "2023",
        receiver: "Høyre",
      },
    ],
    [
      "donation with LO Norge normalization",
      {
        party: "Sosialistisk Venstreparti",
        partyUnit: "SV sentralt",
        donator: "LO Norge",
        address: "Youngs gate 11, 0181 Oslo",
        sum: 50000,
      },
      "2024",
      2,
      {
        amount: 50000,
        name: "Landsorganisasjonen i Norge", // normalized
        date: "2024",
        receiver: "Sosialistisk Venstreparti",
      },
    ],
  ])(`transforms %s`, (_title, donation: NoDonation, year, idx, expected) => {
    const extracted = loader.transformRawDonation(donation, year, idx);

    expect(extracted).toBeDefined();
    expect(extracted[DonationField.Amount]).toEqual(expected.amount);
    expect(extracted[DonationField.DonorName]).toEqual(expected.name);
    expect(extracted[DonationField.Date]).toEqual(expected.date);
    expect(extracted[DonationField.Receiver]).toEqual(expected.receiver);
  });
});

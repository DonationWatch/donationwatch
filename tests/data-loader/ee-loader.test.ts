import { beforeEach, describe, expect, test } from "vitest";

import { DonationField } from "@/utils/types";

import type { EeDonation } from "../../tasks/load-data/ee/ee-loader";

import { EeLoader } from "../../tasks/load-data/ee/ee-loader";

let loader: EeLoader;

beforeEach(() => {
  loader = new EeLoader();
});

describe("EE loader transformRawDonation", () => {
  test.each([
    [
      "valid donation above minimum",
      {
        date: "15.03.2024",
        receipt_category: "Rahaline annetus",
        name: "JAAN TAMM",
        birthdate: "01.01.1970",
        amount: 5000,
        party: "Eesti Reformierakond",
      },
      0,
      {
        amount: 5000,
        name: "Jaan Tamm",
        date: "2024-03-15",
        receiver: "Eesti Reformierakond",
      },
    ],
    [
      "valid donation with different party",
      {
        date: "01.12.2023",
        receipt_category: "Rahaline annetus",
        name: "MARI METS",
        birthdate: "15.06.1980",
        amount: 10000,
        party: "ISAMAA Erakond",
      },
      1,
      {
        amount: 10000,
        name: "Mari Mets",
        date: "2023-12-01",
        receiver: "ISAMAA Erakond",
      },
    ],
  ])(`transforms %s`, (_title, donation: EeDonation, idx, expected) => {
    const extracted = loader.transformRawDonation(donation, idx);

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

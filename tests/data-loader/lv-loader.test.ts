import { beforeEach, describe, expect, test } from "vitest";

import { DonationField, DonationType } from "@/utils/types";

import type { KnabPayment } from "../../tasks/load-data/lv/lv-loader";

import { LvLoader } from "../../tasks/load-data/lv/lv-loader";

let loader: LvLoader;

beforeEach(() => {
  loader = new LvLoader();
});

describe("LV loader extractYearData", () => {
  test("extracts donations for specific year from cached JSON data", async () => {
    const mockPayments: KnabPayment[] = [
      {
        public_id: "f218a133c058eb48c6ba504a5802eac4",
        party_public_id: "5c214c589fecf039d422749f0a77b4d0",
        party: 'Partija "VIENOTĪBA"',
        typeId: 1,
        type: "Nauda",
        amountDisplay: "500.00",
        currency: "EUR",
        firstName: "Zane",
        lastName: "Siliņa",
        person: "Zane Siliņa",
        personCode: "191084*****",
        date: "27.07.2026",
      },
    ];

    loader["cachedYearData"] = async (yearTypeId: string) => {
      if (yearTypeId === "2026-1") {
        return JSON.stringify(mockPayments);
      }
      return "[]";
    };

    const donations2026 = await loader.extractYearData("2026");
    expect(donations2026).toHaveLength(1);
    expect(donations2026[0][DonationField.Id]).toEqual(
      "f218a133c058eb48c6ba504a5802eac4",
    );
    expect(donations2026[0][DonationField.Amount]).toEqual(500);
    expect(donations2026[0][DonationField.DonorName]).toEqual("Zane Siliņa");
    expect(donations2026[0][DonationField.Date]).toEqual("2026-07-27");
    expect(donations2026[0][DonationField.Receiver]).toEqual(
      'Partija "VIENOTĪBA"',
    );
    expect(donations2026[0][DonationField.DonationType]).toEqual(
      DonationType.Money,
    );
  });
});

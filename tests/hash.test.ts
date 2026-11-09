import crypto from "crypto";
import { describe, expect, test } from "vitest";

import type { ReceiverId } from "@/utils/types";

import { computePartyDonorStats } from "@/utils/data/get-party-donor-stats";
import { clientSha1, sha1Sync } from "@/utils/hash";
import {
  AddressField,
  DonationField,
  DonationType,
  DonorType,
} from "@/utils/types";

describe("sha1Sync & clientSha1", () => {
  const samples = [
    "",
    "abc",
    "Winfried Stöcker",
    "Christopher Harborne",
    "Dr. med. Hans-Jürgen Müller-Lüdenscheidt",
    "A".repeat(55),
    "A".repeat(56),
    "A".repeat(64),
    "A".repeat(128),
    "Україна — Грузія — България — 日本語",
  ];

  test.each(samples)("matches Node crypto SHA-1 for %j", async (input) => {
    const expected = crypto.createHash("sha1").update(input).digest("hex");
    expect(sha1Sync(input)).toBe(expected);
    await expect(clientSha1(input)).resolves.toBe(expected);
  });
});

describe("computePartyDonorStats", () => {
  test("aggregates party donor statistics accurately", () => {
    const cdu = "CDU" as ReceiverId;
    const spd = "SPD" as ReceiverId;
    const stats = computePartyDonorStats(cdu, [
      {
        [DonationField.Id]: "1",
        [DonationField.DonorName]: "Alice",
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.DonationType]: DonationType.Money,
        [DonationField.Amount]: 10000,
        [DonationField.Date]: "2021-03-10",
        [DonationField.Receiver]: cdu,
        [DonationField.Address]: { [AddressField.Country]: "DE" },
      },
      {
        [DonationField.Id]: "2",
        [DonationField.DonorName]: "Bob GmbH",
        [DonationField.DonorType]: DonorType.Company,
        [DonationField.DonationType]: DonationType.PropertyOrService,
        [DonationField.Amount]: 50000,
        [DonationField.Date]: "2022-05-15",
        [DonationField.Receiver]: cdu,
        [DonationField.Address]: { [AddressField.Country]: "DE" },
      },
      {
        [DonationField.Id]: "3",
        [DonationField.DonorName]: "Alice",
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.DonationType]: DonationType.Money,
        [DonationField.Amount]: 15000,
        [DonationField.Date]: "2023-01-20",
        [DonationField.Receiver]: cdu,
        [DonationField.Address]: { [AddressField.Country]: "DE" },
      },
      {
        [DonationField.Id]: "4",
        [DonationField.DonorName]: "Other Party Donor",
        [DonationField.DonorType]: DonorType.Individual,
        [DonationField.DonationType]: DonationType.Money,
        [DonationField.Amount]: 99999,
        [DonationField.Date]: "2020-01-01",
        [DonationField.Receiver]: spd,
        [DonationField.Address]: { [AddressField.Country]: "DE" },
      },
    ]);

    expect(stats).not.toBeNull();
    expect(stats?.sum).toBe(75000);
    expect(stats?.count).toBe(3);
    expect(stats?.firstDonationDate).toBe("2021-03-10");
    expect(stats?.topDonors).toEqual([
      { name: "Bob GmbH", sum: 50000 },
      { name: "Alice", sum: 25000 },
    ]);
    expect(stats?.biggestSingularDonation).toEqual({
      amount: 50000,
      donor: "Bob GmbH",
      date: "2022-05-15",
    });
    expect(stats?.biggestDonor).toEqual({
      name: "Bob GmbH",
      sum: 50000,
    });
    expect(stats?.frequentDonor).toEqual({
      name: "Alice",
      count: 2,
      sum: 25000,
    });
  });
});

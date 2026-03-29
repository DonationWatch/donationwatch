import type { CountryConfig } from "@/types/country-config";

import { donationYear } from "../date";
import { numbersSum } from "../math";
import { AddressField, Donation, DonationField, Party } from "../types";

export const getOriginDonations = (
  country: CountryConfig,
  donations: Donation[],
  parties?: Party[],
  years?: string[],
): {
  count: number;
  sums: OriginPartySum[];
  sum: number;
  sumNumbers: number[];
} => {
  parties ??= country.parties;
  years ??= country.years;

  const sums: Record<
    string,
    { state?: string; sum: number; donations: Donation[] }
  > = {};
  const sum: number[] = [];
  let donationsCount = 0;
  const yearsSet = new Set(years);
  const partiesSet = new Set(parties.map((p) => p.id));

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    // we prefix state/country due to possible name collisions
    const source = donation[DonationField.Address][AddressField.State]
      ? `s.${donation[DonationField.Address][AddressField.State]}`
      : `c.${donation[DonationField.Address][AddressField.Country]}`;
    sums[source] ??= {
      state: donation[DonationField.Address][AddressField.State],
      sum: 0,
      donations: [],
    };

    sums[source].donations.push(donation);
    sums[source].sum += donation[DonationField.Amount];
    donationsCount++;
    sum.push(donation[DonationField.Amount]);
  });

  const sortedSums = Object.entries(sums).toSorted(
    ([, dataA], [, dataB]) => dataB.sum - dataA.sum,
  );

  return {
    count: donationsCount,
    sums: sortedSums,
    sumNumbers: sum,
    sum: numbersSum(sum),
  };
};

export type OriginPartySum = [
  string,
  {
    state?: string;
    sum: number;
    donations: Donation[];
  },
];

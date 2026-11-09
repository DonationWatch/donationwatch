import type { Donation } from "@/utils/types";

import { DonationField, DonationType, DonorType } from "@/utils/types";

const TOP_DONORS_TO_SHOW = 5;

export interface PartyDonorStats {
  sum: number;
  count: number;
  firstDonationDate: string;
  topDonors: { name: string; sum: number }[];
  biggestSingularDonation?: {
    amount: number;
    donor: string;
    date: string;
  };
  biggestDonor?: {
    name: string;
    sum: number;
  };
  frequentDonor?: {
    name: string;
    count: number;
    sum: number;
  };
  donorTypes: Partial<Record<DonorType, { sum: number; count: number }>>;
  donationTypes: Partial<Record<DonationType, { sum: number; count: number }>>;
}

export type CountryPartyDonorStats = Record<string, PartyDonorStats>;

export const computePartyDonorStats = (
  partyId: string,
  donations: Donation[],
): PartyDonorStats | null => {
  let sum = 0;
  let count = 0;
  let firstDonationDate: string | undefined;
  const donorDonations: Record<string, number> = {};
  const donorDonationCounts: Record<string, number> = {};
  const donorTypes: Partial<Record<DonorType, { sum: number; count: number }>> =
    {};
  const donationTypes: Partial<
    Record<DonationType, { sum: number; count: number }>
  > = {};

  let biggestSingularDonation:
    | {
        amount: number;
        donor: string;
        date: string;
      }
    | undefined;

  for (const donation of donations) {
    if (donation[DonationField.Receiver] !== partyId) continue;

    const amount = donation[DonationField.Amount];
    const donor = donation[DonationField.DonorName];
    const date = donation[DonationField.Date];

    if (firstDonationDate === undefined) {
      firstDonationDate = date;
    }

    sum += amount;
    count += 1;

    donorDonations[donor] = (donorDonations[donor] ?? 0) + amount;
    donorDonationCounts[donor] = (donorDonationCounts[donor] ?? 0) + 1;

    if (!biggestSingularDonation || biggestSingularDonation.amount < amount) {
      biggestSingularDonation = {
        amount,
        donor,
        date,
      };
    }

    const donorType = donation[DonationField.DonorType] ?? DonorType.Other;
    donorTypes[donorType] ??= { sum: 0, count: 0 };
    donorTypes[donorType].sum += amount;
    donorTypes[donorType].count += 1;

    const donationType =
      donation[DonationField.DonationType] ?? DonationType.Money;
    donationTypes[donationType] ??= { sum: 0, count: 0 };
    donationTypes[donationType].sum += amount;
    donationTypes[donationType].count += 1;
  }

  if (count === 0 || firstDonationDate === undefined) {
    return null;
  }

  const topDonors = Object.entries(donorDonations)
    .map(([name, donorSum]) => ({
      name,
      sum: donorSum,
    }))
    .toSorted((a, b) => b.sum - a.sum)
    .slice(0, TOP_DONORS_TO_SHOW);

  let biggestDonor: { name: string; sum: number } | undefined;
  for (const [name, donorSum] of Object.entries(donorDonations)) {
    if (!biggestDonor || biggestDonor.sum < donorSum) {
      biggestDonor = { name, sum: donorSum };
    }
  }

  let maxDonationCount = 0;
  for (const donorCount of Object.values(donorDonationCounts)) {
    if (donorCount > maxDonationCount) {
      maxDonationCount = donorCount;
    }
  }

  const mostFrequentDonors = Object.entries(donorDonationCounts)
    .filter(([, donorCount]) => donorCount === maxDonationCount)
    .map(([name, donorCount]) => ({
      name,
      count: donorCount,
      sum: donorDonations[name],
    }));

  const frequentDonor =
    mostFrequentDonors.length === 1 ? mostFrequentDonors[0] : undefined;

  return {
    sum,
    count,
    firstDonationDate,
    topDonors,
    ...(biggestSingularDonation ? { biggestSingularDonation } : {}),
    ...(biggestDonor ? { biggestDonor } : {}),
    ...(frequentDonor ? { frequentDonor } : {}),
    donorTypes,
    donationTypes,
  };
};

import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import { PartyStatField } from "@/types/party-stats";

export interface DonationStackedYearsData {
  years: string[];
  yearSums: { year: string; sum: number }[];
}

export const donationStackedYearsPartySumsData = (
  partyYearsSums: PartyYearsSums,
): DonationStackedYearsData => {
  const years = Object.keys(partyYearsSums);

  return {
    years,
    yearSums: years.map((year) => ({
      year,
      sum: Object.values(partyYearsSums[year])
        .map((p) => p[PartyStatField.Sum])
        .reduce((a, b) => a + b, 0),
    })),
  };
};

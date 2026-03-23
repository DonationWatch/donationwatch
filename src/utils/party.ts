import type { CountryConfig } from "@/utils/countries";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import { Features, hasFeature } from "@/utils/features";

export const yearPartiesHaveYearOnlyDonations = (
  partySums: PartyYearsSums,
  years: string[],
): boolean => {
  return years.some((year) =>
    Object.values(partySums[year] ?? []).some(
      (partyStats) => partyStats.hasYearOnlyDonations,
    ),
  );
};

export const canShowYearsTimeline = (
  countryConfig: CountryConfig,
  partySums: PartyYearsSums,
  years: string[],
): boolean => {
  const containsYearOnlyDonations = yearPartiesHaveYearOnlyDonations(
    partySums,
    years,
  );

  if (
    !hasFeature(countryConfig, Features.Date) ||
    // if we have years with year donations, we consider this as country without date for the picked range
    containsYearOnlyDonations
  ) {
    // Timeline charts have a fallback for countries without date to show sums per year.
    // This makes sense only if we filter for multiple years
    return years.length > 1;
  }

  return true;
};

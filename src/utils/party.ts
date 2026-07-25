import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ReceiverId } from "@/utils/types";

import { PartyField } from "@/types/party";
import { PartyStatField } from "@/types/party-stats";
import { Features, hasFeature } from "@/utils/features";
import { getBuild } from "@/utils/loader/build";

export const getLongName = (party: Party): string =>
  party[PartyField.Name] ?? party[PartyField.Short];

export const yearPartiesHaveYearOnlyDonations = (
  partySums: PartyYearsSums,
  years: string[],
): boolean => {
  return years.some((year) =>
    Object.values(partySums[year] ?? []).some(
      (partyStats) => partyStats[PartyStatField.HasYearOnlyDonations],
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

export const hasYearSums = (partySums: PartyYearsSums, years: string[]) => {
  const yearSet = new Set(years);
  for (const [year, sums] of Object.entries(partySums)) {
    if (yearSet.has(year) && Object.keys(sums).length > 0) {
      return true;
    }
  }
  return false;
};

export const lastPartyStatsDonation = (
  country: CountryConfig,
  sums: PartyYearsSums,
  filter?: { year?: string; partyId?: ReceiverId },
): string | undefined => {
  let lastDonation: string | undefined = undefined;

  const hasYearFilter = filter?.year !== undefined;
  const hasPartyIdFilter = filter?.partyId !== undefined;

  for (const year in sums) {
    if (hasYearFilter && year !== filter.year) {
      continue;
    }

    const yearSums = sums[year];
    for (const party in yearSums) {
      if (hasPartyIdFilter && party !== filter.partyId) {
        continue;
      }

      const partyStats = yearSums[party];
      if (partyStats[PartyStatField.LastDonation]) {
        if (
          !lastDonation ||
          partyStats[PartyStatField.LastDonation] > lastDonation
        ) {
          lastDonation = partyStats[PartyStatField.LastDonation];
        }
      }
    }
  }

  if (lastDonation?.length === 4) {
    // is just a year, pad it to the end of the year
    lastDonation += "-12-31";
  }

  const buildIsoString = new Date(getBuild(country.id).t)
    .toISOString()
    .substring(0, "2020-01-01".length);

  if (lastDonation && lastDonation > buildIsoString) {
    // if the last donation is after the build date, use the build date
    lastDonation = buildIsoString;
  }

  return lastDonation;
};

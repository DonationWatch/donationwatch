import { getBuild } from "./build";
import { loadCountryData } from "./country-data-loaders";

import type { Country, CountryConfig } from "../countries";
import type { ReceiverId } from "../types";

export interface PartyStats {
  sum: number;
  count: number;
  average: number;
  lastDonation: string;
  hasYearOnlyDonations?: boolean;
}

// [year]: { [party]: PartyStats }
export type PartyYearsSums = Record<string, Record<string, PartyStats>>;

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
      if (partyStats.lastDonation) {
        if (!lastDonation || partyStats.lastDonation > lastDonation) {
          lastDonation = partyStats.lastDonation;
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

export const getPartyYearsSums = (country: Country): Promise<PartyYearsSums> =>
  loadCountryData(country, "partySums");

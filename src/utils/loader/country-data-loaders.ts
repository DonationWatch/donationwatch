import type { Country } from "../countries";
import type { Donation, Party } from "../types";
import type { BigDonor } from "./biggest-donors";
import type { PartyYearsSums } from "./party-years-sums";
import type { HistoryEntry } from "../data/get-history";

type DefaultExport<T> = { default: T };

interface CountryLoaders {
  wiki: (
    country: Country,
  ) => Promise<DefaultExport<{ articles: Record<number, string> }>>;
  partySums: (country: Country) => Promise<DefaultExport<PartyYearsSums>>;
  mostRecent: (country: Country) => Promise<DefaultExport<HistoryEntry[]>>;
  biggestDonors: (country: Country) => Promise<DefaultExport<BigDonor[]>>;
  yearParties: (country: Country) => Promise<
    DefaultExport<{
      years: string[];
      parties: Party[];
    }>
  >;
  transparency: (country: Country) => Promise<
    DefaultExport<{
      filteredDonors: string[];
      normalizedDonors: Record<string, string[]>;
    }>
  >;
  biggestDonations: (country: Country) => Promise<DefaultExport<Donation[]>>;
}

import(`../../data/australia/config`);

const loaders: CountryLoaders = {
  wiki: (country: Country) =>
    import(`../../data/${country}/wikipedia-articles`),
  partySums: (country: Country) => import(`../../data/${country}/party-sums`),
  mostRecent: (country: Country) => import(`../../data/${country}/most-recent`),
  biggestDonors: (country: Country) =>
    import(`../../data/${country}/biggest-donors`),
  yearParties: (country: Country) => import(`../../data/${country}/config`),
  transparency: (country: Country) =>
    import(`../../data/${country}/transparency`),
  biggestDonations: (country: Country) =>
    import(`../../data/${country}/biggest-donations`),
};

export const loadCountryData = async <KIND extends keyof CountryLoaders>(
  country: Country,
  kind: KIND,
): Promise<Awaited<ReturnType<CountryLoaders[KIND]>>["default"]> => {
  return await loaders[kind](country).then((module) => module.default);
};

import "server-only";
import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { Party } from "@donationwatch/core/types/party";
import type { Country } from "@donationwatch/core/utils/countries";
import type { Donation } from "@donationwatch/core/utils/types";

import type { HistoryEntry } from "../queries/get-history";
import type { BigDonor } from "./biggest-donors";
import type { CountryPartyDonorStats } from "./party-donor-stats";
import type { PartyYearsSums } from "./party-years-sums";

type DefaultExport<T> = { default: T };

interface CountryLoaders {
  partySums: (country: Country) => Promise<DefaultExport<PartyYearsSums>>;
  partyDonorStats: (
    country: Country,
  ) => Promise<DefaultExport<CountryPartyDonorStats>>;
  mostRecent: (country: Country) => Promise<DefaultExport<HistoryEntry[]>>;
  biggestDonors: (country: Country) => Promise<DefaultExport<BigDonor[]>>;
  wikiDonors: (country: Country) => Promise<DefaultExport<BigDonor[]>>;
  countryConfig: (country: Country) => Promise<DefaultExport<CountryConfig>>;
  parties: (country: Country) => Promise<DefaultExport<Party[]>>;
  biggestDonations: (country: Country) => Promise<DefaultExport<Donation[]>>;
}

// Note: anything that's imported here will be bundled in the server bundle
const loaders: CountryLoaders = {
  partySums: (country: Country) =>
    import(`../countries/${country}/party-sums.ts`),
  partyDonorStats: (country: Country) =>
    import(`../countries/${country}/party-donor-stats.ts`),
  mostRecent: (country: Country) =>
    import(`../countries/${country}/most-recent.ts`),
  biggestDonors: (country: Country) =>
    import(`../countries/${country}/biggest-donors.ts`),
  wikiDonors: (country: Country) =>
    import(`../countries/${country}/wiki-donors.ts`),
  countryConfig: (country: Country) =>
    import(`../countries/${country}/country-config.ts`),
  parties: (country: Country) => import(`../countries/${country}/parties.ts`),
  biggestDonations: (country: Country) =>
    import(`../countries/${country}/biggest-donations.ts`),
};

export const loadCountryData = async <KIND extends keyof CountryLoaders>(
  country: Country,
  kind: KIND,
): Promise<Awaited<ReturnType<CountryLoaders[KIND]>>["default"]> => {
  return await loaders[kind](country).then((module) => module.default);
};

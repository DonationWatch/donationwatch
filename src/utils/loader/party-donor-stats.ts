import type { Country } from "../countries";
import type { CountryPartyDonorStats } from "../data/get-party-donor-stats";

import { loadCountryData } from "./country-data-loaders";

export type {
  CountryPartyDonorStats,
  PartyDonorStats,
} from "../data/get-party-donor-stats";

export const getPartyDonorStats = (
  country: Country,
): Promise<CountryPartyDonorStats> =>
  loadCountryData(country, "partyDonorStats");

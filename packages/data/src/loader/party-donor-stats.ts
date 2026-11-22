import "server-only";
import type { Country } from "@donationwatch/core/utils/countries";

import type { CountryPartyDonorStats } from "../queries/get-party-donor-stats";

import { loadCountryData } from "./country-data-loaders";

export type {
  CountryPartyDonorStats,
  PartyDonorStats,
} from "../queries/get-party-donor-stats";

export const getPartyDonorStats = (
  country: Country,
): Promise<CountryPartyDonorStats> =>
  loadCountryData(country, "partyDonorStats");

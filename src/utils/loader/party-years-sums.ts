import type { PartyStats } from "@/types/party-stats";

import type { Country } from "../countries";

import { loadCountryData } from "./country-data-loaders";

// [year]: { [party]: PartyStats }
export type PartyYearsSums = Record<string, Record<string, PartyStats>>;

export const getPartyYearsSums = (country: Country): Promise<PartyYearsSums> =>
  loadCountryData(country, "partySums");

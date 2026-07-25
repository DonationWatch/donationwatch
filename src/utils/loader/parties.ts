import type { Party } from "@/types/party";

import type { Country } from "../countries";

import { loadCountryData } from "./country-data-loaders";

export const getParties = async (country: Country): Promise<Party[]> => {
  return loadCountryData(country, "parties");
};

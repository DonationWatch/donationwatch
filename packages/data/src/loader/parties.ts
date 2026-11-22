import "server-only";
import type { Party } from "@donationwatch/core/types/party";
import type { Country } from "@donationwatch/core/utils/countries";

import { loadCountryData } from "./country-data-loaders";

export const getParties = async (country: Country): Promise<Party[]> => {
  return loadCountryData(country, "parties");
};

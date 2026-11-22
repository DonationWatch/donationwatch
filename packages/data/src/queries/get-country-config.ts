import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { Country } from "@donationwatch/core/utils/countries";

import { loadCountryData } from "../loader/country-data-loaders";

export const getCountryConfig = async (
  country: Country,
): Promise<CountryConfig> => {
  return loadCountryData(country, "countryConfig");
};

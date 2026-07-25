import type { CountryConfig } from "@/types/country-config";

import type { Country } from "../countries";

import { loadCountryData } from "../loader/country-data-loaders";

export const getCountryConfig = async (
  country: Country,
): Promise<CountryConfig> => {
  return loadCountryData(country, "countryConfig");
};

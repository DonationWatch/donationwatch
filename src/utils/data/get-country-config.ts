import type { CountryConfig } from "@/types/country-config";

import { Country } from "../countries";
import { loadCountryData } from "../loader/country-data-loaders";

export const getCountryConfig = (country: Country): Promise<CountryConfig> => {
  return loadCountryData(country, "countryConfig");
};

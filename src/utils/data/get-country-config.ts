import type { CountryConfig } from "../countries";

import { Country, COUNTRY_CONFIG } from "../countries";
import { loadCountryData } from "../loader/country-data-loaders";

const loaded: Record<string, CountryConfig> = {};
export const getCountryConfig = async (
  country: Country,
): Promise<CountryConfig> => {
  // return cached one
  if (loaded[country]) return loaded[country];

  const dataset = await loadCountryData(country, "yearParties");

  const config = {
    ...COUNTRY_CONFIG[country],
    ...dataset,
  };

  loaded[country] = config;
  return config;
};

import { type CountryConfig, getCountryName } from "./countries";

import type { Translations } from "../messages/translations";

export const generateCountryTitlePart = (
  country: CountryConfig,
  translations: Translations,
): string => {
  return getCountryName(country, translations);
};

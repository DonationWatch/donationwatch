import { type CountryConfig, getCountryName } from "./countries";

import type { createTranslator, Messages } from "next-intl";

export const generateCountryTitlePart = (
  country: CountryConfig,
  t: ReturnType<typeof createTranslator<Messages>>,
): string => {
  return getCountryName(country, t);
};

import { type CountryConfig, getCountryName } from "./countries";

import type { StrictNamespacedTranslator } from "@/utils/translator";

export const generateCountryTitlePart = (
  country: CountryConfig,
  t: StrictNamespacedTranslator<"countries">,
): string => {
  return getCountryName(country, t);
};

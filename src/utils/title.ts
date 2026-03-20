import type { StrictNamespacedTranslator } from "@/utils/translator";

import { type CountryConfig, getCountryName } from "./countries";

export const generateCountryTitlePart = (
  country: CountryConfig,
  t: StrictNamespacedTranslator<"countries">,
): string => {
  return getCountryName(country, t);
};

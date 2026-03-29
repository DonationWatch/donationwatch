import type { CountryConfig } from "@/types/country-config";
import type { StrictNamespacedTranslator } from "@/utils/translator";

import { getCountryName } from "./countries";

export const generateCountryTitlePart = (
  country: CountryConfig,
  t: StrictNamespacedTranslator<"countries">,
): string => {
  return getCountryName(country, t);
};

import type { CountryConfig } from "@donationwatch/core/types/country-config";

import { getCountryName } from "@donationwatch/core/utils/countries";

import type { StrictNamespacedTranslator } from "@/utils/translator";

export const generateCountryTitlePart = (
  country: CountryConfig,
  t: StrictNamespacedTranslator<"countries">,
): string => {
  return getCountryName(country, t);
};

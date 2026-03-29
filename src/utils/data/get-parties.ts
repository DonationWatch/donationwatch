import { getTranslations } from "next-intl/server";

import type { CountryConfig } from "@/types/country-config";

export const getParties = (country: CountryConfig, years: string[]) => {
  const yearsSet = new Set(years);
  return country.parties.filter((party) =>
    party.years.some((year) => yearsSet.has(year)),
  );
};

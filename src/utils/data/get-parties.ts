import type { CountryConfig } from "@/types/country-config";

import { PartyField } from "@/types/party";

export const getParties = (country: CountryConfig, years: string[]) => {
  const yearsSet = new Set(years);
  return country.parties.filter((party) =>
    party[PartyField.Years].some((year) => yearsSet.has(year)),
  );
};

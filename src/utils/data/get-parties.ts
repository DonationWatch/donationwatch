import type { CountryConfig } from "@/types/country-config";

import { PartyField } from "@/types/party";
import { firstItem, lastItem } from "@/utils/array";

/**
 * Return parties filtered down to the ones that have donations in the given years
 * @param country
 * @param years
 */
export const getParties = (country: CountryConfig, years: string[]) => {
  // 1. Convert the query years to numbers once upfront for efficiency
  const numericYears = years.map(Number);

  return country.parties.filter((party) => {
    const from = Number(firstItem(party[PartyField.Years]));
    const to = Number(lastItem(party[PartyField.Years]));

    // 3. Keep the party if ANY of the requested years fall within its active range
    return numericYears.some((year) => year >= from && year <= to);
  });
};

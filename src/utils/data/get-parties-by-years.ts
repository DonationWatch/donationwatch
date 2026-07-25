import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";

import { Party, PartyField } from "@/types/party";
import { firstItem, lastItem } from "@/utils/array";

/**
 * Return parties filtered down to the ones that have donations in the given years
 * @param years
 * @param parties
 */
export const getPartiesByYears = (years: string[], parties: Party[]) => {
  // 1. Convert the query years to numbers once upfront for efficiency
  const numericYears = years.map(Number);

  return parties.filter((party) => {
    const from = Number(firstItem(party[PartyField.Years]));
    const to = Number(lastItem(party[PartyField.Years]));

    // 3. Keep the party if ANY of the requested years fall within its active range
    return numericYears.some((year) => year >= from && year <= to);
  });
};

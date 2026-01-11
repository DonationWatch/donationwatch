import { loadCountryData } from "./country-data-loaders";

import type { Country } from "../countries";
import type { PartyYearsSums } from "./party-years-sums";

// [year]: { [party]: PartyStats }
export interface BigDonor {
  id: string;
  sum: number;
  name: string;
  partyYearSums: PartyYearsSums;
}

export const getBiggestDonors = async (country: Country): Promise<BigDonor[]> =>
  loadCountryData(country, "biggestDonors");

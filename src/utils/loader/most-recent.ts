import type { Country } from "../countries";
import type { HistoryEntry } from "../data/get-history";

import { loadCountryData } from "./country-data-loaders";

export const getMostRecent = async (
  country: Country,
): Promise<HistoryEntry[]> => loadCountryData(country, "mostRecent");

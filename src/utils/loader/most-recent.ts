import { loadCountryData } from "./country-data-loaders";

import type { Country } from "../countries";
import type { HistoryEntry } from "../data/get-history";

export const getMostRecent = async (
  country: Country,
): Promise<HistoryEntry[]> => loadCountryData(country, "mostRecent");

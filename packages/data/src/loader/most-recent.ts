import type { Country } from "@donationwatch/core/utils/countries";

import type { HistoryEntry } from "../queries/get-history";

import { loadCountryData } from "./country-data-loaders";

export const getMostRecent = async (
  country: Country,
): Promise<HistoryEntry[]> => loadCountryData(country, "mostRecent");

import { loadCountryData } from "./country-data-loaders";

import type { Country } from "../countries";

export const getWikiArticles = (
  country: Country,
): Promise<{ articles: Record<number, string> }> =>
  loadCountryData(country, "wiki");

import type { Country } from "../countries";
import type { BigDonor } from "./biggest-donors";

import { loadCountryData } from "./country-data-loaders";

export const getWikiDonors = async (country: Country): Promise<BigDonor[]> =>
  loadCountryData(country, "wikiDonors");

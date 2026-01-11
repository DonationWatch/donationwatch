import { loadCountryData } from "./country-data-loaders";

import type { Country } from "../countries";

export const getTransparency = async (country: Country) =>
  loadCountryData(country, "transparency");

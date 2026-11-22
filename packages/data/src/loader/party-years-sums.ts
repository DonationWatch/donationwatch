import "server-only";
import type { PartyYearsSums } from "@donationwatch/core/types/party-stats";
import type { Country } from "@donationwatch/core/utils/countries";

import { loadCountryData } from "./country-data-loaders";

export type { PartyYearsSums };

export const getPartyYearsSums = (country: Country): Promise<PartyYearsSums> =>
  loadCountryData(country, "partySums");

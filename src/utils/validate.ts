import { COUNTRIES } from "./countries";
import { LOCALES_SET } from "./locales";

import type { Country, CountryConfig } from "./countries";
import type { ConstLocale } from "./locales";
import type { ReceiverId } from "./types";

export const isValidLocale = (locale: string): locale is ConstLocale => {
  return LOCALES_SET.has(locale as ConstLocale);
};

export const isValidCountry = (country: string): country is Country => {
  return COUNTRIES.has(country as Country);
};

export const isValidParty = (
  partyId: string,
  countryConfig: CountryConfig,
): partyId is ReceiverId => {
  return Boolean(countryConfig.partiesById[partyId as ReceiverId]);
};

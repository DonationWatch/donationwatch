import type { CountryConfig } from "@/types/country-config";

import { getParty } from "@/config/parties";

import type { Country } from "./countries";
import type { ConstLocale, MetadataLocale } from "./locales";
import type { ReceiverId } from "./types";

import { COUNTRIES } from "./countries";
import { LOCALES_SET } from "./locales";

export const isValidLocale = (
  locale: string | undefined,
): locale is ConstLocale => {
  if (!locale) return false;

  return LOCALES_SET.has(locale as ConstLocale);
};

export const isValidMetadataLocale = (
  locale: string | undefined,
): locale is MetadataLocale => {
  return isValidLocale(locale);
};

export const isValidCountry = (country: string): country is Country => {
  return COUNTRIES.has(country as Country);
};

export const isValidParty = (
  partyId: string,
  countryConfig: CountryConfig | Country,
): partyId is ReceiverId => {
  const countryId =
    typeof countryConfig === "string" ? countryConfig : countryConfig.id;

  return getParty(countryId, partyId as ReceiverId) !== undefined;
};

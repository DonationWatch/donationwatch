import type { Country } from "./countries";
import type { ConstLocale, MetadataLocale } from "./locales";

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

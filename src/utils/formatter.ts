import type { CountryConfig } from "@/types/country-config";

import { PartyField } from "@/types/party";

import type { Currency } from "./countries";
import type {
  BrowserBasedLocale,
  ImageLocale,
  MetadataLocale,
} from "./locales";
import type { ReceiverId } from "./types";

import { getParty } from "./countries";
import { createIntlCache } from "./intl-cache";

const currencyFormatter = createIntlCache(
  (locale: BrowserBasedLocale, currency: "EUR" | "CHF") =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }),
);
const currencyCompactFormatter = createIntlCache(
  (locale: BrowserBasedLocale | ImageLocale, currency: "EUR" | "CHF") =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      notation: "compact",
      currency,
    }),
);

export const formatCountryCurrency = (
  locale: BrowserBasedLocale | ImageLocale | MetadataLocale,
  amount: number,
  country: CountryConfig,
) => {
  return formatCurrency(locale, amount, country.currency);
};

export const formatCurrency = (
  locale: BrowserBasedLocale | ImageLocale | MetadataLocale,
  amount: number,
  currency: Currency,
) => {
  return currencyFormatter(locale, currency).format(amount);
};

export const formatCompactCountryCurrency = (
  locale: BrowserBasedLocale | ImageLocale | MetadataLocale,
  amount: number,
  country: CountryConfig,
) => {
  return formatCompactCurrency(locale, amount, country.currency);
};

export const formatCompactCurrency = (
  locale: BrowserBasedLocale | ImageLocale | MetadataLocale,
  amount: number,
  currency: Currency,
) => {
  return currencyCompactFormatter(locale, currency).format(amount);
};

const dateFormatter = createIntlCache(
  (locale) =>
    new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
    }),
);
export const formatDate = (
  locale: BrowserBasedLocale | ImageLocale,
  date: Date | number,
) => {
  return dateFormatter(locale).format(date);
};

const yearFormatter = createIntlCache(
  (locale) =>
    new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }),
);

export const formatYear = (locale: BrowserBasedLocale, date: Date | number) => {
  return yearFormatter(locale).format(date);
};

const monthYearFormatter = createIntlCache(
  (locale: BrowserBasedLocale) =>
    new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }),
);
export const formatMonthYear = (
  locale: BrowserBasedLocale,
  date: Date | number,
) => {
  return monthYearFormatter(locale).format(date);
};

const twoDigitDateFormatter = createIntlCache(
  (locale: BrowserBasedLocale | ImageLocale) =>
    new Intl.DateTimeFormat(locale, {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }),
);
export const formatTwoDigitDate = (
  locale: BrowserBasedLocale | ImageLocale,
  date: Date | number,
) => {
  return twoDigitDateFormatter(locale).format(date);
};

const relativeDateFormatter = createIntlCache(
  (locale: BrowserBasedLocale | ImageLocale) =>
    new Intl.RelativeTimeFormat(locale, {
      style: "short",
    }),
);
export const formatRelativeDate = (
  locale: BrowserBasedLocale | ImageLocale,
  diff: number,
  unit: Intl.RelativeTimeFormatUnit,
) => {
  if (diff === 0) return "";

  return relativeDateFormatter(locale).format(diff, unit);
};

const percentFormatter = createIntlCache(
  (locale: BrowserBasedLocale | ImageLocale) =>
    new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
);
export const formatPercentFormat = (
  locale: BrowserBasedLocale | ImageLocale,
  value: number,
) => {
  return percentFormatter(locale).format(value);
};

export const andFormatter = createIntlCache(
  (locale) =>
    new Intl.ListFormat(locale, {
      style: "long",
      type: "conjunction",
    }),
);
export const formatAnd = (
  locale: BrowserBasedLocale | ImageLocale,
  values: string[],
): string => {
  return andFormatter(locale).format(values);
};

const numberFormatter = createIntlCache(
  (locale: BrowserBasedLocale | ImageLocale) => new Intl.NumberFormat(locale),
);
export const formatNumber = (
  locale: BrowserBasedLocale | ImageLocale,
  value: number,
): string => {
  return numberFormatter(locale).format(value);
};

const oneFractionNumberFormatter = createIntlCache(
  (locale: BrowserBasedLocale | ImageLocale) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
);
export const formatOneFractionNumber = (
  locale: BrowserBasedLocale | ImageLocale,
  value: number,
): string => {
  return oneFractionNumberFormatter(locale).format(value);
};

export const formatYearsRange = (years: string[]): string => {
  if (years.length === 1) return `${years.at(0)}`;
  if (years.length < 2) return "";

  const first = years.at(0);
  const last = years.at(-1);

  if (first === last) return `${first}`;

  return `${first} - ${last}`;
};

export const formatPartyShortName = (
  country: CountryConfig,
  partyId: ReceiverId,
) => {
  return getParty(country, partyId)[PartyField.Short];
};

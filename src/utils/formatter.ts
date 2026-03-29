import type { CountryConfig } from "@/types/country-config";

import { PartyField } from "@/types/party";

import type { Currency } from "./countries";
import type { ConstLocale } from "./locales";
import type { ReceiverId } from "./types";

import { getParty } from "./countries";
import { createIntlCache } from "./intl-cache";

const currencyFormatter = createIntlCache(
  (locale: ConstLocale, currency: "EUR" | "CHF") =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }),
);
const currencyCompactFormatter = createIntlCache(
  (locale: ConstLocale, currency: "EUR" | "CHF") =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      notation: "compact",
      currency,
    }),
);

export const formatCountryCurrency = (
  locale: ConstLocale,
  amount: number,
  country: CountryConfig,
) => {
  return formatCurrency(locale, amount, country.currency);
};

export const formatCurrency = (
  locale: ConstLocale,
  amount: number,
  currency: Currency,
) => {
  return currencyFormatter(locale, currency).format(amount);
};

export const formatCompactCountryCurrency = (
  locale: ConstLocale,
  amount: number,
  country: CountryConfig,
) => {
  return formatCompactCurrency(locale, amount, country.currency);
};

export const formatCompactCurrency = (
  locale: ConstLocale,
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
export const formatDate = (locale: ConstLocale, date: Date | number) => {
  return dateFormatter(locale).format(date);
};

const yearFormatter = createIntlCache(
  (locale) =>
    new Intl.DateTimeFormat(locale, {
      year: "numeric",
    }),
);

export const formatYear = (locale: ConstLocale, date: Date | number) => {
  return yearFormatter(locale).format(date);
};

const monthYearFormatter = createIntlCache(
  (locale: ConstLocale) =>
    new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }),
);
export const formatMonthYear = (locale: ConstLocale, date: Date | number) => {
  return monthYearFormatter(locale).format(date);
};

const twoDigitDateFormatter = createIntlCache(
  (locale: ConstLocale) =>
    new Intl.DateTimeFormat(locale, {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    }),
);
export const formatTwoDigitDate = (
  locale: ConstLocale,
  date: Date | number,
) => {
  return twoDigitDateFormatter(locale).format(date);
};

const relativeDateFormatter = createIntlCache(
  (locale: ConstLocale) =>
    new Intl.RelativeTimeFormat(locale, {
      style: "short",
    }),
);
export const formatRelativeDate = (
  locale: ConstLocale,
  diff: number,
  unit: Intl.RelativeTimeFormatUnit,
) => {
  if (diff === 0) return "";

  return relativeDateFormatter(locale).format(diff, unit);
};

const percentFormatter = createIntlCache(
  (locale: ConstLocale) =>
    new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
);
export const formatPercentFormat = (locale: ConstLocale, value: number) => {
  return percentFormatter(locale).format(value);
};

export const andFormatter = createIntlCache(
  (locale) =>
    new Intl.ListFormat(locale, {
      style: "long",
      type: "conjunction",
    }),
);
export const formatAnd = (locale: ConstLocale, values: string[]): string => {
  return andFormatter(locale).format(values);
};

const numberFormatter = createIntlCache(
  (locale: ConstLocale) => new Intl.NumberFormat(locale),
);
export const formatNumber = (locale: ConstLocale, value: number): string => {
  return numberFormatter(locale).format(value);
};

const oneFractionNumberFormatter = createIntlCache(
  (locale: ConstLocale) =>
    new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
);
export const formatOneFractionNumber = (
  locale: ConstLocale,
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

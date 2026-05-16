"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Currency } from "@/utils/countries";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import {
  formatCompactCountryCurrency,
  formatCompactCurrency,
  formatCountryCurrency,
  formatNumber,
  formatTwoDigitDate,
} from "@/utils/formatter";

export const FormattedTwoDigitDate = ({ date }: { date: Date }) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return formatTwoDigitDate(browserBasedLocale, date);
};

export const FormattedCompactCurrency = ({
  value,
  currency,
}: {
  value: number;
  currency: Currency;
}) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return formatCompactCurrency(browserBasedLocale, value, currency);
};

export const FormattedCompactCountryCurrency = ({
  value,
  country,
}: {
  value: number;
  country: CountryConfig;
}) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return formatCompactCountryCurrency(browserBasedLocale, value, country);
};

export const FormattedCountryCurrency = ({
  value,
  country,
}: {
  value: number;
  country: CountryConfig;
}) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return formatCountryCurrency(browserBasedLocale, value, country);
};

export const FormattedNumber = ({ value }: { value: number }) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return formatNumber(browserBasedLocale, value);
};

"use client";

import type { Currency } from "@donationwatch/core/utils/countries";

import {
  formatCompactCountryCurrency,
  formatCompactCurrency,
  formatCountryCurrency,
  formatNumber,
} from "@donationwatch/core/utils/formatter";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";

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
}: {
  value: number;
}) => {
  const country = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();

  return formatCompactCountryCurrency(browserBasedLocale, value, country);
};

export const FormattedCountryCurrency = ({ value }: { value: number }) => {
  const country = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();

  return formatCountryCurrency(browserBasedLocale, value, country);
};

export const FormattedNumber = ({ value }: { value: number }) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return formatNumber(browserBasedLocale, value);
};

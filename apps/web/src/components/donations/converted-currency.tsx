"use client";

import type { Currency } from "@donationwatch/core/utils/countries";

import { formatCurrency } from "@donationwatch/core/utils/formatter";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";

export const ConvertedCurrency = ({
  valueInEur,
  originalValue,
  originalCurrency,
}: {
  valueInEur: number;
  originalValue: number;
  originalCurrency: Currency;
}) => {
  const browserBasedLocale = useBrowserBasedLocale();
  const title =
    originalCurrency !== "EUR"
      ? formatCurrency(browserBasedLocale, originalValue, originalCurrency)
      : undefined;

  return (
    <span title={title}>
      {formatCurrency(browserBasedLocale, valueInEur, "EUR")}
    </span>
  );
};

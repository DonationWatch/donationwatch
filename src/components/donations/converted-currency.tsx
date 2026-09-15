"use client";

import type { Currency } from "@/utils/countries";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { formatCurrency } from "@/utils/formatter";

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

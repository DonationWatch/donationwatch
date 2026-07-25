"use client";

import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { cn } from "@/lib/utils";
import { PartyField } from "@/types/party";
import { formatCountryCurrency } from "@/utils/formatter";

import type { StackedPartiesConfig } from "./stacked-party-line-config";

export const StackedPartyDonations = ({
  data,
  direction = "horizontal",
}: {
  data: StackedPartiesConfig;
  direction?: "horizontal" | "vertical";
}) => {
  const browserBasedLocale = useBrowserBasedLocale();
  const country = useRequiredCountryConfig();
  const partiesMap = usePartiesMap();

  const { sum, sums } = data;

  if (!sum || sums.length === 0) return null;

  const totalTitle = sums
    .map(
      ([party, amount]) =>
        `${partiesMap[party][PartyField.Short]}: ${formatCountryCurrency(browserBasedLocale, amount, country)}`,
    )
    .join("\n");

  return (
    <div
      aria-hidden="true"
      title={totalTitle}
      className={cn(
        "flex h-full w-full gap-0.5 *:h-full *:rounded-xs",
        direction === "horizontal" ? "" : "flex-col",
      )}
    >
      {sums.map(([party, amount]) => (
        <div
          key={party}
          style={{
            backgroundColor: partiesMap[party][PartyField.Color],
            [direction === "horizontal" ? "width" : "height"]:
              `${((amount / sum) * 100).toFixed(2)}%`,
          }}
        />
      ))}
    </div>
  );
};

export const AbsoluteMultiplePartySumsGradient = ({
  data,
}: {
  data: StackedPartiesConfig;
}) => {
  const partiesMap = usePartiesMap();

  const { sum, sums } = data;

  if (!sum || sums.length === 0) return null;

  return (
    <AbsoluteMultipleColorsGradient
      colors={sums.map(([party, data]) => ({
        color: partiesMap[party][PartyField.Color],
        width: Number(((data / sum) * 100).toFixed(2)),
      }))}
    />
  );
};

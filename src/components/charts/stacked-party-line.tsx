"use client";

import type { CountryConfig } from "@/types/country-config";

import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { cn } from "@/lib/utils";
import { PartyField } from "@/types/party";
import { partyColor } from "@/utils/color";
import { getParty } from "@/utils/countries";
import { formatCountryCurrency } from "@/utils/formatter";

import type { StackedPartiesConfig } from "./stacked-party-line-config";

export const StackedPartyDonations = ({
  data,
  country,
  direction = "horizontal",
}: {
  data: StackedPartiesConfig;
  country: CountryConfig;
  direction?: "horizontal" | "vertical";
}) => {
  const browserBasedLocale = useBrowserBasedLocale();
  const { sum, sums } = data;

  return (
    <div
      aria-hidden="true"
      className={cn(
        `flex h-full w-full gap-0.5 *:h-full *:rounded-xs`,
        direction === "horizontal" ? "" : "flex-col",
      )}
    >
      {sums.map(([party, data]) => (
        <div
          key={party}
          title={`${getParty(country, party)[PartyField.Short]}: ${formatCountryCurrency(browserBasedLocale, data, country)}`}
          style={{
            backgroundColor: partyColor(party, country),
            [direction === "horizontal" ? "width" : "height"]:
              `${100 * (data / sum)}%`,
          }}
        ></div>
      ))}
    </div>
  );
};

export const AbsoluteMultiplePartySumsGradient = ({
  data,
  country,
}: {
  data: StackedPartiesConfig;
  country: CountryConfig;
}) => {
  const { sum, sums } = data;

  return (
    <AbsoluteMultipleColorsGradient
      colors={sums.map(([party, data]) => ({
        color: partyColor(party, country),
        width: 100 * (data / sum),
      }))}
    />
  );
};

import { AbsoluteMultipleColorsGradient } from "./absolute-multiple-colors-gradient";
import { partyColor } from "../utils/color";
import { type CountryConfig, getParty } from "../utils/countries";
import { formatCountryCurrency } from "../utils/formatter";

import type {
  PartyStats,
  PartyYearsSums,
} from "../utils/loader/party-years-sums";
import type { ConstLocale } from "../utils/locales";
import type { ReceiverId } from "../utils/types";

export const StackedPartyDonations = ({
  years,
  country,
  // TODO: handle donator support
  locale,
  partyYearsSums,
  direction = "horizontal",
}: {
  country: CountryConfig;
  years: string[];
  locale: ConstLocale;
  partyYearsSums: PartyYearsSums;
  direction?: "horizontal" | "vertical";
}) => {
  const sums: Record<ReceiverId, number> = {};
  let sum = 0;

  const yearsSet = new Set(years);

  Object.entries(partyYearsSums).forEach(([year, yearSums]) => {
    if (!yearsSet.has(year)) return;

    (Object.entries(yearSums) as [ReceiverId, PartyStats][]).forEach(
      ([party, partySum]) => {
        sums[party] ??= 0;
        sum += partySum.sum;
        sums[party] += partySum.sum;
      },
    );
  });

  const sortedSums = (Object.entries(sums) as [ReceiverId, number][])
    .filter(([, data]) => data > 0)
    .toSorted(([, dataA], [, dataB]) => dataB - dataA);

  return (
    <div
      aria-hidden="true"
      className={
        `flex h-full w-full gap-0.5 *:h-full *:rounded-xs` +
        (direction === "horizontal" ? "" : " flex-col")
      }
    >
      {sortedSums.map(([party, data]) => (
        <div
          key={party}
          title={`${getParty(country, party).short}: ${formatCountryCurrency(locale, data, country)}`}
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
  partyYearsSums,
  years,
  country,
}: {
  partyYearsSums: PartyYearsSums;
  years: string[];
  country: CountryConfig;
}) => {
  const sums: Record<string, number> = {};
  let sum = 0;

  const yearsSet = new Set(years);

  Object.entries(partyYearsSums).forEach(([year, yearSums]) => {
    if (!yearsSet.has(year)) return;

    Object.entries(yearSums).forEach(([party, partySum]) => {
      sums[party] ??= 0;
      sum += partySum.sum;
      sums[party] += partySum.sum;
    });
  });

  const sortedSums = (Object.entries(sums) as [ReceiverId, number][])
    .filter(([, data]) => data > 0)
    .toSorted(([, dataA], [, dataB]) => dataB - dataA);

  return (
    <AbsoluteMultipleColorsGradient
      colors={sortedSums.map(([party, data]) => ({
        color: partyColor(party, country),
        width: 100 * (data / sum),
      }))}
    />
  );
};

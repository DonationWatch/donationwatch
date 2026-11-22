import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { PartyYearsSums } from "@donationwatch/data/loader/party-years-sums";

import { PartyStatField } from "@donationwatch/core/types/party-stats";

import { partyYearsSumsToStackedConfig } from "@/components/charts/stacked-party-line-config";
import { YearCardList } from "@/components/years/year-card-list";

export const YearsCards = ({
  country,
  locale,
  partyYearsSums,
}: {
  country: CountryConfig;
  locale: ConstLocale;
  partyYearsSums: PartyYearsSums;
}) => {
  const years = country.years
    .toReversed()
    .map((year) => {
      const sum = Object.entries(partyYearsSums).reduce(
        (sum, [sumsYear, yearSums]) => {
          if (sumsYear !== year) return sum;

          return (
            sum +
            Object.values(yearSums).reduce(
              (all, stats) => all + stats[PartyStatField.Sum],
              0,
            )
          );
        },
        0,
      );

      return {
        year,
        sum,
        stackedConfig: partyYearsSumsToStackedConfig([year], partyYearsSums),
      };
    })
    .filter(({ sum }) => sum > 0);

  return <YearCardList years={years} country={country} locale={locale} />;
};

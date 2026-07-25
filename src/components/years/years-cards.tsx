import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";

import { partyYearsSumsToStackedConfig } from "@/components/charts/stacked-party-line-config";
import { YearCardList } from "@/components/years/year-card-list";
import { PartyStatField } from "@/types/party-stats";

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

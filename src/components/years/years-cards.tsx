import { useTranslations } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";

import { FormattedCompactCountryCurrency } from "@/components/browser-based-formatter";
import { DynamicStackedPartyDonations } from "@/components/charts/dynamic-stacked-party-line";
import { PartyStatField } from "@/utils/loader/party-years-sums";

const VISIBLE_PARTIES = 6;

const YearCard = ({
  year,
  sum,
  locale,
  country,
  partyYearsSums,
}: {
  year: string;
  locale: ConstLocale;
  country: CountryConfig;
  sum: number;
  partyYearsSums: PartyYearsSums;
}) => {
  return (
    <li key={year}>
      <Link
        prefetch={false}
        href={`/${locale}/${country.id}/${year}/overview`}
        className="card card--action hover:text-primary-600 dark:hover:text-primary-400"
      >
        <div className="mt-1 flex w-full justify-between">
          <span className="font-semibold">{year}</span>
          <FormattedCompactCountryCurrency value={sum} country={country} />
        </div>
        <div className="mt-1 h-1">
          <DynamicStackedPartyDonations
            country={country}
            years={[year]}
            partyYearsSums={partyYearsSums}
          />
        </div>
      </Link>
    </li>
  );
};

export const YearsCards = ({
  country,
  locale,
  partyYearsSums,
}: {
  country: CountryConfig;
  locale: ConstLocale;
  partyYearsSums: PartyYearsSums;
}) => {
  const t = useTranslations("home");

  const years = country.years
    .toReversed()
    .map((year): [string, number] => {
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

      return [year, sum];
    })
    .filter(([, sum]) => sum > 0);
  const otherYearSums = years.slice(VISIBLE_PARTIES);

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {years.slice(0, VISIBLE_PARTIES).map(([year, sum]) => (
          <YearCard
            key={year}
            sum={sum}
            year={year}
            country={country}
            locale={locale}
            partyYearsSums={partyYearsSums}
          />
        ))}
      </ul>
      {otherYearSums.length > 0 ? (
        <details>
          <summary className="my-3 cursor-pointer select-none">
            {t("years.more")}
          </summary>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {years.slice(VISIBLE_PARTIES).map(([year, sum]) => (
              <YearCard
                partyYearsSums={partyYearsSums}
                key={year}
                sum={sum}
                year={year}
                country={country}
                locale={locale}
              />
            ))}
          </ul>
        </details>
      ) : null}
    </>
  );
};

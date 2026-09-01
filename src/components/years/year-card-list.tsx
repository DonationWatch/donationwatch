"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import type { StackedPartiesConfig } from "@/components/charts/stacked-party-line-config";
import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";

import { StackedPartyDonations } from "@/components/charts/stacked-party-line";
import { Card } from "@/components/ui/card";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { formatCompactCountryCurrency } from "@/utils/formatter";

const VISIBLE_YEARS = 6;

// stackedConfig is precomputed by the server caller from the full
// PartyYearsSums so that only the small reduced per-year totals cross the
// server <> client boundary here, not the raw per-party/per-year breakdown.
export interface YearCardItem {
  year: string;
  sum: number;
  stackedConfig: StackedPartiesConfig;
}

const YearCard = ({
  year,
  sum,
  locale,
  country,
  stackedConfig,
}: {
  year: string;
  locale: ConstLocale;
  country: CountryConfig;
  sum: string;
  stackedConfig: StackedPartiesConfig;
}) => {
  return (
    <li key={year}>
      <Card
        variant="action"
        render={
          <Link
            prefetch={false}
            href={`/${locale}/${country.id}/${year}/overview`}
          />
        }
      >
        <div className="mb-2 flex w-full justify-between leading-none">
          <span className="font-semibold">{year}</span>
          {sum}
        </div>
        <div className="mt-1 h-1">
          <StackedPartyDonations data={stackedConfig} />
        </div>
      </Card>
    </li>
  );
};

export const YearCardList = ({
  years,
  country,
  locale,
}: {
  years: YearCardItem[];
  country: CountryConfig;
  locale: ConstLocale;
}) => {
  const t = useTranslations("home");
  const browserBasedLocale = useBrowserBasedLocale();

  const visibleYears = years.slice(0, VISIBLE_YEARS);
  const otherYears = years.slice(VISIBLE_YEARS);

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {visibleYears.map(({ year, sum, stackedConfig }) => (
          <YearCard
            key={year}
            sum={formatCompactCountryCurrency(browserBasedLocale, sum, country)}
            year={year}
            country={country}
            locale={locale}
            stackedConfig={stackedConfig}
          />
        ))}
      </ul>
      {otherYears.length > 0 ? (
        <details>
          <summary className="my-3 cursor-pointer select-none">
            {t("years.more")}
          </summary>
          <ul className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {otherYears.map(({ year, sum, stackedConfig }) => (
              <YearCard
                key={year}
                sum={formatCompactCountryCurrency(
                  browserBasedLocale,
                  sum,
                  country,
                )}
                year={year}
                country={country}
                locale={locale}
                stackedConfig={stackedConfig}
              />
            ))}
          </ul>
        </details>
      ) : null}
    </>
  );
};

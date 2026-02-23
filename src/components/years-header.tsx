"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { DynamicStackedPartyDonations } from "./dynamic-stacked-party-line";
import { ReadonlyTopYearDonationsItem } from "./loading-top-year-donations-item";
import { MetaCard } from "./meta-card";
import { cn } from "../utils/classname";
import { getParties } from "../utils/data/get-parties";
import { getPartiesSum } from "../utils/data/get-parties-sum";
import {
  formatCountryCurrency,
  formatNumber,
  formatYearsRange,
} from "../utils/formatter";
import { numbersAvg } from "../utils/math";
import { serializeYears } from "../utils/serializers";

import type { CountryConfig } from "../utils/countries";
import type { PartyYearsSums } from "../utils/loader/party-years-sums";
import type { ConstLocale } from "../utils/locales";
import type { Party } from "../utils/types";
import type { PropsWithChildren } from "react";

const Wrapper = ({
  className,
  children,
  country,
  readonly,
  locale,
  years,
}: PropsWithChildren<{
  readonly: boolean;
  locale: ConstLocale;
  years: string[];
  country: CountryConfig;
  className?: string;
}>) => {
  const t = useTranslations();
  const ariaLabel = `${t("years.title")} ${formatYearsRange(years)}`;
  const yearsParam = serializeYears(years);

  return readonly ? (
    <div aria-label={ariaLabel} className={cn(className, "block")}>
      {children}
    </div>
  ) : (
    <Link
      prefetch={false}
      aria-label={ariaLabel}
      href={`/${locale}/${country.id}/${yearsParam}/overview`}
      className={cn(className, "block")}
    >
      {children}
    </Link>
  );
};

const HighscoreHeader = ({
  className,
  years,
  locale,
  parties,
  showTop3,
  idPrefix = "",
  showExtendedMeta = false,
  readonly = true,
  country,
  title,
  partyYearsSums,
  withStackedBar = true,
  titleBeforeYears = false,
}: {
  className?: string;
  country: CountryConfig;
  partyYearsSums: PartyYearsSums;
  idPrefix: string;
  locale: ConstLocale;
  parties: Party[];
  years: string[];
  showTop3: boolean;
  readonly?: boolean;
  showExtendedMeta?: boolean;
  title?: string;
  withStackedBar?: boolean;
  titleBeforeYears?: boolean;
}) => {
  const t = useTranslations();

  const { count, sum, sums, sumNumbers } = getPartiesSum(
    country,
    partyYearsSums,
    parties,
    years,
  );

  return (
    <Wrapper
      className={className}
      years={years}
      readonly={readonly}
      locale={locale}
      country={country}
    >
      {title && !titleBeforeYears ? (
        <h2 className="mb-2" id={`${idPrefix}title`}>
          {title}
        </h2>
      ) : null}
      <h3 className="mb-4 text-3xl sm:text-4xl">
        {titleBeforeYears ? title : null} {formatYearsRange(years)}
      </h3>
      <div className="mb-4">
        <div className="flex-row space-y-2 sm:flex sm:space-y-0 sm:space-x-10">
          <MetaCard
            title={t("donation_count")}
            value={formatNumber(locale, count)}
          />
          <MetaCard
            title={t("sum")}
            value={formatCountryCurrency(locale, sum, country)}
          />
          {showExtendedMeta && count > 1 && (
            <MetaCard
              title={t("average")}
              value={formatCountryCurrency(
                locale,
                numbersAvg(sumNumbers, count),
                country,
              )}
            />
          )}
        </div>
      </div>
      {withStackedBar ? (
        <div className="h-2.5">
          <DynamicStackedPartyDonations
            country={country}
            years={years}
            locale={locale}
            partyYearsSums={partyYearsSums}
          />
        </div>
      ) : null}
      {showTop3 && (
        <div className="@container mt-4 space-y-2">
          {sums.slice(0, 3).map(([party, data], idx) => (
            <ReadonlyTopYearDonationsItem
              rank={idx + 1}
              key={party}
              partyId={party}
              amount={data.sum}
              sum={sum}
              locale={locale}
              country={country}
            />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export const YearsHeader = ({
  locale,
  years,
  idPrefix = "",
  showTop3 = true,
  showExtendedMeta = false,
  readonly = false,
  country,
  title,
  partySums,
  withStackedBar = true,
  className,
  titleBeforeYears = false,
}: {
  idPrefix?: string;
  locale: ConstLocale;
  years: string[];
  showTop3?: boolean;
  showExtendedMeta?: boolean;
  readonly?: boolean;
  country: CountryConfig;
  title?: string;
  partySums: PartyYearsSums;
  withStackedBar?: boolean;
  className?: string;
  titleBeforeYears?: boolean;
}) => {
  const parties = getParties(country, years);

  return (
    <HighscoreHeader
      className={className}
      country={country}
      partyYearsSums={partySums}
      idPrefix={idPrefix}
      locale={locale}
      years={years}
      parties={parties}
      showTop3={showTop3}
      showExtendedMeta={showExtendedMeta}
      readonly={readonly}
      title={title}
      withStackedBar={withStackedBar}
      titleBeforeYears={titleBeforeYears}
    />
  );
};

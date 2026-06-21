import type { PropsWithChildren } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";
import type { ReceiverId } from "@/utils/types";

import {
  FormattedCountryCurrency,
  FormattedNumber,
} from "@/components/browser-based-formatter";
import { ReadonlyTopYearDonationsItem } from "@/components/loading/loading-top-year-donations-item";
import { MetaCard } from "@/components/meta-card";
import { cn } from "@/lib/utils";
import { getParties } from "@/utils/data/get-parties";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import { Features, hasFeature } from "@/utils/features";
import { formatYearsRange } from "@/utils/formatter";
import { numbersAvg } from "@/utils/math";
import { serializeYears } from "@/utils/serializers";

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

export const HighscoreHeader = ({
  className,
  years,
  locale,
  count,
  sum,
  sums,
  avg,
  showTop3,
  idPrefix = "",
  showExtendedMeta = false,
  readonly = true,
  country,
  title,
  children,
  titleBeforeYears = false,
}: PropsWithChildren<{
  className?: string;
  country: CountryConfig;
  count: number;
  sum: number;
  sums: [ReceiverId, { count: number; sum: number }][];
  avg: number;
  idPrefix: string;
  locale: ConstLocale;
  years: string[];
  showTop3: boolean;
  readonly?: boolean;
  showExtendedMeta?: boolean;
  title?: string;
  titleBeforeYears?: boolean;
}>) => {
  const t = useTranslations();

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
          {hasFeature(country, Features.Donors) ? (
            <MetaCard
              title={t("donation_count")}
              value={<FormattedNumber value={count} />}
            />
          ) : null}
          <MetaCard
            title={t("sum")}
            value={<FormattedCountryCurrency value={sum} country={country} />}
          />
          {hasFeature(country, Features.Donors) &&
            showExtendedMeta &&
            count > 1 && (
              <MetaCard
                title={t("average")}
                value={
                  <FormattedCountryCurrency value={avg} country={country} />
                }
              />
            )}
        </div>
      </div>
      {children}
      {showTop3 && (
        <div className="@container mt-4 space-y-2">
          {sums.slice(0, 3).map(([party, data], idx) => (
            <ReadonlyTopYearDonationsItem
              rank={idx + 1}
              key={party}
              partyId={party}
              amount={data.sum}
              sum={sum}
              country={country}
            />
          ))}
        </div>
      )}
    </Wrapper>
  );
};

export const UnfilteredYearsHeader = ({
  locale,
  years,
  idPrefix = "",
  showTop3 = true,
  showExtendedMeta = false,
  readonly = false,
  country,
  title,
  partySums,
  children,
  className,
  titleBeforeYears = false,
}: PropsWithChildren<{
  idPrefix?: string;
  locale: ConstLocale;
  years: string[];
  showTop3?: boolean;
  showExtendedMeta?: boolean;
  readonly?: boolean;
  country: CountryConfig;
  title?: string;
  partySums: PartyYearsSums;
  className?: string;
  titleBeforeYears?: boolean;
}>) => {
  const parties = getParties(country, years);
  const { count, sum, sums, sumNumbers } = getPartiesSum(
    country,
    partySums,
    parties,
    years,
  );

  return (
    <HighscoreHeader
      className={className}
      country={country}
      count={count}
      sum={sum}
      sums={sums}
      avg={numbersAvg(sumNumbers, count)}
      idPrefix={idPrefix}
      locale={locale}
      years={years}
      showTop3={showTop3}
      showExtendedMeta={showExtendedMeta}
      readonly={readonly}
      title={title}
      titleBeforeYears={titleBeforeYears}
    >
      {children}
    </HighscoreHeader>
  );
};

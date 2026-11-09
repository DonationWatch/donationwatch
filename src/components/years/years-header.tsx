import type { PropsWithChildren } from "react";

import { useTranslations } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
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
import { getPartiesByYears } from "@/utils/data/get-parties-by-years";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import { Features, hasFeature } from "@/utils/features";
import { formatYearsRange } from "@/utils/formatter";
import { serializeYears } from "@/utils/serializers";

const HighscoreHeaderFrame = ({
  className,
  children,
}: PropsWithChildren<{
  className?: string;
}>) => {
  return <div className={cn(className, "block")}>{children}</div>;
};

const HighscoreHeaderLinkFrame = ({
  className,
  children,
  country,
  locale,
  years,
}: PropsWithChildren<{
  locale: ConstLocale;
  years: string[];
  country: CountryConfig;
  className?: string;
}>) => {
  const yearsParam = serializeYears(years);

  return (
    <Link
      prefetch={false}
      href={`/${locale}/${country.id}/${yearsParam}/overview`}
      className={cn(className, "block")}
    >
      {children}
    </Link>
  );
};

const HighscoreHeaderTitle = ({
  title,
  idPrefix = "",
  years,
}: {
  title?: string;
  idPrefix?: string;
  years: string[];
}) => {
  return (
    <>
      {title ? (
        <h2 className="mb-2" id={`${idPrefix}title`}>
          {title}
        </h2>
      ) : null}
      <h3 className="mb-4 text-3xl sm:text-4xl"> {formatYearsRange(years)}</h3>
    </>
  );
};

const HighscoreHeaderInlineTitle = ({
  title,
  years,
}: {
  title?: string;
  years: string[];
}) => {
  return (
    <h3 className="mb-4 text-3xl sm:text-4xl">
      {title} {formatYearsRange(years)}
    </h3>
  );
};

const HighscoreHeaderAverageMeta = ({
  country,
  count,
  avg,
}: {
  country: CountryConfig;
  count: number;
  avg: number;
}) => {
  const t = useTranslations();

  if (!hasFeature(country, Features.Donors) || count <= 1) {
    return null;
  }

  return (
    <MetaCard
      title={t("average")}
      value={<FormattedCountryCurrency value={avg} />}
    />
  );
};

const HighscoreHeaderMeta = ({
  country,
  count,
  sum,
  children,
}: PropsWithChildren<{
  country: CountryConfig;
  count: number;
  sum: number;
}>) => {
  const t = useTranslations();

  return (
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
          value={<FormattedCountryCurrency value={sum} />}
        />
        {children}
      </div>
    </div>
  );
};

const HighscoreHeaderTopParties = ({
  sums,
  sum,
}: {
  sums: [ReceiverId, { count: number; sum: number }][];
  sum: number;
}) => {
  return (
    <div className="@container mt-4 space-y-2">
      {sums.slice(0, 3).map(([party, data], idx) => (
        <ReadonlyTopYearDonationsItem
          rank={idx + 1}
          key={party}
          partyId={party}
          amount={data.sum}
          sum={sum}
        />
      ))}
    </div>
  );
};

export const HighscoreHeader = {
  Frame: HighscoreHeaderFrame,
  LinkFrame: HighscoreHeaderLinkFrame,
  Title: HighscoreHeaderTitle,
  InlineTitle: HighscoreHeaderInlineTitle,
  Meta: HighscoreHeaderMeta,
  AverageMeta: HighscoreHeaderAverageMeta,
  TopParties: HighscoreHeaderTopParties,
};

export const UnfilteredYearsHeader = ({
  locale,
  years,
  idPrefix = "",
  country,
  title,
  partySums,
  children,
  className,
  parties,
}: PropsWithChildren<{
  idPrefix?: string;
  locale: ConstLocale;
  years: string[];
  country: CountryConfig;
  title?: string;
  partySums: PartyYearsSums;
  className?: string;
  parties: Party[];
}>) => {
  const yearParties = getPartiesByYears(years, parties);
  const { count, sum, sums } = getPartiesSum(
    country,
    partySums,
    yearParties,
    years,
  );

  return (
    <HighscoreHeader.LinkFrame
      className={className}
      country={country}
      locale={locale}
      years={years}
    >
      <HighscoreHeader.Title idPrefix={idPrefix} title={title} years={years} />
      <HighscoreHeader.Meta country={country} count={count} sum={sum} />
      {children}
      <HighscoreHeader.TopParties sums={sums} sum={sum} />
    </HighscoreHeader.LinkFrame>
  );
};

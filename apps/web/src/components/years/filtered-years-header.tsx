"use client";

import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { ReceiverId } from "@donationwatch/core/utils/types";
import type { PartyYearsSums } from "@donationwatch/data/loader/party-years-sums";
import type { PropsWithChildren } from "react";

import { formatYearsRange } from "@donationwatch/core/utils/formatter";
import { numbersAvg } from "@donationwatch/core/utils/math";
import { getPartiesByYears } from "@donationwatch/data/queries/get-parties-by-years";
import { getPartiesSum } from "@donationwatch/data/queries/get-parties-sum";

import {
  useParties,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { HighscoreHeader } from "@/components/years/years-header";
import { useFilterEngine } from "@/hooks/use-filter-engine";

function useFilteredYearsStats(years: string[], partySums: PartyYearsSums) {
  const country = useRequiredCountryConfig();
  const {
    state: { isFiltered, stats },
  } = useFilterEngine();
  const allParties = useParties();
  const parties = getPartiesByYears(years, allParties);
  const {
    count: staticCount,
    sum: staticSum,
    sums: staticSums,
    sumNumbers,
  } = getPartiesSum(country, partySums, parties, years);

  let count = staticCount;
  let sum = staticSum;
  let sums = staticSums;
  let avg = numbersAvg(sumNumbers, staticCount);

  if (isFiltered) {
    count = stats.donationCount;
    sum = stats.totalAmount;
    sums = Object.entries(stats.amountPerParty)
      .map(
        ([partyId, amount]) =>
          [partyId, { count: 0, sum: amount }] as [
            ReceiverId,
            { count: number; sum: number },
          ],
      )
      .sort((a, b) => b[1].sum - a[1].sum);
    avg = count > 0 ? sum / count : 0;
  }

  return { country, count, sum, sums, avg };
}

export const FilteredYearsCard = ({
  locale,
  years,
  idPrefix = "",
  title,
  partySums,
  children,
  className,
}: PropsWithChildren<{
  idPrefix?: string;
  locale: ConstLocale;
  years: string[];
  title?: string;
  partySums: PartyYearsSums;
  className?: string;
}>) => {
  const { country, count, sum, sums } = useFilteredYearsStats(years, partySums);

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

export const FilteredYearsHeroHeader = ({
  years,
  title,
  partySums,
  children,
  className,
}: PropsWithChildren<{
  years: string[];
  title?: string;
  partySums: PartyYearsSums;
  className?: string;
}>) => {
  const { country, count, sum, avg } = useFilteredYearsStats(years, partySums);

  return (
    <div
      data-toc-header=""
      data-toc-header-label={title}
      data-toc-header-title={formatYearsRange(years)}
    >
      <HighscoreHeader.Frame className={className}>
        <HighscoreHeader.InlineTitle title={title} years={years} />
        <HighscoreHeader.Meta country={country} count={count} sum={sum}>
          <HighscoreHeader.AverageMeta
            country={country}
            count={count}
            avg={avg}
          />
        </HighscoreHeader.Meta>
        {children}
      </HighscoreHeader.Frame>
    </div>
  );
};

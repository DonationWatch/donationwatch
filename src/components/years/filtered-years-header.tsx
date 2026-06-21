"use client";

import type { PropsWithChildren } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";
import type { ReceiverId } from "@/utils/types";

import { HighscoreHeader } from "@/components/years/years-header";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { getParties } from "@/utils/data/get-parties";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import { numbersAvg } from "@/utils/math";

export const FilteredYearsHeader = ({
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
  const filterEngine = useFilterEngine();
  const parties = getParties(country, years);
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

  if (filterEngine.isFiltered) {
    count = filterEngine.stats.donationCount;
    sum = filterEngine.stats.totalAmount;
    sums = Object.entries(filterEngine.stats.amountPerParty)
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

  return (
    <HighscoreHeader
      className={className}
      country={country}
      count={count}
      sum={sum}
      sums={sums}
      avg={avg}
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

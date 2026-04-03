"use client";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { ConstLocale } from "@/utils/locales";
import type { Donation } from "@/utils/types";

import { RankingItem } from "@/components/donations/ranking-item";
import { DonorLink } from "@/components/donors/donor-link";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useBreakpoint } from "@/hooks/use-media-query";
import { useVirtual } from "@/hooks/use-virtual";
import { PartyField } from "@/types/party";
import { isNotNullandNotUndefined } from "@/utils/array";
import { donationYear } from "@/utils/date";
import {
  formatCountryCurrency,
  formatOneFractionNumber,
  formatPercentFormat,
  formatYearsRange,
} from "@/utils/formatter";
import { DonationField } from "@/utils/types";

type DonorHistogram = Record<number, Record<string, number>>;

const HistogramItemDetailLine = ({
  country,
  amount,
  locale,
  donor,
}: {
  locale: ConstLocale;
  country: CountryConfig;
  amount: number;
  donor: string;
}) => {
  const fmtAmount = formatCountryCurrency(locale, amount, country);

  return (
    <div className="mb-2 grow flex-wrap items-center justify-between space-y-2 overflow-hidden border-t border-gray-950/10 px-1 py-1.5 leading-none first:border-t-0 odd:bg-white/5 sm:mb-0 sm:flex sm:flex-nowrap sm:space-y-0 dark:odd:bg-slate-900/5">
      <div className="order-last flex grow basis-full justify-between overflow-hidden font-semibold sm:order-none sm:basis-auto">
        <DonorLink className="truncate" donor={donor} country={country} />
      </div>
      <div className="shrink-0 basis-1/2 pr-2 tabular-nums sm:basis-auto sm:text-right">
        {fmtAmount}
      </div>
    </div>
  );
};

export const HistogramItemDetail = ({
  country,
  sums,
  locale,
}: {
  country: CountryConfig;
  sums: { donor: string; sum: number }[];
  locale: ConstLocale;
}) => {
  const t = useTranslations();
  const parentRef = useRef<HTMLDivElement>(null);
  const isSm = useBreakpoint("sm");

  const rowVirtualizer = useVirtual({
    count: sums.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isSm ? 28 : 81) + 1,
    overscan: 5,
  });

  // re-trigger measure if mobile changes
  useEffect(() => {
    rowVirtualizer?.measure?.();
    // We can't have rowVirtualizer in the list of dependency due to its always being recreated and in turn causing the effect to fire
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [isSm]);

  return (
    <div
      className="@container max-h-[500px] overflow-x-hidden overflow-y-auto"
      ref={parentRef}
    >
      <ul
        className="relative w-full"
        aria-label={t("party_donations")}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const { donor, sum } = sums[virtualItem.index];

          return (
            <li
              key={virtualItem.key}
              className="absolute top-0 right-0 left-0 flex w-full items-center justify-between space-x-2 border-t border-gray-950/10 first:border-t-0"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <HistogramItemDetailLine
                locale={locale}
                country={country}
                donor={donor}
                amount={sum}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const DonorHistogramTextText = ({
  histogram,
  donorReceivers,
  years,
}: {
  donorReceivers: Record<string, Set<string>>;
  histogram: DonorHistogram;
  years: string[];
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const sortedBuckets = Object.entries(histogram)
    .map(([receiversCount, donors]) => ({
      receiversCount: Number(receiversCount),
      donorCount: Object.keys(donors).length,
    }))
    .toSorted((a, b) => a.receiversCount - b.receiversCount);

  const donorsCount = Object.keys(donorReceivers).length;
  const maxBucket = sortedBuckets.at(-1);
  const justOne = sortedBuckets.find((b) => b.receiversCount === 1);

  // compute per-donor counts array, mean and median
  const counts: number[] = Object.values(donorReceivers)
    .map((s) => s.size)
    .toSorted((a, b) => a - b);

  const mean =
    counts.length > 0
      ? counts.reduce((acc, v) => acc + v, 0) / counts.length
      : 0;

  let median = 0;
  if (counts.length > 0) {
    const mid = Math.floor(counts.length / 2);
    if (counts.length % 2 === 1) {
      median = counts[mid];
    } else {
      median = (counts[mid - 1] + counts[mid]) / 2;
    }
  }

  return (
    <>
      <p className="mb-6">
        {t("donors.histogram.p1", {
          years: formatYearsRange(years),
          max: maxBucket?.receiversCount ?? 0,
          donors: maxBucket?.donorCount ?? 0,
          median: formatOneFractionNumber(locale, median),
          mean: formatOneFractionNumber(locale, mean),
        })}
      </p>
      <p className="mb-6"></p>
      {justOne ? (
        <p className="mb-6">
          {t("donors.histogram.p2", {
            percentage: formatPercentFormat(
              locale,
              justOne.donorCount / donorsCount,
            ),
            singlePartyDonors: justOne.donorCount,
            totalDonors: donorsCount,
          })}
        </p>
      ) : null}
    </>
  );
};

const DonorHistogramTextList = ({
  countDonorSums,
  country,
  locale,
}: {
  country: CountryConfig;
  locale: ConstLocale;
  countDonorSums: {
    receiversCount: string;
    donorSums: {
      donor: string;
      sum: number;
    }[];
  }[];
}) => {
  const t = useTranslations();
  const [expandedBuckets, setExpandedBuckets] = useState<string[]>([]);
  const onToggleExpanded = (state: string) => {
    setExpandedBuckets((prev) =>
      prev.includes(state)
        ? prev.filter((id) => id !== state)
        : [...prev, state],
    );
  };

  return (
    <ul className="mb-6 space-y-1">
      {countDonorSums.map(({ receiversCount, donorSums }, idx) => {
        return (
          <li key={receiversCount}>
            <RankingItem
              showRank={false}
              id={receiversCount}
              rank={idx + 1}
              country={country}
              expanded={expandedBuckets.includes(receiversCount)}
              onToggleExpanded={() => onToggleExpanded(receiversCount)}
              detail={
                <HistogramItemDetail
                  locale={locale}
                  country={country}
                  sums={donorSums}
                />
              }
            >
              {t("donors.histogram.item", {
                donors: donorSums.length,
                parties: receiversCount,
              })}
            </RankingItem>
          </li>
        );
      })}
    </ul>
  );
};

const LoadedYearsDonorHistogramText = ({
  years,
  country,
  parties,
  donations,
  locale,
}: {
  years: string[];
  country: CountryConfig;
  parties: Party[];
  donations: Donation[];
  locale: ConstLocale;
}) => {
  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<Party>(parties);

  const donorReceivers: Record<string, Set<string>> = {};

  donations.forEach((donation) => {
    if (!years.length) {
      yearsSet.add(donationYear(donation));
    }
    if (!parties.length) {
      partiesSet.add(
        country.parties.find(
          (p) => p[PartyField.Id] === donation[DonationField.Receiver],
        )!,
      );
    }
  });

  years = years.length ? years : Array.from(yearsSet);
  parties = parties.length ? parties : Array.from(partiesSet);

  if (!donations.length) return null;

  const partyIdsSet = new Set<string>(parties.map((p) => p[PartyField.Id]));

  const donorSums: Record<string, number> = {};

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partyIdsSet.has(donation[DonationField.Receiver])) return;

    donorSums[donation[DonationField.DonorName]] ??= 0;
    donorSums[donation[DonationField.DonorName]] +=
      donation[DonationField.Amount];

    donorReceivers[donation[DonationField.DonorName]] ??= new Set();
    donorReceivers[donation[DonationField.DonorName]].add(
      donation[DonationField.Receiver],
    );
  });

  // count each bucket
  const buckets: DonorHistogram = {};
  Object.entries(donorReceivers).forEach(([donor, receiversSet]) => {
    const receiversCount = receiversSet.size;
    buckets[receiversCount] ??= {};
    buckets[receiversCount][donor] ??= donorSums[donor] ?? 0;
  });

  const countDonorSums = Object.entries(buckets).map(
    ([receiversCount, donors]) => {
      return {
        receiversCount,
        donorSums: Object.entries(donors)
          .map(([donor, sum]) => ({ donor, sum }))
          .toSorted((a, b) => b.sum - a.sum),
      };
    },
  );

  return (
    <>
      <DonorHistogramTextText
        donorReceivers={donorReceivers}
        histogram={buckets}
        years={years}
      />
      <DonorHistogramTextList
        country={country}
        locale={locale}
        countDonorSums={countDonorSums}
      />
    </>
  );
};

export const LoadingYearsDonorHistogramText = ({
  years,
  country,
  parties,
}: {
  years: string[];
  country: CountryConfig;
  parties: Party[];
}) => {
  const t = useTranslations("data");
  const locale = useLocale();
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{t("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <LoadedYearsDonorHistogramText
      locale={locale}
      donations={donations}
      country={country}
      parties={parties}
      years={years}
    />
  );
};

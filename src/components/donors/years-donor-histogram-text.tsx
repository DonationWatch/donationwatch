"use client";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { RankingItem } from "@/components/donations/ranking-item";
import { DonorLink } from "@/components/donors/donor-link";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useBreakpoint } from "@/hooks/use-media-query";
import { PartyField } from "@/types/party";
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
  amount,
  donor,
}: {
  amount: number;
  donor: string;
}) => {
  const country = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();
  const fmtAmount = formatCountryCurrency(browserBasedLocale, amount, country);

  return (
    <div className="border-border mb-2 grow flex-wrap items-center justify-between space-y-2 overflow-hidden border-t px-1 py-1.5 leading-none first:border-t-0 odd:bg-white/5 sm:mb-0 sm:flex sm:flex-nowrap sm:space-y-0 dark:odd:bg-slate-900/5">
      <div className="order-last flex grow basis-full justify-between overflow-hidden font-semibold sm:order-none sm:basis-auto">
        <DonorLink className="truncate" donor={donor} />
      </div>
      <div className="shrink-0 basis-1/2 pr-2 tabular-nums sm:basis-auto sm:text-right">
        {fmtAmount}
      </div>
    </div>
  );
};

export const HistogramItemDetail = ({
  sums,
}: {
  sums: { donor: string; sum: number }[];
}) => {
  const t = useTranslations();
  const parentRef = useRef<HTMLDivElement>(null);
  const isSm = useBreakpoint("sm");

  const rowVirtualizer = useVirtualizer({
    count: sums.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isSm ? 28 : 81) + 1,
    overscan: 5,
    directDomUpdates: true,
    directDomUpdatesMode: "transform",
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
        ref={rowVirtualizer.containerRef}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const { donor, sum } = sums[virtualItem.index];

          return (
            <li
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="border-border absolute top-0 right-0 left-0 flex w-full items-center justify-between space-x-2 border-t first:border-t-0"
            >
              <HistogramItemDetailLine donor={donor} amount={sum} />
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
  const browserBasedLocale = useBrowserBasedLocale();

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
          median: formatOneFractionNumber(browserBasedLocale, median),
          mean: formatOneFractionNumber(browserBasedLocale, mean),
        })}
      </p>
      <p className="mb-6"></p>
      {justOne ? (
        <p className="mb-6">
          {t("donors.histogram.p2", {
            percentage: formatPercentFormat(
              browserBasedLocale,
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
}: {
  countDonorSums: {
    receiversCount: string;
    donorSums: {
      donor: string;
      sum: number;
    }[];
  }[];
}) => {
  const country = useRequiredCountryConfig();
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
              detail={<HistogramItemDetail sums={donorSums} />}
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
  parties,
  donations,
}: {
  years: string[];
  parties: Party[];
  donations: Donation[];
}) => {
  const partiesMap = usePartiesMap();
  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<Party>(parties);

  const donorReceivers: Record<string, Set<string>> = {};

  donations.forEach((donation) => {
    if (!years.length) {
      yearsSet.add(donationYear(donation));
    }
    if (!parties.length) {
      partiesSet.add(partiesMap[donation[DonationField.Receiver]]);
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
      <DonorHistogramTextList countDonorSums={countDonorSums} />
    </>
  );
};

export const YearsDonorHistogramText = ({
  years,
  parties,
  donations,
}: {
  years: string[];
  parties: Party[];
  donations: Donation[];
}) => {
  return (
    <LoadedYearsDonorHistogramText
      donations={donations}
      parties={parties}
      years={years}
    />
  );
};

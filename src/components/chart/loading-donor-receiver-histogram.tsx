"use client";
import { useLocale } from "next-intl";

import { ExpandableReactEchart } from "./expandable-react-echart";
import { useDonationsByYears } from "../../hooks/use-api";
import { useChart } from "../../hooks/use-chart";
import { isNotNullandNotUndefined } from "../../utils/array";
import { donationYear } from "../../utils/date";
import { formatNumber } from "../../utils/formatter";
import { DonationField } from "../../utils/types";
import Loading from "../loading";

import type { CountryConfig } from "../../utils/countries";
import type { Donation, Party } from "../../utils/types";
import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

// Bar chart that represents a histogram of x axis being the amount of distinct receivers per donor
export const LoadedDonorReceiverHistogram = ({
  country,
  title,
  subtitle,
  donations,
  parties = [],
  years = [],
}: {
  country: CountryConfig;
  title: string;
  subtitle: string;
  donations: Donation[];
  parties?: Party[];
  years?: string[];
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<Party>(parties);

  const donorReceivers: Record<string, Set<string>> = {};

  donations.forEach((donation) => {
    if (!years.length) {
      yearsSet.add(donationYear(donation));
    }
    if (!parties.length) {
      partiesSet.add(
        country.parties.find((p) => p.id === donation[DonationField.Receiver])!,
      );
    }
  });

  years = years.length ? years : Array.from(yearsSet);
  parties = parties.length ? parties : Array.from(partiesSet);

  const { backgroundColor, isDark } = useChart();

  if (!donations.length) return null;

  const partyIdsSet = new Set<string>(parties.map((p) => p.id));

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partyIdsSet.has(donation[DonationField.Receiver])) return;

    donorReceivers[donation[DonationField.DonorName]] ??= new Set();
    donorReceivers[donation[DonationField.DonorName]].add(
      donation[DonationField.Receiver],
    );
  });

  // count each bucket
  const bucketCounts: Record<number, number> = {};
  Object.values(donorReceivers).forEach((receiversSet) => {
    const receiversCount = receiversSet.size;
    bucketCounts[receiversCount] ??= 0;
    bucketCounts[receiversCount] += 1;
  });

  // Fill holes in the receiver counts so we have contiguous buckets
  const bucketKeys = Object.keys(bucketCounts).map(Number);
  if (bucketKeys.length) {
    const minCount = Math.min(...bucketKeys);
    const maxCount = Math.max(...bucketKeys);
    for (let i = minCount; i <= maxCount; i++) {
      bucketCounts[i] ??= 0;
    }
  }

  // prepare data for echart
  const sortedBuckets = Object.entries(bucketCounts)
    .map(([receiversCount, donorCount]) => ({
      receiversCount: Number(receiversCount),
      donorCount,
    }))
    .toSorted((a, b) => a.receiversCount - b.receiversCount);

  const option: EChartsOption = {
    backgroundColor,
    grid: {
      left: 20,
      right: 40,
      top: 20,
      bottom: 20,
      containLabel: true,
    },
    tooltip: {
      confine: true,
      show: true,
      trigger: "axis",
      formatter: (param) => {
        if (Array.isArray(param) && param[0]) param = param[0];
        if (!param) return "";

        const formatterParam = param as CallbackDataParams;

        const data = (formatterParam.data ?? formatterParam.value) as [
          number,
          number,
        ];

        const receiversCount = data[0] || 0;
        const donorCount = data[1] || 0;

        return t("donors.histogram.tooltip", {
          donors: formatNumber(locale, donorCount),
          parties: formatNumber(locale, receiversCount),
        });
      },
    },
    xAxis: {
      position: "left",
      type: "category",
    },
    yAxis: [
      {
        position: "left",
        // type: "log",
        // logBase: 4,
        axisLabel: {
          formatter: (value: number) => formatNumber(locale, value),
        },
        minorSplitLine: {
          show: true,
          lineStyle: {
            color: isDark ? "#94a3b8" : "#1e293b",
            width: 0.5,
            type: "dotted",
          },
        },
        // Manually add minor grid lines by specifying split lines at desired positions
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark ? "#64748b" : "#94a3b8",
            width: 1,
          },
          interval: function (value) {
            // Show split line for every log interval (e.g., 1, 2, 3, ..., 10, 20, ..., 100, etc.)
            return Math.log10(value) % 1 !== 0; // This is a simplified example
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        data: sortedBuckets.map(({ receiversCount, donorCount }) => [
          receiversCount,
          donorCount,
        ]),
        name: t("years.title"),
      },
    ],
  };
  return (
    <ExpandableReactEchart
      height={400}
      maxHeightScreen={true}
      title={title}
      subtitle={subtitle}
      years={years}
      allowExpand={true}
      country={country}
      feature="bar"
      option={option}
    />
  );
};

export const LoadingDonorReceiverHistogram = ({
  country,
  years,
  parties,
  title,
  subtitle,
}: {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  tooSmallAreaColor?: string;
  title: string;
  subtitle: string;
}) => {
  const t = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{t("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <LoadedDonorReceiverHistogram
      country={country}
      title={title}
      subtitle={subtitle}
      donations={donations}
      parties={parties}
      years={years}
    />
  );
};

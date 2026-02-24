"use client";
import { useLocale } from "next-intl";


import { ExpandableReactEchart } from "./expandable-react-echart";
import { useDonationsByYears } from "../../hooks/use-api";
import { useChart } from "../../hooks/use-chart";
import { isNotNullandNotUndefined } from "../../utils/array";
import { partyColor } from "../../utils/color";
import { type CountryConfig, getParty } from "../../utils/countries";
import { donationYear } from "../../utils/date";
import { buildElectionTimelineMarkArea } from "../../utils/election-marker";
import {
  formatCountryCurrency,
  formatPartyShortName,
  formatCompactCountryCurrency,
  formatMonthYear,
  formatTwoDigitDate,
  formatYear,
} from "../../utils/formatter";
import { DonationField } from "../../utils/types";
import Loading from "../loading";

import type { Donation, Party, ReceiverId } from "../../utils/types";
import type { BarSeriesOption, EChartsOption } from "echarts";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export type DonationPerMonthResolution = "month" | "year";

export const DonationPerMonthChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
  limitToFirstDateYear,
  resolution,
}: {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
  resolution?: DonationPerMonthResolution;
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
    <DonationBarChart
      donations={donations}
      country={country}
      years={years}
      parties={parties}
      title={chartTitle}
      subtitle={subtitle}
      limitToFirstDateYear={limitToFirstDateYear}
      resolution={resolution}
    />
  );
};

const DonationBarChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
  limitToFirstDateYear,
  donations,
  resolution = "month",
}: {
  donations: Donation[];
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
  resolution?: DonationPerMonthResolution;
}) => {
  const locale = useLocale();
  const { backgroundColor, isMobile, isDark } = useChart();

  const leftmostYear = limitToFirstDateYear
    ? donations[0][DonationField.Date].substring(0, 4)
    : years.at(0)!;
  const rightmostYear = years.at(-1)!;
  const yearsCount = years.length;

  const monthYearData: Record<string, Record<string, number>> = {};
  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p.id));
  const foundParties = new Set<string>([]);
  const partySums: Record<string, number> = {};
  let hasYearOnlyDonations = false;

  donations.forEach((donation: Donation & { [DonationField.Date]: string }) => {
    if (donation[DonationField.Date] === donationYear(donation)) {
      hasYearOnlyDonations = true;
      if (resolution === "month") return;
    }
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    foundParties.add(donation[DonationField.Receiver]);

    const timeKey =
      resolution === "year"
        ? donationYear(donation)
        : donation[DonationField.Date].substring(0, 7);

    monthYearData[timeKey] ??= {};
    monthYearData[timeKey][donation[DonationField.Receiver]] ??= 0;
    monthYearData[timeKey][donation[DonationField.Receiver]] +=
      donation[DonationField.Amount];

    partySums[donation[DonationField.Receiver]] ??= 0;
    partySums[donation[DonationField.Receiver]] +=
      donation[DonationField.Amount];
  });

  const sortedParties = parties.toSorted(
    (a, b) => partySums[b.id] - partySums[a.id],
  );

  const partyLines: BarSeriesOption[] = sortedParties.map((party) => {
    // iterate through the amount of years and fill the array with data from monthYearData if it exists
    for (let i = 0; i < yearsCount; i++) {
      const year = years.at(i)!;

      if (resolution === "year") {
        monthYearData[year] ??= {};
        monthYearData[year][party.id] ??= 0;
      } else {
        for (let month = 1; month <= 12; month++) {
          const monthYear = `${year}-${month.toString().padStart(2, "0")}`;
          monthYearData[monthYear] ??= {};
          monthYearData[monthYear][party.id] ??= 0;
        }
      }
    }

    return {
      name: party.id,
      type: "bar",
      stack: "total",
      color: partyColor(party.id, country) ?? undefined,
      data: Object.entries(monthYearData).map(([timeKey, partyData]) => {
        const date =
          resolution === "year"
            ? new Date(`${timeKey}-01-01`)
            : new Date(`${timeKey}-01`);
        return [date, partyData[party.id] ?? 0];
      }),
    };
  });

  // there's an issue in echarts where without the empty next month it'll render the bar really wide
  // only needed for month resolution
  if (resolution === "month") {
    partyLines.forEach((line) => {
      if (line.data?.length === 1) {
        const datum = line.data!.at(0);

        if (!datum) return;

        // add 1 month to the date
        const nextMonth = new Date((datum as [Date])[0].getTime());
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        line.data.push([nextMonth, 0]);
      }
    });
  }

  const option: EChartsOption = {
    grid: {
      left: 20,
      right: 20,
      top: 80,
      bottom: 60,
      containLabel: true,
    },
    backgroundColor,
    legend: {
      show: true,
      type: "scroll",
      data: sortedParties.map((p) => p.id),
      top: 20,
      left: "center",
      icon: "rect",
      itemWidth: 14,
      itemHeight: 14,
      align: "left",
      orient: "horizontal",
      padding: [0, 20],
      textStyle: {
        width: 100,
        overflow: "truncate",
      },
      formatter: (partyId) =>
        formatPartyShortName(country, partyId as ReceiverId),
    },
    dataZoom: [
      {
        type: "inside",
        filterMode: "none",
        // zoom to min 5 months or 3 years
        minValueSpan:
          resolution === "year"
            ? 1000 * 60 * 60 * 24 * 365 * 3
            : 1000 * 60 * 60 * 24 * 30 * 5,
      },
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "none",
        labelFormatter: (value) =>
          resolution === "year"
            ? formatYear(locale, value)
            : formatTwoDigitDate(locale, value),
        bottom: 20,
        // zoom to min 5 months or 3 years
        minValueSpan:
          resolution === "year"
            ? 1000 * 60 * 60 * 24 * 365 * 3
            : 1000 * 60 * 60 * 24 * 30 * 5,
      },
    ],
    tooltip: {
      confine: true,
      trigger: "axis",
      axisPointer: {
        type: "cross", // set axis pointer to 'cross' to show vertical and horizontal lines
        label: {
          backgroundColor: "#6a7985", // set background color of axis pointer label
          formatter(params) {
            if (params.axisDimension === "y") {
              return formatCompactCountryCurrency(
                locale,
                params.value as number,
                country,
              );
            } else if (params.axisDimension === "x") {
              const date = new Date(params.value);
              return resolution === "year"
                ? formatYear(locale, date)
                : formatMonthYear(locale, date);
            }

            return "";
          },
        },
      },
      formatter(params) {
        if (!Array.isArray(params)) return "";

        const lines: string[] = [];
        let allSum = 0;

        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          const [, sum] = param.value as [Date, number];

          if (sum === 0) continue;

          allSum += sum;

          const party = getParty(country, param.seriesName as ReceiverId);

          lines.push(
            `${param.marker} ${party.short}: ${formatCountryCurrency(locale, sum, country)}`,
          );
        }

        if (!lines.length) return "";

        const date = (params[0].data as [Date])[0] as Date;
        const dateLabel =
          resolution === "year"
            ? formatYear(locale, date)
            : formatMonthYear(locale, date);

        return `<div class="mb-1 text-sm leading-none text-grey-500">${dateLabel}</div><div class="font-semibold text-lg">${formatCountryCurrency(locale, allSum, country)}</div>${lines.join("<br/>")}`;
      },
    },
    xAxis: {
      type: "time",
      min: new Date(`${parseInt(leftmostYear, 10) - 1}-12-31`),
      max: new Date(`${parseInt(rightmostYear, 10) + 1}-01-01`),
      // min interval is one month or one year
      minInterval:
        resolution === "year" ? 3600 * 1000 * 24 * 365 : 3600 * 1000 * 24 * 30,
    },
    yAxis: [
      {
        position: "left",
        type: "value",
        axisLabel: {
          formatter: (value) =>
            formatCompactCountryCurrency(locale, value, country),
        },
      },
    ],
    series: [
      ...partyLines,
      {
        yAxisIndex: 0,
        type: "line",
        data: [],
        markLine: buildElectionTimelineMarkArea(
          country,
          years,
          isMobile,
          isDark,
        ),
      },
    ],
  };

  return (
    <ExpandableReactEchart
      height={350}
      maxHeightScreen={true}
      allowExpand={true}
      feature="bar"
      option={option}
      title={chartTitle}
      subtitle={subtitle}
      country={country}
      years={years}
      noteYearOnlyDonations={hasYearOnlyDonations}
    />
  );
};

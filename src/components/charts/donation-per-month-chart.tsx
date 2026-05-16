"use client";
import type { BarSeriesOption, EChartsOption } from "echarts";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation, ReceiverId } from "@/utils/types";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { PartyField } from "@/types/party";
import { partyColor } from "@/utils/color";
import { getParty } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { buildElectionTimelineMarkArea } from "@/utils/election-marker";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatMonthYear,
  formatPartyShortName,
  formatTwoDigitDate,
  formatYear,
} from "@/utils/formatter";
import { DonationField } from "@/utils/types";

import { ExpandableReactEchart } from "./expandable-react-echart";

export type DonationPerMonthResolution = "month" | "year";

export const DonationPerMonthChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
  limitToFirstDateYear,
  resolution,
  donations,
}: {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
  resolution?: DonationPerMonthResolution;
  donations: Donation[];
}) => {
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
  const browserBasedLocale = useBrowserBasedLocale();
  const { backgroundColor, isMobile, isDark } = useChart();

  const leftmostYear = limitToFirstDateYear
    ? donations[0][DonationField.Date].substring(0, 4)
    : years.at(0)!;
  const rightmostYear = years.at(-1)!;
  const yearsCount = years.length;

  const monthYearData: Record<string, Record<string, number>> = {};
  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p[PartyField.Id]));
  const foundParties = new Set<string>([]);
  const partySums: Record<string, number> = {};

  donations.forEach((donation: Donation & { [DonationField.Date]: string }) => {
    if (donation[DonationField.Date] === donationYear(donation)) {
      if (resolution === "month") {
        throw new Error("Donation date is only year but resolution is month");
        return;
      }
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
    (a, b) => partySums[b[PartyField.Id]] - partySums[a[PartyField.Id]],
  );

  const partyLines: BarSeriesOption[] = sortedParties.map((party) => {
    // iterate through the amount of years and fill the array with data from monthYearData if it exists
    for (let i = 0; i < yearsCount; i++) {
      const year = years.at(i)!;

      if (resolution === "year") {
        monthYearData[year] ??= {};
        monthYearData[year][party[PartyField.Id]] ??= 0;
      } else {
        for (let month = 1; month <= 12; month++) {
          const monthYear = `${year}-${month.toString().padStart(2, "0")}`;
          monthYearData[monthYear] ??= {};
          monthYearData[monthYear][party[PartyField.Id]] ??= 0;
        }
      }
    }

    return {
      name: party[PartyField.Id],
      type: "bar",
      stack: "total",
      color: partyColor(party[PartyField.Id], country) ?? undefined,
      data: Object.entries(monthYearData).map(([timeKey, partyData]) => {
        const date =
          resolution === "year"
            ? new Date(`${timeKey}-01-01`)
            : new Date(`${timeKey}-01`);
        return [date, partyData[party[PartyField.Id]] ?? 0];
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
      data: sortedParties.map((p) => p[PartyField.Id]),
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
            ? formatYear(browserBasedLocale, value)
            : formatTwoDigitDate(browserBasedLocale, value),
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
                browserBasedLocale,
                params.value as number,
                country,
              );
            } else if (params.axisDimension === "x") {
              const date = new Date(params.value);
              return resolution === "year"
                ? formatYear(browserBasedLocale, date)
                : formatMonthYear(browserBasedLocale, date);
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
            `${param.marker} ${party[PartyField.Short]}: ${formatCountryCurrency(browserBasedLocale, sum, country)}`,
          );
        }

        if (!lines.length) return "";

        const date = (params[0].data as [Date])[0] as Date;
        const dateLabel =
          resolution === "year"
            ? formatYear(browserBasedLocale, date)
            : formatMonthYear(browserBasedLocale, date);

        return `<div class="mb-1 text-sm leading-none text-grey-500">${dateLabel}</div><div class="font-semibold text-lg">${formatCountryCurrency(browserBasedLocale, allSum, country)}</div>${lines.join("<br/>")}`;
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
            formatCompactCountryCurrency(browserBasedLocale, value, country),
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
    />
  );
};

"use client";
import { useLocale } from "next-intl";

import { ExpandableReactEchart } from "./expandable-react-echart";
import { useDonationsByParty, useDonationsByYears } from "../../hooks/use-api";
import { useChart } from "../../hooks/use-chart";
import { isNotNullandNotUndefined } from "../../utils/array";
import { partyColor } from "../../utils/color";
import { type CountryConfig, getParty } from "../../utils/countries";
import { donationYear } from "../../utils/date";
import { buildElectionTimelineMarkArea } from "../../utils/election-marker";
import {
  formatDate,
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
import type { EChartsOption, LineSeriesOption } from "echarts";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

const symbolConfiguration = (idx: number) => {
  const symbols = ["circle", "rect", "triangle", "diamond", "pin", "arrow"];

  return {
    symbol: symbols[idx % symbols.length],
    symbolRotate: 0,
  };
};

type LineDatum = [number, number];

export const DonationSumChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
  limitToFirstDateYear,
}: {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
}) => {
  const t = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return t("error");

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <DonationTimeseriesChart
      donations={donations}
      country={country}
      years={years}
      parties={parties}
      title={chartTitle}
      subtitle={subtitle}
      limitToFirstDateYear={limitToFirstDateYear}
    />
  );
};

export const DonationPartyChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  party,
  limitToFirstDateYear,
}: {
  country: CountryConfig;
  years: string[];
  party: Party;
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
}) => {
  const t = useTranslations("data");
  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !data) return t("error");

  return (
    <DonationTimeseriesChart
      donations={data.flat()}
      country={country}
      years={years}
      parties={[party]}
      title={chartTitle}
      subtitle={subtitle}
      limitToFirstDateYear={limitToFirstDateYear}
    />
  );
};

const DonationTimeseriesChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
  limitToFirstDateYear,
  donations,
}: {
  donations: Donation[];
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
}) => {
  const locale = useLocale();
  const { backgroundColor, isMobile, isDark } = useChart();

  const leftmostYear = limitToFirstDateYear
    ? donations[0][DonationField.Date].substring(0, 4)
    : years.at(0)!;
  const rightmostYear = years.at(-1)!;

  const now = Date.now();
  const isOngoing = parseInt(rightmostYear, 10) >= new Date(now).getFullYear();

  const partyLines: LineSeriesOption[] = parties.map((party, idx) => ({
    ...symbolConfiguration(idx),
    yAxisIndex: 0,
    name: party.id,
    type: "line",
    step: "end",
    symbolSize: ([timestamp, value]) => {
      if (value === 0) return 0;

      if (
        // padded data point needs no symbol
        (isOngoing && timestamp === now) ||
        // end of year data point needs no symbol
        maxX === timestamp
      ) {
        return 0;
      }

      return 10;
    },
    color: partyColor(party.id, country) ?? undefined,
    data: [],
  }));

  const minX = new Date(leftmostYear).getTime();
  const maxX = new Date(`${parseInt(rightmostYear, 10) + 1}`).getTime();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p.id));
  const foundParties = new Set<string>([]);
  const partySums: Record<string, number> = {};

  donations.forEach((donation: Donation & { [DonationField.Date]: string }) => {
    if (donation[DonationField.Date] === donationYear(donation)) {
      throw new Error("Donation date is only year but expected full date");
      return;
    }
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    foundParties.add(donation[DonationField.Receiver]);

    const idx = parties.findIndex(
      (p) => p.id === donation[DonationField.Receiver],
    );
    const previousValue = partyLines[idx].data!.at(-1) as
      | [Date, number, string]
      | undefined;
    const previousAmount = previousValue?.[1] ?? 0;
    const previousDate = previousValue?.[2] ?? undefined;

    if (previousDate === donation[DonationField.Date]) {
      // update existing entry to avoid additional points
      previousValue![1] += donation[DonationField.Amount];
    } else {
      partyLines[idx].data!.push([
        new Date(donation[DonationField.Date]),
        previousAmount + donation[DonationField.Amount],
        donation[DonationField.Date],
      ]);
    }

    partySums[donation[DonationField.Receiver]] ??= 0;
    partySums[donation[DonationField.Receiver]] +=
      donation[DonationField.Amount];
  });

  partyLines.forEach((_, idx) => {
    partyLines[idx].data!.unshift([minX, 0]);

    // pad ongoing data to today
    if (isOngoing) {
      const previousValue =
        (partyLines[idx].data!.at(-1) as LineDatum | undefined)?.[1] ?? 0;
      partyLines[idx].data!.push([now, previousValue]);
      return;
    }

    // add entry for end of year
    const previousValue =
      (partyLines[idx].data!.at(-1) as LineDatum | undefined)?.[1] ?? 0;
    partyLines[idx].data!.push([maxX, previousValue]);
  });

  const option: EChartsOption = {
    grid: {
      right: 20,
      left: 20,
      top: 80,
      bottom: 60,
      containLabel: true,
    },
    backgroundColor,
    legend: {
      show: true,
      type: "scroll",
      data: parties
        .map((party) => party.id)
        .toSorted((a, b) => partySums[b] - partySums[a]),
      top: 20,
      padding: [0, 20],
      // left: "right",
      // align: "left",
      orient: "horizontal",
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
        // zoom to min 5 days
        minValueSpan: 1000 * 60 * 60 * 24 * 5,
      },
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "none",
        labelFormatter: (value) => formatTwoDigitDate(locale, value),
        bottom: 20,
        // zoom to min 5 days
        minValueSpan: 1000 * 60 * 60 * 24 * 5,
      },
    ],
    tooltip: {
      confine: true,
      trigger: "axis",
      axisPointer: {
        type: "cross", // set axis pointer to 'cross' to show vertical and horizontal lines
        label: {
          backgroundColor: "#6a7985", // set background color of axis pointer label
          formatter: (params) => {
            if (params.axisDimension === "y") {
              return formatCompactCountryCurrency(
                locale,
                params.value as number,
                country,
              );
            } else if (params.axisDimension === "x") {
              return formatMonthYear(locale, new Date(params.value));
            }

            return "";
          },
        },
      },
      formatter: (params) => {
        if (!Array.isArray(params)) return "";

        const lines: string[] = [];

        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          const [timestamp, sum] = param.value as [number, number];

          // no tooltip for ongoing data
          if (timestamp === now) continue;
          // no tooltip for end of year data
          if (timestamp === maxX) continue;

          let line = "";
          const partyLine = partyLines[param.seriesIndex as number];
          const previousPartyValue =
            (partyLine.data![param.dataIndex - 1] as LineDatum)?.[1] ?? 0;
          const delta = sum - previousPartyValue;

          const party = getParty(country, param.seriesName as ReceiverId);
          line += `${param.marker} ${party.short}: ${formatCountryCurrency(locale, sum, country)}`;

          // only add delta if there is a change
          if (delta > 0) {
            line += ` (+${formatCountryCurrency(locale, delta, country)})`;
          }

          lines.push(line);
        }

        if (!lines.length) return "";

        return `<div style="font-size:14px;color:#666;font-weight:600;line-height:1;margin-bottom:5px">${formatDate(
          locale,
          (params[0].data as LineDatum)[0],
        )}</div>${lines.join("<br/>")}`;
      },
    },
    xAxis: {
      type: "time",
      min: new Date(`${parseInt(leftmostYear, 10) - 1}-12-31`),
      max: new Date(`${parseInt(rightmostYear, 10) + 1}-01-01`),
      // min interval is one month
      minInterval: 1000 * 60 * 60 * 24,
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
      height={550}
      maxHeightScreen={true}
      allowExpand={true}
      feature="line"
      option={option}
      title={chartTitle}
      subtitle={subtitle}
      country={country}
      years={years}
    />
  );
};

export const DonationStackedTimeseriesChart = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
  limitToFirstDateYear,
  donations,
  donationsHaveYearsOnly = false,
}: {
  donations: Donation[];
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  limitToFirstDateYear?: boolean;
  donationsHaveYearsOnly?: boolean;
}) => {
  const locale = useLocale();
  const { backgroundColor, isMobile, isDark } = useChart();

  const leftmostYear = limitToFirstDateYear
    ? donations[0][DonationField.Date].substring(0, 4)
    : years.at(0)!;
  const rightmostYear = years.at(-1)!;

  const now = Date.now();
  const isOngoing = parseInt(rightmostYear, 10) >= new Date(now).getFullYear();
  // [date, Record<ReceiverId, number>]
  const partySumsPerDate: Record<string, Record<string, number>> = {};

  const partyLines: LineSeriesOption[] = parties.map((party, idx) => ({
    ...symbolConfiguration(idx),
    yAxisIndex: 0,
    name: party.id,
    type: "line",
    step: "end",
    stack: "total",
    areaStyle: {},
    emphasis: {
      focus: "series",
    },
    symbolSize: ([timestamp, value, date], params) => {
      if (value === 0) return 0;

      const previousValue =
        (partySumsPerDate[date]?.[party.id] ?? params.dataIndex === 0)
          ? 0
          : value;

      if (value === previousValue) return 0;

      if (
        // padded data point needs no symbol
        (isOngoing && timestamp === now) ||
        // end of year data point needs no symbol
        maxX === timestamp
      ) {
        return 0;
      }

      return 10;
    },
    color: partyColor(party.id, country) ?? undefined,
    data: [],
  }));

  const minX = new Date(leftmostYear).getTime();
  const maxX = new Date(`${parseInt(rightmostYear, 10) + 1}`).getTime();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p.id));
  const foundParties = new Set<string>([]);
  const partySums: Record<string, number> = {};

  donations.forEach((donation: Donation & { [DonationField.Date]: string }) => {
    if (
      donation[DonationField.Date] === donationYear(donation) &&
      !donationsHaveYearsOnly
    ) {
      return;
    }
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    foundParties.add(donation[DonationField.Receiver]);

    partySumsPerDate[donation[DonationField.Date]] ??= {};
    partySumsPerDate[donation[DonationField.Date]][
      donation[DonationField.Receiver]
    ] ??= 0;
    partySumsPerDate[donation[DonationField.Date]][
      donation[DonationField.Receiver]
    ] += donation[DonationField.Amount];
    //
    const idx = parties.findIndex(
      (p) => p.id === donation[DonationField.Receiver],
    );
    const previousValue = partyLines[idx].data!.at(-1) as
      | [Date, number, string]
      | undefined;
    const previousAmount = previousValue?.[1] ?? 0;
    const previousDate = previousValue?.[2] ?? undefined;

    if (previousDate === donation[DonationField.Date]) {
      // update existing entry to avoid additional points
      previousValue![1] += donation[DonationField.Amount];
    } else {
      partyLines[idx].data!.push([
        new Date(donation[DonationField.Date]),
        previousAmount + donation[DonationField.Amount],
        donation[DonationField.Date],
      ]);

      // update all other party lines with null y value to get stacking to work
      partyLines.forEach((line, lineIdx) => {
        if (lineIdx !== idx) {
          line.data!.push([
            new Date(donation[DonationField.Date]),
            (line.data!.at(-1) as LineDatum | undefined)?.[1] ?? 0,
            donation[DonationField.Date],
          ]);
        }
      });
    }

    partySums[donation[DonationField.Receiver]] ??= 0;
    partySums[donation[DonationField.Receiver]] +=
      donation[DonationField.Amount];
  });

  partyLines.forEach((_, idx) => {
    partyLines[idx].data!.unshift([minX, 0]);

    // pad ongoing data to today
    if (isOngoing) {
      const previousValue =
        (partyLines[idx].data!.at(-1) as LineDatum | undefined)?.[1] ?? 0;
      partyLines[idx].data!.push([now, previousValue]);
      return;
    }

    // add entry for end of year
    const previousValue =
      (partyLines[idx].data!.at(-1) as LineDatum | undefined)?.[1] ?? 0;
    partyLines[idx].data!.push([maxX, previousValue]);
  });

  const minValueSpan = donationsHaveYearsOnly
    ? // zoom to min 1 year
      1000 * 60 * 60 * 24 * 365
    : // zoom to min 5 days
      1000 * 60 * 60 * 24 * 5;

  const option: EChartsOption = {
    grid: {
      right: 20,
      left: 20,
      top: 80,
      bottom: 60,
      containLabel: true,
    },
    backgroundColor,
    legend: {
      show: true,
      type: "scroll",
      data: parties
        .map((party) => party.id)
        .toSorted((a, b) => partySums[b] - partySums[a]),
      top: 20,
      padding: [0, 20],
      // left: "right",
      // align: "left",
      orient: "horizontal",
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
        minValueSpan,
      },
      {
        id: "dataZoomX",
        type: "slider",
        xAxisIndex: [0],
        filterMode: "none",
        labelFormatter: (value) => formatTwoDigitDate(locale, value),
        bottom: 20,
        minValueSpan,
      },
    ],
    tooltip: {
      confine: true,
      trigger: "axis",
      axisPointer: {
        type: "cross", // set axis pointer to 'cross' to show vertical and horizontal lines
        label: {
          backgroundColor: "#6a7985", // set background color of axis pointer label
          formatter: (params) => {
            if (params.axisDimension === "y") {
              return formatCompactCountryCurrency(
                locale,
                params.value as number,
                country,
              );
            } else if (params.axisDimension === "x") {
              return formatMonthYear(locale, new Date(params.value));
            }

            return "";
          },
        },
      },
      formatter: (params) => {
        if (!Array.isArray(params)) return "";

        const lines: string[] = [];

        for (let i = 0; i < params.length; i++) {
          const param = params[i];
          const [timestamp, sum] = param.value as [number, number];

          // no tooltip for ongoing data
          if (timestamp === now) continue;
          // no tooltip for end of year data
          if (timestamp === maxX) continue;

          let line = "";
          const partyLine = partyLines[param.seriesIndex as number];
          const previousPartyValue =
            (partyLine.data![param.dataIndex - 1] as LineDatum)?.[1] ?? 0;
          const delta = sum - previousPartyValue;

          const party = getParty(country, param.seriesName as ReceiverId);
          line += `${param.marker} <span class="font-medium">${party.short}</span>: ${formatCountryCurrency(locale, sum, country)}`;

          // only add delta if there is a change
          if (delta > 0) {
            line += ` (+${formatCountryCurrency(locale, delta, country)})`;
          }

          lines.push(line);
        }

        if (!lines.length) return "";

        const date = (params[0].data as LineDatum)[0];
        const formattedDate = donationsHaveYearsOnly
          ? formatYear(locale, date)
          : formatDate(locale, date);

        return `<div class="text-sm font-semibold mb-2">${formattedDate}</div>${lines.join("<br/>")}`;
      },
    },
    xAxis: {
      type: "time",
      min: new Date(`${parseInt(leftmostYear, 10) - 1}-12-31`),
      max: new Date(`${parseInt(rightmostYear, 10) + 1}-01-01`),
      minInterval: donationsHaveYearsOnly
        ? // min interval is one year
          1000 * 60 * 60 * 24 * 365
        : // min interval is one month
          1000 * 60 * 60 * 24,
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
      height={550}
      maxHeightScreen={true}
      allowExpand={true}
      feature="line"
      option={option}
      title={chartTitle}
      subtitle={subtitle}
      country={country}
      years={years}
    />
  );
};

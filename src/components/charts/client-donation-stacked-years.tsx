"use client";
import type {
  BarSeriesOption,
  EChartsOption,
  MarkAreaComponentOption,
} from "echarts";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import type { CountryConfig } from "@/types/country-config";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getCountryName } from "@/utils/countries";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatYearsRange,
} from "@/utils/formatter";

import type { DonationStackedYearsData } from "./donation-stacked-years-data";

import { ExpandableReactEchart } from "./expandable-react-echart";

const PER_YEAR_HEIGHT = 20;

export const ClientDonationStackedYears = ({
  country,
  data,
}: {
  country: CountryConfig;
  data: DonationStackedYearsData;
}) => {
  const tStackedYears = useTranslations("stacked_years");
  const tCountries = useTranslations("countries");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const router = useRouter();
  const { backgroundColor, isMobile, isDark } = useChart();

  const series: BarSeriesOption[] = [];
  const { years, yearSums } = data;

  const preliminarySince = country.preliminaryDataSince;
  const electionMarkAreas: MarkAreaComponentOption["data"] = [];

  const markerYears = new Set<string>(
    country.markers.dates.map((date) => date.substring(0, 4)),
  );

  years.forEach((year) => {
    if (!markerYears.has(year)) return;

    electionMarkAreas.push([{ yAxis: year }, { yAxis: year }]);
  });

  series.push(
    {
      type: "bar",
      color: isDark ? "#818cf8" : "#4338ca",
      barWidth: "45%",
      data: yearSums.map(({ year, sum }) => ({
        itemStyle: {
          borderRadius: [0, 1, 1, 0],
          decal: preliminarySince
            ? preliminarySince <= year
              ? {
                  color: isDark ? "#4338ca" : "#a5b4fc",
                  symbol: "rect",
                  dashArrayX: [1, 0], // continuous line
                  dashArrayY: [4, 6],
                  rotation: Math.PI / 4,
                }
              : undefined
            : undefined,
        },
        value: sum,
      })),
    },
    // Add a markArea for the voting years to have a legend entry
    {
      name: `${country.markers.label}`,
      type: "bar",
      itemStyle: {
        color: isDark ? "#3730a380" : "#a5b4fc80",
      },
      markArea: {
        silent: true,
        itemStyle: {
          color: isDark ? "#3730a380" : "#a5b4fc80",
        },
        data: electionMarkAreas,
      },
    },
  );

  const grid = { top: 20, left: 65, bottom: 60 };

  const option: EChartsOption = {
    darkMode: isDark,
    grid,
    backgroundColor,
    legend: {
      bottom: "5px",
      selectedMode: false,
      show: true,
      data: [
        `${country.markers.label}`, // Add markArea labels to the legend
      ],
    },
    tooltip: {
      confine: true,
      show: !isMobile,
      axisPointer: {
        type: "shadow",
      },
      trigger: "axis",
      valueFormatter: (value) =>
        formatCountryCurrency(browserBasedLocale, value as number, country),
    },
    xAxis: [
      {
        type: "value",
        triggerEvent: true,
        axisLabel: {
          formatter: (value) =>
            formatCompactCountryCurrency(browserBasedLocale, value, country),
        },
      },
    ],
    yAxis: {
      type: "category",
      data: years,
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
    },
    series,
  };

  const chartHeight = grid.top + grid.bottom + PER_YEAR_HEIGHT * years.length;

  let subtitle = tStackedYears("subtitle", {
    country: getCountryName(country, tCountries),
    years: formatYearsRange(country.years),
  });

  if (preliminarySince) {
    subtitle += ` ${tStackedYears("preliminary")}`;
  }

  return (
    <div className="flex items-center justify-center">
      <ExpandableReactEchart
        height={chartHeight}
        title={tStackedYears("title")}
        subtitle={subtitle}
        country={country}
        years={years}
        feature="bar"
        option={option}
        allowExpand={true}
        onZrClick={(params, chart) => {
          if (!chart) return;

          const x = params.event.zrX;
          const y = params.event.zrY;
          const pointInGrid = chart.convertFromPixel("grid", [x, y]);
          const year = years[pointInGrid[1]];

          if (!year) return;

          // @ts-expect-error - getModel is typed as private but we need it to get the grid component and check if the click was inside the grid.
          const grid = chart.getModel().getComponent("grid");

          if (!grid.coordinateSystem.containPoint([x, y])) return;

          router.push(`/${locale}/${country.id}/${year}/overview`);
        }}
      />
    </div>
  );
};

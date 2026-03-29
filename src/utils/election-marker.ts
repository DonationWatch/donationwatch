import type { MarkLineComponentOption } from "echarts";

import type { CountryConfig } from "@/types/country-config";

import type { IsoDate } from "./types";

const electionIcon = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/><path d="M22 19H2"/></svg>`;

const LIGHT_ELECTION_MARKER =
  "data:image/svg+xml;base64," + btoa(electionIcon("#4338ca"));
const DARK_ELECTION_MARKER =
  "data:image/svg+xml;base64," + btoa(electionIcon("#818cf8"));

const buildElectionMarkAreas = (years: string[], country: CountryConfig) => {
  const markLines: MarkLineComponentOption["data"] = [];

  const markerYears = country.markers.dates.reduce<Record<string, IsoDate>>(
    (all, date) => ({
      ...all,
      [date.substring(0, 4)]: date,
    }),
    {},
  );

  years.forEach((year) => {
    const markerDate = markerYears[year];

    if (!markerDate) return;

    markLines.push({
      name: `${country.markers.label}\n${year}`,
      xAxis: new Date(markerDate).getTime(),
    });
  });

  return markLines;
};

export const buildElectionTimelineMarkArea = (
  country: CountryConfig,
  years: string[],
  isMobile: boolean,
  isDark: boolean,
): MarkLineComponentOption => {
  return {
    silent: true,
    itemStyle: {
      color: isDark ? "#818cf8" : "#4338ca",
    },
    symbol: "none",
    lineStyle: {
      type: [6, 0, 0],
      color: isDark ? "#a6a09b" : "#79716b",
    },
    label: {
      show: true,
      align: "center",
      formatter: (params) => {
        return isMobile ? "{icon|}" : params.name;
      },
      rich: {
        icon: {
          width: 24,
          height: 24,
          color: "red",
          backgroundColor: {
            image: isDark ? DARK_ELECTION_MARKER : LIGHT_ELECTION_MARKER,
          },
        },
      },
    },
    data: buildElectionMarkAreas(years, country),
  };
};

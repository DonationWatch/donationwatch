"use client";

import type { EChartsOption } from "echarts";

import { useMemo } from "react";

import type { Party } from "@/types/party";

import { ExpandableReactEchart } from "@/components/charts/expandable-react-echart";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { PartyField } from "@/types/party";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";

import type { PartyViaItem } from "./types";

interface PartyViaTreemapProps {
  party: Party;
  items: PartyViaItem[];
  title?: string;
  subtitle?: string;
  height?: number;
}

export const PartyViaTreemap = ({
  party,
  items,
  title = "Contributing Committees",
  subtitle = "Breakdown of contributions by recipient committee",
  height = 600,
}: PartyViaTreemapProps) => {
  const country = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();
  const { isDark, isMobile, backgroundColor } = useChart();

  const option = useMemo((): EChartsOption => {
    const partyColor = party[PartyField.Color] || "#3b82f6";

    const children = items.map((item) => {
      return {
        name: item.name,
        value: item.sum,
        count: item.count,
        pct: item.pctOfParty,
        itemStyle: {
          color: partyColor,
          borderColor: isDark ? "#111827" : "#f3f4f6",
          borderWidth: 2,
          gapWidth: 2,
        },
      };
    });

    return {
      backgroundColor,
      tooltip: {
        confine: true,
        show: true,
        formatter: (params) => {
          if (Array.isArray(params)) return "";
          const name = params.name;
          const value = formatCountryCurrency(
            browserBasedLocale,
            params.value as number,
            country,
          );
          // @ts-expect-error custom pct
          const pct = params.data?.pct;
          const pctStr =
            pct !== undefined
              ? formatPercentFormat(browserBasedLocale, pct)
              : "";

          return `<div class="max-w-60 text-wrap"><div class="font-semibold">${name}</div><div>${value}${pctStr ? ` (${pctStr})` : ""}</div></div>`;
        },
      },
      series: [
        {
          type: "treemap",
          name: title,
          roam: !isMobile,
          nodeClick: false,
          visibleMin: 300,
          breadcrumb: {
            show: false,
          },
          label: {
            position: "insideTopLeft",
            formatter(params) {
              return `{name|${params.name}}\n{value|${formatCountryCurrency(browserBasedLocale, params.value as number, country)}}`;
            },
            rich: {
              name: {
                fontWeight: "bold",
                padding: [0, 0, 4, 0],
                textBorderColor: "rgba(0,0,0,.5)",
                textBorderWidth: 3,
              },
              value: {
                fontWeight: "bold",
                textBorderColor: "rgba(0,0,0,.5)",
                textBorderWidth: 3,
              },
            },
          },
          upperLabel: {
            show: false,
          },
          itemStyle: {
            borderColor: isDark ? "#111827" : "#f3f4f6",
            borderWidth: 2,
            gapWidth: 2,
          },
          data: children,
        },
      ],
    };
  }, [
    backgroundColor,
    browserBasedLocale,
    country,
    isDark,
    isMobile,
    items,
    party,
    title,
  ]);

  return (
    <ExpandableReactEchart
      option={option}
      title={title}
      subtitle={subtitle}
      height={height}
      maxHeightScreen={true}
      years={country.years}
      allowExpand={true}
      feature="treemap"
    />
  );
};

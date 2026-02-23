"use client";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

import { ExpandableReactEchart } from "./expandable-react-echart";
import { useChart } from "../../hooks/use-chart";
import { partyColor } from "../../utils/color";
import {
  type CountryConfig,
  getCountryName,
  getParty,
} from "../../utils/countries";
import { formatCountryCurrency, formatYearsRange } from "../../utils/formatter";

import type { PartyYearsSums } from "../../utils/loader/party-years-sums";
import type { ReceiverId } from "../../utils/types";
import type { EChartsOption, TreemapSeriesOption } from "echarts";
import type { TreemapSeriesNodeItemOption } from "echarts/types/src/chart/treemap/TreemapSeries.js";

export const DonationsPieChart = ({
  country,
  partyYearsSums,
  years,
}: {
  country: CountryConfig;
  partyYearsSums: PartyYearsSums;
  years: string[];
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { backgroundColor, isMobile } = useChart();
  const partySums: Record<string, number> = {};

  Object.entries(partyYearsSums).forEach(([year, yearSums]) => {
    if (!years.includes(year)) return;

    Object.entries(yearSums).forEach(([party, partySum]) => {
      partySums[party] ??= 0;
      partySums[party] += partySum.sum;
    });
  });

  const treemapData: TreemapSeriesNodeItemOption[] = Object.entries(
    partySums,
  ).map(([partyId, sum]) => {
    const party = getParty(country, partyId as ReceiverId);
    return {
      id: party.id,
      name: party.short,
      value: sum,
      colorSaturation: [0.35, 0.5],
      itemStyle: {
        color: partyColor(party.id, country),
        borderRadius: 4,
      },
      label: {
        position: "insideTopLeft",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter(params: any) {
          if (params.treeAncestors.length === 1) return "aaa";

          if (params.treeAncestors.length === 2) {
            // is "root" level
            return `{name|${params.name}}\n{value|${formatCountryCurrency(locale, params.value as number, country)}}`;
          }

          return ``;
        },
        rich: {
          name: {
            fontWeight: "bold",
            padding: [0, 0, 4, 0],
            textBorderColor: `color-mix(in srgb, ${party.color} 40%, black)`,
            textBorderWidth: 3,
            textShadowBlur: 0,
          },
          value: {
            fontWeight: "bold",
            textBorderColor: `color-mix(in srgb, ${party.color} 40%, black)`,
            textBorderWidth: 3,
            textShadowBlur: 0,
          },
        },
      },
    };
  });

  const option: EChartsOption = {
    grid: {
      top: "20px",
      bottom: "60px",
    },
    backgroundColor,
    tooltip: {
      confine: true,
      trigger: "item",
      valueFormatter: (value) =>
        formatCountryCurrency(locale, value as number, country),
    },
    series: [
      {
        type: "treemap",
        roam: !isMobile,
        nodeClick: false,
        visibleMin: 300,
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        upperLabel: {
          show: false,
        },
        label: {
          position: "insideTopLeft",
          formatter: (params) => {
            return `{amount|${formatCountryCurrency(locale, params.value as number, country)}}`;
          },
          rich: {
            amount: {
              fontWeight: "bold",
              textBorderColor: "rgba(0,0,0,.5)",
              textBorderWidth: 3,
            },
          },
        },
        breadcrumb: {
          show: false,
        },
        itemStyle: {
          gapWidth: 5,
          borderColor: "transparent",
        },
        data: treemapData,
      } satisfies TreemapSeriesOption,
    ],
  };

  return (
    <ExpandableReactEchart
      height={650}
      maxHeightScreen={true}
      allowExpand={true}
      title={t("overview.pie.title")}
      subtitle={t("overview.pie.subtitle", {
        country: getCountryName(country, t),
        years: formatYearsRange(years),
      })}
      country={country}
      years={years}
      feature="treemap"
      option={option}
      onClick={(params) => {
        if (params.componentType !== "series") return;
        if (params.componentSubType !== "treemap") return;

        const party = (params.data as TreemapSeriesNodeItemOption)?.["id"];
        if (!party) return;

        router.push(`/${locale}/${country.id}/party/${party}`);
      }}
    />
  );
};

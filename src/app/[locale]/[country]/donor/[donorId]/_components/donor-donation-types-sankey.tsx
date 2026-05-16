"use client";

import type { EChartsOption } from "echarts";
import type { SankeyNodeItemOption } from "echarts/types/src/chart/sankey/SankeySeries.js";

import type { CountryConfig } from "@/types/country-config";
import type { Donation, ReceiverId } from "@/utils/types";

import { ExpandableReactEchart } from "@/components/charts/expandable-react-echart";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { chartColorFor, partyColor } from "@/utils/color";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "@/utils/formatter";
import { capitalize, truncate } from "@/utils/string";
import { DonationField, DonationType } from "@/utils/types";

// Node ID prefixes to prevent ECharts duplicate-id collisions
const donorNodeId = (name: string) => `d:${name}`;
const partyNodeId = (id: string) => `p:${id}`;
const partyTypeNodeId = (partyId: string, type: DonationType) =>
  `pt:${partyId}:${type}`;

export const DonorDonationTypesSankey = ({
  countryConfig,
  donations,
  donorName,
}: {
  countryConfig: CountryConfig;
  donations: Donation[];
  donorName: string;
}) => {
  const browserBasedLocale = useBrowserBasedLocale();
  const { backgroundColor, isDark } = useChart();
  const tDonationType = useTranslations("donation_type");
  const tDonor = useTranslations("donor");
  const tCommon = useTranslations("common");

  // --- Build aggregations ---
  // partySum: party → total
  // partyTypeSum: party → type → amount
  const partySum: Record<string, number> = {};
  const partyTypeSum: Record<
    string,
    Partial<Record<DonationType, number>>
  > = {};

  for (const donation of donations) {
    const receiver = donation[DonationField.Receiver];
    const type = donation[DonationField.DonationType] ?? DonationType.Money;
    const amount = donation[DonationField.Amount];

    partySum[receiver] ??= 0;
    partySum[receiver] += amount;

    partyTypeSum[receiver] ??= {};
    partyTypeSum[receiver][type] ??= 0;
    partyTypeSum[receiver][type]! += amount;
  }

  const totalSum = Object.values(partySum).reduce((s, v) => s + v, 0);
  if (totalSum === 0) return null;

  const receiverIds = Object.keys(partySum) as ReceiverId[];

  // Count total party-type combinations for chart height
  let totalPartyTypes = 0;
  for (const types of Object.values(partyTypeSum)) {
    totalPartyTypes += Object.keys(types!).length;
  }

  // --- Nodes ---
  const nodes: SankeyNodeItemOption[] = [
    // Left: single donor node
    {
      id: donorNodeId(donorName),
      name: donorName,
      itemStyle: {
        color: "#4338ca",
      },
      label: {
        formatter: `${truncate(donorName, 22)}\n${formatCompactCountryCurrency(browserBasedLocale, totalSum, countryConfig)}`,
      },
    },
  ];

  // Middle & Right: group party and its unique type nodes together
  // so that with nodeSort: false, they remain vertically clustered.
  for (const receiver of receiverIds) {
    const partyShortName =
      countryConfig.parties.find((p) => p[PartyField.Id] === receiver)?.[
        PartyField.Short
      ] ?? receiver;

    nodes.push({
      id: partyNodeId(receiver),
      name: partyShortName,
      itemStyle: { color: partyColor(receiver, countryConfig) },
      label: {
        formatter: `${truncate(partyShortName, 22)}\n${formatCompactCountryCurrency(browserBasedLocale, partySum[receiver]!, countryConfig)}`,
      },
    });

    if (!partyTypeSum[receiver]) continue;

    // Sort types by amount descending so the biggest streams are on top
    const typesForParty = Object.entries(partyTypeSum[receiver]!).toSorted(
      ([, a], [, b]) => (b ?? 0) - (a ?? 0),
    );

    for (const [typeStr, amount] of typesForParty) {
      const type = Number(typeStr) as DonationType;
      const capitalizedType = capitalize(tDonationType(`${type}`));
      nodes.push({
        id: partyTypeNodeId(receiver, type),
        name: `${capitalizedType} (${partyShortName})`,
        itemStyle: { color: chartColorFor(type) },
        label: {
          formatter: `${truncate(capitalizedType, 22)}\n${formatCompactCountryCurrency(browserBasedLocale, amount!, countryConfig)}`,
        },
      });
    }
  }

  // --- Links ---
  const links: { source: string; target: string; value: number }[] = [];

  // Donor → Party
  for (const [receiver, sum] of Object.entries(partySum)) {
    links.push({
      source: donorNodeId(donorName),
      target: partyNodeId(receiver),
      value: sum,
    });
  }

  // Party → PartyType
  for (const [receiver, types] of Object.entries(partyTypeSum)) {
    for (const [typeStr, amount] of Object.entries(types!)) {
      if (!amount) continue;
      links.push({
        source: partyNodeId(receiver),
        target: partyTypeNodeId(receiver, Number(typeStr) as DonationType),
        value: amount,
      });
    }
  }

  const option: EChartsOption = {
    backgroundColor,
    tooltip: {
      confine: true,
      show: true,
      formatter: (params) => {
        if (Array.isArray(params)) return "";
        const value = formatCountryCurrency(
          browserBasedLocale,
          params.value as number,
          countryConfig,
        );
        if (params.dataType === "edge") {
          return `<div><div class="font-semibold">${value}</div></div>`;
        }
        return `<div><div>${params.name}</div><div class="font-semibold">${value}</div></div>`;
      },
    },
    graphic: {
      elements: [
        {
          silent: true,
          type: "text",
          left: "28px",
          top: "10px",
          style: {
            text: tCommon("donor"),
            font: "normal 14px sans-serif",
            fill: isDark ? "#9ca3af" : "#6b7280",
          },
        },
        {
          silent: true,
          type: "text",
          left: "center",
          top: "10px",
          style: {
            text: tCommon("party"),
            align: "center",
            font: "normal 14px sans-serif",
            fill: isDark ? "#9ca3af" : "#6b7280",
          },
        },
        {
          silent: true,
          type: "text",
          right: "28px",
          top: "10px",
          style: {
            text: tCommon("donation_type"),
            align: "right",
            font: "normal 14px sans-serif",
            fill: isDark ? "#9ca3af" : "#6b7280",
          },
        },
      ],
    },
    series: {
      type: "sankey",
      top: 30,
      draggable: false,
      orient: "horizontal",
      nodeAlign: "left",
      nodeGap: 24,
      layoutIterations: 0,
      emphasis: { focus: "adjacency" },
      lineStyle: { color: "gradient", curveness: 0.5 },
      label: {
        rich: {},
      },
      links,
      data: nodes,
    },
  };

  return (
    <ExpandableReactEchart
      height={Math.max(500, receiverIds.length * 60 + totalPartyTypes * 40)}
      feature="sankey"
      option={option}
      title={tDonor("donation_type.title")}
      subtitle={tDonor("donation_type.graph.subtitle", { donor: donorName })}
      country={countryConfig}
      years={[]}
      allowExpand={true}
    />
  );
};

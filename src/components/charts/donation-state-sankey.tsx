"use client";
import type { EChartsOption } from "echarts";
import type { SankeyNodeItemOption } from "echarts/types/src/chart/sankey/SankeySeries.js";

import type { Party } from "@/types/party";
import type { Donation, ReceiverId } from "@/utils/types";

import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { Country } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency } from "@/utils/formatter";
import { sourceId, targetId } from "@/utils/graph";
import { AddressField, DonationField } from "@/utils/types";

import { ExpandableReactEchart } from "./expandable-react-echart";

interface Edge {
  source: string;
  target: string;
  value: number;
}

export const DonationStateSankey = ({
  donations,
  title: chartTitle,
  subtitle,
  parties,
  years,
}: {
  parties: Party[];
  years: string[];
  title: string;
  subtitle: string;
  donations: Donation[];
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const browserBasedLocale = useBrowserBasedLocale();
  const { backgroundColor } = useChart();
  const partiesMap = usePartiesMap();

  const isEu = country.id === Country.europeanunion;
  const yearsSet = new Set(years);
  const partiesSet = new Set(parties.map((p) => p[PartyField.Id]));
  const foundParties = new Set<ReceiverId>();
  const foundState = new Set<string>();

  // map of source -> target with summed values
  const linksByState: Record<string, { [key: string]: number }> = {};

  donations.forEach((donation) => {
    if (
      !isEu &&
      donation[DonationField.Address][AddressField.Country] !== country.code
    )
      return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;
    if (!yearsSet.has(donationYear(donation))) return;

    const state = isEu
      ? // @ts-expect-error - The translation key is dynamic, but we ensure that it exists by checking the presence of the state and country fields.
        t(`countries.${donation[DonationField.Address][AddressField.State]!}`)
      : t(
          // @ts-expect-error - The translation key is dynamic, but we ensure that it exists by checking the presence of the state and country fields.
          `state.${country.id}.${donation[DonationField.Address][AddressField.State]!}`,
        );

    foundParties.add(donation[DonationField.Receiver]);
    foundState.add(state);

    const source = sourceId(state);
    const target = targetId(donation[DonationField.Receiver]);
    linksByState[source] ??= {};
    linksByState[source][target] ??= 0;
    linksByState[source][target] += donation[DonationField.Amount];
  });

  const links: { source: string; target: string; value: number }[] = [];
  Object.entries(linksByState).forEach(([source, targets]) => {
    Object.entries(targets).forEach(([target, value]) => {
      links.push({ source, target, value });
    });
  });

  const option: EChartsOption = {
    grid: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    backgroundColor,
    tooltip: {
      confine: true,
      show: true,
      valueFormatter: (value) =>
        formatCountryCurrency(browserBasedLocale, value as number, country),
      formatter: (params) => {
        if (Array.isArray(params)) return "";

        const formattedCurrency = formatCountryCurrency(
          browserBasedLocale,
          params.value as number,
          country,
        );

        if (params.dataType === "edge") {
          const from = (params.data as Edge).source.substring(1);
          const party = (params.data as Edge).target.substring(1) as ReceiverId;
          const partyPart = `<div class="flex items-center font-semibold"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-zinc-600" style="background-color: ${partiesMap[party][PartyField.Color]}"></div>
        <div>${partiesMap[party][PartyField.Short]}</div>
      </div></div>`;

          return `<div><div>${from}</div>${partyPart}<div class="font-semibold">${formattedCurrency}</div></div>`;
        } else if (params.dataType === "node") {
          return `<div><div>${params.name}</div><div class="font-semibold">${formattedCurrency}</div></div>`;
        }

        return `${params.value}`;
      },
    },
    series: {
      type: "sankey",
      draggable: false,
      emphasis: {
        focus: "adjacency",
      },
      label: {
        // @ts-expect-error - incorrectly typed upstream
        normal: {
          formatter: "{b}",
        },
      },
      lineStyle: {
        color: "target",
        curveness: 0.5,
      },
      links,
      data: [
        ...Array.from(foundState).map((state) => ({
          id: sourceId(state),
          name: state,
        })),
        ...Array.from(foundParties).map((party) => ({
          id: targetId(party),
          name: partiesMap[party][PartyField.Short],
          itemStyle: {
            color: partiesMap[party][PartyField.Color],
          },
        })),
      ] as SankeyNodeItemOption[],
    },
  };

  return (
    <ExpandableReactEchart
      height={650}
      maxHeightScreen={true}
      feature="sankey"
      option={option}
      title={chartTitle}
      subtitle={subtitle}
      years={years}
    />
  );
};

"use client";

import { ExpandableReactEchart } from "./expandable-react-echart";
import { useChart } from "../../hooks/use-chart";
import { useTranslations } from "../../hooks/use-translations";
import { partyColor } from "../../utils/color";
import { Country, type CountryConfig } from "../../utils/countries";
import { donationYear } from "../../utils/date";
import {
  formatCountryCurrency,
  formatPartyShortName,
} from "../../utils/formatter";
import { sourceId, targetId } from "../../utils/graph";
import { AddressField, DonationField } from "../../utils/types";

import type { Donation, Party, ReceiverId } from "../../utils/types";
import type { EChartsOption } from "echarts";
import type { SankeyNodeItemOption } from "echarts/types/src/chart/sankey/SankeySeries.js";
import type { FC } from "react";

interface Edge {
  source: string;
  target: string;
  value: number;
}

export const DonationStateSankey: FC<{
  country: CountryConfig;
  parties: Party[];
  years: string[];
  title: string;
  subtitle: string;
  donations: Donation[];
}> = ({ country, donations, title: chartTitle, subtitle, parties, years }) => {
  const { translations, locale } = useTranslations();
  const { backgroundColor } = useChart();

  const isEu = country.id === Country.europeanunion;
  const yearsSet = new Set(years);
  const partiesSet = new Set(parties.map((p) => p.id));
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
      ? (translations.countries as Record<string, string>)[
          donation[DonationField.Address][AddressField.State]!
        ]
      : (translations.state as Record<string, Record<string, string>>)[
          country.id
        ][donation[DonationField.Address][AddressField.State]!];

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
        formatCountryCurrency(locale, value as number, country),
      formatter: (params) => {
        if (Array.isArray(params)) return "";

        const formattedCurrency = formatCountryCurrency(
          locale,
          params.value as number,
          country,
        );

        if (params.dataType === "edge") {
          const from = (params.data as Edge).source.substring(1);
          const party = (params.data as Edge).target.substring(1) as ReceiverId;
          const partyPart = `<div class="flex items-center font-semibold"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600" style="background-color: ${partyColor(
            party,
            country,
          )}"></div>
        <div>${formatPartyShortName(country, party)}</div>
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
          name: formatPartyShortName(country, party),
          itemStyle: {
            color: partyColor(party, country),
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
      country={country}
      years={years}
    />
  );
};

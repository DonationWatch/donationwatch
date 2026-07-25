"use client";
import type {
  EChartsOption,
  ScatterSeriesOption,
  SingleAxisComponentOption,
  TitleComponentOption,
} from "echarts";

import { useLocale } from "next-intl";

import type { Party } from "@/types/party";
import type { Donation, ReceiverId } from "@/utils/types";

import { TextPartyLink } from "@/components/parties/text-party-link";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

import { Translation } from "../translation";
import { ExpandableReactEchart } from "./expandable-react-echart";

export const DonationYearScatterPlot = ({
  title: chartTitle,
  subtitle,
  years,
  parties,
  donations,
}: {
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
  donations: Donation[];
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const { backgroundColor } = useChart();
  const partiesMap = usePartiesMap();

  const partyIds = new Set(parties.map((p) => p[PartyField.Id]));

  const titles: TitleComponentOption[] = [];
  const singleAxis: SingleAxisComponentOption[] = [];
  const series: ScatterSeriesOption[] = [];

  const partyDonations: Record<
    string,
    { sum: number; donations: Donation[]; slots: Record<number, number> }
  > = {};
  let largestAmount = 0;
  let smallestAmount = Number.POSITIVE_INFINITY;
  const numbers = new Set<number>();

  const spans: Record<ReceiverId, { min: number; max: number }> = {};

  donations.forEach((donation) => {
    if (!partyIds.has(donation[DonationField.Receiver])) return;
    if (!years.includes(donationYear(donation))) return;

    largestAmount = Math.max(largestAmount, donation[DonationField.Amount]);
    smallestAmount = Math.min(smallestAmount, donation[DonationField.Amount]);

    partyDonations[donation[DonationField.Receiver]] ??= {
      sum: 0,
      donations: [],
      slots: {},
    };
    partyDonations[donation[DonationField.Receiver]].sum +=
      donation[DonationField.Amount];
    partyDonations[donation[DonationField.Receiver]].donations.push(donation);
    partyDonations[donation[DonationField.Receiver]].slots[
      donation[DonationField.Amount]
    ] ??= 0;
    partyDonations[donation[DonationField.Receiver]].slots[
      donation[DonationField.Amount]
    ]++;

    spans[donation[DonationField.Receiver]] ??= {
      min: donation[DonationField.Amount],
      max: donation[DonationField.Amount],
    };
    spans[donation[DonationField.Receiver]].min = Math.min(
      spans[donation[DonationField.Receiver]].min,
      donation[DonationField.Amount],
    );
    spans[donation[DonationField.Receiver]].max = Math.max(
      spans[donation[DonationField.Receiver]].max,
      donation[DonationField.Amount],
    );

    numbers.add(donation[DonationField.Amount]);
  });

  // caluclate which party has the biggest span
  let biggestSpan = 0;
  let biggestSpanParty: ReceiverId | undefined;
  (
    Object.entries(spans) as [ReceiverId, { min: number; max: number }][]
  ).forEach(([partyId, { min, max }]) => {
    const span = max - min;
    if (span > biggestSpan) {
      biggestSpan = span;
      biggestSpanParty = partyId;
    }
  });

  const heightPerRow = 86;
  const axisTitleOffset = 26;
  const partiesCount = Object.keys(partyDonations).length;
  const grid = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  Object.entries(partyDonations)
    .filter(([, { donations }]) => donations.length > 0)
    .toSorted(([, a], [, b]) => b.sum - a.sum)
    .forEach(([partyId, { donations, slots }], idx) => {
      const party = partiesMap[partyId as ReceiverId];
      titles.push({
        top: `${idx * heightPerRow + grid.top + 4}`,
        left: 10,
        right: 10,
        text: party[PartyField.Short],
        textStyle: {
          fontSize: 14,
        },
      });
      singleAxis.push({
        type: "log",
        logBase: 5,
        top: `${idx * heightPerRow + grid.top + axisTitleOffset}`,
        height: 30,
        left: 45,
        right: 45,
        max: largestAmount,
        min: smallestAmount,
        axisLabel: {
          formatter: (data) =>
            formatCountryCurrency(browserBasedLocale, data, country),
        },
      });
      series.push({
        singleAxisIndex: idx,
        coordinateSystem: "singleAxis",
        type: "scatter",
        data: donations.map((d) => [
          d[DonationField.Amount],
          slots[d[DonationField.Amount]],
          party[PartyField.Id],
        ]),
        symbolSize: (dataItem) => Math.min(30, 12 + (slots[dataItem[0]] - 1)),
        color: party[PartyField.Color],
      });
    });
  const option: EChartsOption = {
    grid,
    backgroundColor,
    tooltip: {
      confine: true,
      position: "top",
      formatter(data) {
        if (Array.isArray(data)) return "";

        const [amount, count, partyId] = data.data as [
          number,
          number,
          ReceiverId,
        ];
        const partyPart = `<div class="flex items-center font-semibold"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600" style="background-color: ${partiesMap[partyId][PartyField.Color]}"></div>
        <div>${partiesMap[partyId][PartyField.Short]}</div>
      </div></div>`;

        const formattedCurrency = formatCountryCurrency(
          browserBasedLocale,
          amount,
          country,
        );

        return `<div>
${partyPart}
  <div class="flex items-center space-x-1">
    <div class="font-semibold">${count}</div><div>x</div><div class="font-semibold">${formattedCurrency}</div>
  </div>
</div>`;
      },
    },
    title: titles,
    singleAxis: singleAxis,
    series: series,
  };

  const chartHeight = partiesCount * heightPerRow + grid.top + grid.bottom;

  return (
    <>
      {typeof biggestSpanParty === "string" ? (
        <p className="mb-6">
          <Translation
            t={t}
            translationId={"overview.scatter.span"}
            variables={{
              biggestSpanAmount: formatCountryCurrency(
                browserBasedLocale,
                biggestSpan,
                country,
              ),
              biggestSpanParty: (
                <TextPartyLink party={biggestSpanParty} locale={locale} />
              ),
            }}
          />
        </p>
      ) : null}
      <div className="flex items-center justify-center">
        <ExpandableReactEchart
          height={chartHeight}
          feature="scatter"
          option={option}
          title={chartTitle}
          subtitle={subtitle}
          years={years}
        />
      </div>
    </>
  );
};

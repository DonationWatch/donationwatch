"use client";
import { useLocale } from "next-intl";


import { ExpandableReactEchart } from "./expandable-react-echart";
import { useDonationsByYears } from "../../hooks/use-api";
import { useChart } from "../../hooks/use-chart";
import { isNotNullandNotUndefined } from "../../utils/array";
import { partyColor } from "../../utils/color";
import { type CountryConfig, getParty } from "../../utils/countries";
import { donationYear } from "../../utils/date";
import {
  formatCountryCurrency,
  formatPartyShortName,
} from "../../utils/formatter";
import { DonationField } from "../../utils/types";
import Loading from "../loading";
import { TextPartyLink } from "../text-party-link";
import { Translation } from "../translation";

import type { Donation, Party, ReceiverId } from "../../utils/types";
import type {
  EChartsOption,
  ScatterSeriesOption,
  SingleAxisComponentOption,
  TitleComponentOption,
} from "echarts";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const DonationYearScatterPlot = ({
  country,
  title: chartTitle,
  subtitle,
  years,
  parties,
}: {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  title: string;
  subtitle: string;
}) => {
  const t = useTranslations();
  const tData = useTranslations("data");
  const locale = useLocale();
  const { backgroundColor } = useChart();

  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  const titles: TitleComponentOption[] = [];
  const singleAxis: SingleAxisComponentOption[] = [];
  const series: ScatterSeriesOption[] = [];

  const partyDonations: Record<
    string,
    { sum: number; donations: Donation[]; slots: Record<number, number> }
  > = {};
  const partyIds = new Set(parties.map((p) => p.id));
  let largestAmount = 0;
  const numbers = new Set<number>();

  const spans: Record<ReceiverId, { min: number; max: number }> = {};

  donations.forEach((donation) => {
    if (!partyIds.has(donation[DonationField.Receiver])) return;
    if (!years.includes(donationYear(donation))) return;

    largestAmount = Math.max(largestAmount, donation[DonationField.Amount]);

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
      const party = getParty(country, partyId as ReceiverId);
      titles.push({
        top: `${idx * heightPerRow + grid.top + 4}`,
        left: 10,
        right: 10,
        text: party.short,
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
        min: country.minPublicDonationAmount,
        axisLabel: {
          formatter: (data) => formatCountryCurrency(locale, data, country),
        },
      });
      series.push({
        singleAxisIndex: idx,
        coordinateSystem: "singleAxis",
        type: "scatter",
        data: donations.map((d) => [
          d[DonationField.Amount],
          slots[d[DonationField.Amount]],
          party.id,
        ]),
        symbolSize: (dataItem) => Math.min(30, 12 + (slots[dataItem[0]] - 1)),
        color: partyColor(party.id, country),
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
        const partyPart = `<div class="flex items-center font-semibold"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600" style="background-color: ${partyColor(
          partyId,
          country,
        )}"></div>
        <div>${formatPartyShortName(country, partyId)}</div>
      </div></div>`;

        const formattedCurrency = formatCountryCurrency(
          locale,
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
            text={t.raw("overview.scatter.span")}
            variables={{
              biggestSpanAmount: formatCountryCurrency(
                locale,
                biggestSpan,
                country,
              ),
              biggestSpanParty: (
                <TextPartyLink
                  party={biggestSpanParty}
                  country={country}
                  locale={locale}
                />
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
          country={country}
        />
      </div>
    </>
  );
};

"use client";
import type { EChartsOption } from "echarts";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Countries } from "@/utils/countries";
import type { Donation, ReceiverId } from "@/utils/types";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { partyColor } from "@/utils/color";
import { Country } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatPartyShortName } from "@/utils/formatter";
import { createLambertConformalConicProjection } from "@/utils/map";
import { AddressField, DonationField } from "@/utils/types";

import { ExpandableReactEchart } from "./expandable-react-echart";

export const DonationStateMap = ({
  country,
  donations,
  title: chartTitle,
  subtitle,
  parties,
  years,
}: {
  country: CountryConfig;
  parties: Party[];
  years: string[];
  title: string;
  subtitle: string;
  donations: Donation[];
}) => {
  const t = useTranslations();
  const browserBasedLocale = useBrowserBasedLocale();
  const { isMobile, backgroundColor, isDark } = useChart();
  const countryCode = country.code;
  const isEu = country.id === Country.europeanunion;

  const stateDonations: Record<string, number> = {};

  const yearsSet = new Set(years);
  const partiesSet = new Set(parties.map((p) => p[PartyField.Id]));
  const foundParties = new Set<string>();

  const statePartyDonations = country.states.reduce<
    Record<string, Record<string, number>>
  >((acc, state) => {
    acc[state] = {};
    return acc;
  }, {});

  donations.forEach((donation) => {
    if (
      !isEu &&
      donation[DonationField.Address][AddressField.Country] !== countryCode
    )
      return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;
    if (!yearsSet.has(donationYear(donation))) return;
    if (!donation[DonationField.Address][AddressField.State]) return;

    const state = donation[DonationField.Address][AddressField.State];

    foundParties.add(donation[DonationField.Receiver]);

    stateDonations[state] ??= 0;
    stateDonations[state] += donation[DonationField.Amount];
    statePartyDonations[state] ??= {};
    statePartyDonations[state][donation[DonationField.Receiver]] ??= 0;
    statePartyDonations[state][donation[DonationField.Receiver]] +=
      donation[DonationField.Amount];
  });

  const max = Math.max(...Object.values(stateDonations)) ?? 0;
  const min = 0;

  const option: EChartsOption = {
    grid: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    backgroundColor,
    visualMap: {
      min,
      max,
      bottom: 20,
      right: 20,
      orient: isMobile ? "horizontal" : "vertical",
      formatter: (value) =>
        formatCountryCurrency(browserBasedLocale, value as number, country),
      inRange: {
        color: [
          "#fff",
          "#e0e7ff",
          "#c7d2fe",
          "#a5b4fc",
          "#818cf8",
          "#6366f1",
          "#4f46e5",
          "#4338ca",
          "#3730a3",
          "#312e81",
          "#1e1b4b",
        ],
      },

      calculable: true,
    },
    series: [
      {
        type: "map",
        roam: false,
        map: countryCode,
        emphasis: {
          label: {
            show: false,
          },
        },
        select: {
          disabled: true,
        },
        itemStyle: {
          areaColor: "#fff",
          borderColor: isDark ? "#171717" : "#737373",
        },
        projection: createLambertConformalConicProjection(country.projection!),
        showLegendSymbol: false,
        nameProperty: "name",
        label: {
          formatter: (params) => {
            return isEu
              ? t(`countries.${params.name as Countries}`)
              : // @ts-expect-error - The translation key is dynamic, but we ensure that it exists by checking the presence of the state and country fields.
                t(`state.${country.id}.${params.name}`);
          },
        },
        tooltip: {
          confine: true,
          formatter: (params) => {
            const state = params.name;
            const value = params.value as number;

            let tooltipContent = `<div class="min-w-[200px] text-lg font-semibold leading-normal">${
              isEu
                ? t(`countries.${state as Countries}`)
                : // @ts-expect-error - The translation key is dynamic, but we ensure that it exists by checking the presence of the state and country fields.
                  t(`state.${country.id}.${state}`)
            }</div>`;

            tooltipContent += `<div class="flex justify-between"><div class="font-semibold leading-normal">${t(
              "sum",
            )}</div>${formatCountryCurrency(browserBasedLocale, Number.isNaN(value) ? 0 : value, country)}</div>`;

            const donations = (
              Object.entries(statePartyDonations[params.name] ?? {}) as [
                ReceiverId,
                number,
              ][]
            )
              .toSorted(([, sumA], [, sumB]) => sumB - sumA)
              .map(([party, sum]) => {
                return `<div>
                  <div class="flex items-center font-semibold">
                    <div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600" style="background-color: ${partyColor(
                      party,
                      country,
                    )}"></div>
                    <div>${formatPartyShortName(country, party)}</div>
                  </div> 
                  ${formatCountryCurrency(browserBasedLocale, sum, country)}
                </div>`;
              });

            if (donations.length) {
              tooltipContent += `<div class="border-t my-2 border-slate-400"></div><div class="flex flex-col space-y-2">${donations.join(
                "",
              )}</div>`;
            }

            return tooltipContent;
          },
        },
        data: Object.entries(stateDonations).map(([state, amount]) => ({
          name: state,
          value: amount,
        })),
      },
    ],
    tooltip: {},
    legend: {},
  };

  return (
    <ExpandableReactEchart
      height={450}
      maxHeightScreen={true}
      feature="map"
      allowExpand={true}
      option={option}
      title={chartTitle}
      subtitle={subtitle}
      years={years}
      country={country}
    />
  );
};

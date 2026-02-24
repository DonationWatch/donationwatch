"use client";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";


import { ExpandableReactEchart } from "./expandable-react-echart";
import { useDonationsByParty } from "../../hooks/use-api";
import { useChart } from "../../hooks/use-chart";
import { donorTypeColor, partyColor } from "../../utils/color";
import { type CountryConfig, getParty } from "../../utils/countries";
import { donationYear } from "../../utils/date";
import { formatCountryCurrency } from "../../utils/formatter";
import { clientSha1 } from "../../utils/hash";
import { DonationField, DonorType } from "../../utils/types";
import Loading from "../loading";

import type { Donation, Party, ReceiverId } from "../../utils/types";
import type { EChartsOption, TreemapSeriesOption } from "echarts";
import type { TreemapSeriesNodeItemOption } from "echarts/types/src/chart/treemap/TreemapSeries.js";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const LoadedDonorTypeTreemap = ({
  country,
  title,
  subtitle,
  donations,
  parties = [],
  years = [],
}: {
  country: CountryConfig;
  title: string;
  subtitle: string;
  donations: Donation[];
  parties?: Party[];
  years?: string[];
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<Party>(parties);

  donations.forEach((donation) => {
    if (!years.length) {
      yearsSet.add(donationYear(donation));
    }
    if (!parties.length) {
      partiesSet.add(country.partiesById[donation[DonationField.Receiver]]);
    }
  });

  years = years.length ? years : Array.from(yearsSet);
  parties = parties.length ? parties : Array.from(partiesSet);

  const router = useRouter();
  const { backgroundColor, isDark, isMobile } = useChart();

  if (!donations.length) return null;

  const partyIdsSet = new Set<string>(parties.map((p) => p.id));
  const hasPartyLabel = parties.length > 1;

  const typeDonations: Partial<Record<DonorType, Donation[]>> = {};

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partyIdsSet.has(donation[DonationField.Receiver])) return;

    const type = donation[DonationField.DonorType] ?? DonorType.Other;
    typeDonations[type] ??= [];
    typeDonations[type].push(donation);
  });

  const treemapData: TreemapSeriesNodeItemOption[] = [];

  Object.entries(typeDonations).forEach(([type, donations]) => {
    const groupedDonations = donations.reduce<Record<string, Donation[]>>(
      (acc, donation) => {
        acc[donation[DonationField.Receiver]] ??= [];
        acc[donation[DonationField.Receiver]].push(donation);
        return acc;
      },
      {},
    );

    const children: TreemapSeriesNodeItemOption[] = [];
    Object.entries(groupedDonations).forEach(([receiver, donations]) => {
      const party = getParty(country, receiver as ReceiverId);

      // group donations by donor
      const donationByDonor = donations.reduce(
        (acc: Record<string, Donation[]>, donation) => {
          acc[donation[DonationField.DonorName]] ??= [];
          acc[donation[DonationField.DonorName]].push(donation);
          return acc;
        },
        {},
      );

      children.push({
        id: party.id,
        name: party.short,
        children: Object.entries(donationByDonor).map(([donor, donations]) => {
          return {
            id: donor,
            name: donor,
            value: donations.reduce(
              (sum, donation) => sum + donation[DonationField.Amount],
              0,
            ),
            label: {
              position: "insideTopLeft",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter(params: any) {
                return `{name|${donor}}\n{value|${formatCountryCurrency(locale, params.value as number, country)}}`;
              },
              itemStyle: {
                color: donorTypeColor(type as unknown as DonorType),
              },
              rich: {
                name: {
                  fontWeight: "bold",
                  padding: [0, 0, 4, 0],
                  // textBorderColor: `color-mix(in srgb, ${party.color} 40%, black)`,
                  textBorderWidth: 3,
                  textShadowBlur: 0,
                },
                value: {
                  // textBorderColor: `color-mix(in srgb, ${party.color} 40%, black)`,
                  textBorderWidth: 3,
                  textShadowBlur: 0,
                },
              },
            },
          };
        }),
        itemStyle: {
          borderRadius: 2,
        },
        label: {
          position: "insideTopLeft",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter(params: any) {
            return (
              (hasPartyLabel ? `{name|${party.short}}\n` : "") +
              `{value|${formatCountryCurrency(locale, params.value as number, country)}}`
            );
          },
          rich: {
            name: {
              fontWeight: "bold",
              padding: [0, 0, 4, 0],
              // textBorderColor: `color-mix(in srgb, ${party.color} 40%, black)`,
              textBorderWidth: 3,
              textShadowBlur: 0,
            },
            value: {
              // textBorderColor: `color-mix(in srgb, ${party.color} 40%, black)`,
              textBorderWidth: 3,
              textShadowBlur: 0,
            },
          },
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Somehow the types are incorrect
        tooltip: {
          show: true,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            if (params.treeAncestors.length !== 3) return "";

            const partyPart = `<div class="flex items-center font-semibold"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600" style="background-color: ${partyColor(
              party.id,
              country,
            )}"></div>
        <div>${party.short}</div>
      </div></div>`;

            return `<div class="max-w-60 text-wrap">${partyPart}<div>${formatCountryCurrency(locale, params.value as number, country)}</div></div>`;
          },
        },
      });
    });

    treemapData.push({
      id: type,
      name: type,
      value: donations.reduce(
        (sum, donation) => sum + donation[DonationField.Amount],
        0,
      ),
      // colorSaturation: [0.35, 0.5],
      upperLabel: {
        show: true,
        rich: {
          value: {
            align: "right",
            padding: [7, 4, 0, 4],
          },
          name: {
            padding: [7, 4, 0, 4],
          },
        },
        height: 24,
      },
      itemStyle: {
        borderRadius: 2,
        borderWidth: 3,
        gapWidth: 2,
        borderColor: isDark ? "#111827" : "#f3f4f6",
      },
      children,
    });
  });

  const option: EChartsOption = {
    backgroundColor,
    tooltip: {
      confine: true,
      show: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        let content = "";

        if (params.treeAncestors.length === 1) return "";

        if (params.treeAncestors.length === 2) {
          // is "root" level
          const categoryName = t(`donor_type.${params.name as DonorType}`);
          content = `<div class="font-semibold">${categoryName}</div> <div>${formatCountryCurrency(locale, params.value as number, country)}</div>`;
        }

        if (params.treeAncestors.length === 3) return "";

        if (params.treeAncestors.length === 4) {
          content = `<div class="font-semibold">${params.name}</div> <div>${formatCountryCurrency(locale, params.value as number, country)}</div>`;
        }

        console.log("treeAncestors", params.treeAncestors);

        return `<div class="max-w-60 text-wrap">${content}</div>`;
      },
    },
    series: {
      name: t("years.title"),
      type: "treemap",
      roam: !isMobile,
      nodeClick: false,
      visibleMin: 300,
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
      upperLabel: {
        show: false,
      },
      breadcrumb: {
        show: false,
      },
      label: {
        position: "insideTopLeft",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formatter(params: any) {
          if (params.treeAncestors.length === 1) return "";

          if (params.treeAncestors.length === 2) {
            // is "root" level
            return `{name|${t(`donor_type.${params.name as DonorType}`)}} {value|${formatCountryCurrency(locale, params.value as number, country)}}`;
          }

          return ``;
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
      itemStyle: {
        gapWidth: 2,
        borderColor: "transparent",
      },
      data: treemapData,
    } satisfies TreemapSeriesOption,
  };
  return (
    <ExpandableReactEchart
      height={600}
      maxHeightScreen={true}
      title={title}
      subtitle={subtitle}
      years={years}
      allowExpand={true}
      country={country}
      feature="treemap"
      option={option}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={(params: any) => {
        if (params.componentType !== "series") return;
        if (params.componentSubType !== "treemap") return;

        const dataId = params.data?.["id"];
        if (!dataId) return;

        if (params.treeAncestors.length === 4) {
          // is donor level
          clientSha1(dataId).then((donorId) => {
            router.push(`/${locale}/${country.id}/donor/${donorId}`);
          });
        }
      }}
    />
  );
};

export const LoadingPartyDonorTypeTreemap = ({
  country,
  party,
  title,
  subtitle,
}: {
  country: CountryConfig;
  party: Party;
  title: string;
  subtitle: string;
}) => {
  const t = useTranslations("data");

  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{t("error")}</div>;

  return (
    <LoadedDonorTypeTreemap
      country={country}
      title={title}
      subtitle={subtitle}
      donations={data}
      parties={[party]}
      years={[]}
    />
  );
};

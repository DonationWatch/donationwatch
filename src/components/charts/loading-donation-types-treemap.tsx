"use client";

import type { EChartsOption, TreemapSeriesOption } from "echarts";
import type { TreemapSeriesNodeItemOption } from "echarts/types/src/chart/treemap/TreemapSeries.js";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { donationTypeColor } from "@/utils/color";
import { donationYear } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import { formatCountryCurrency } from "@/utils/formatter";
import { clientSha1 } from "@/utils/hash";
import { capitalize } from "@/utils/string";
import { DonationField, DonationType } from "@/utils/types";

import { ExpandableReactEchart } from "./expandable-react-echart";

export const LoadedDonationTypeTreemap = ({
  title,
  subtitle,
  donations,
  parties = [],
  years = [],
}: {
  title: string;
  subtitle: string;
  donations: Donation[];
  parties?: Party[];
  years?: string[];
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const tDonationType = useTranslations("donation_type");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const partiesMap = usePartiesMap();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<Party>(parties);

  donations.forEach((donation) => {
    if (!years.length) {
      yearsSet.add(donationYear(donation));
    }
    if (!parties.length) {
      partiesSet.add(partiesMap[donation[DonationField.Receiver]]);
    }
  });

  years = years.length ? years : Array.from(yearsSet);
  parties = parties.length ? parties : Array.from(partiesSet);

  const router = useRouter();
  const { backgroundColor, isDark, isMobile } = useChart();

  if (!donations.length) return null;

  const partyIdsSet = new Set<string>(parties.map((p) => p[PartyField.Id]));

  const typeDonations: Partial<Record<DonationType, Donation[]>> = {};

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partyIdsSet.has(donation[DonationField.Receiver])) return;

    const type = donation[DonationField.DonationType] ?? DonationType.Money;
    typeDonations[type] ??= [];
    typeDonations[type]!.push(donation);
  });

  const treemapData: TreemapSeriesNodeItemOption[] = [];

  const sortedTypeEntries = Object.entries(typeDonations).sort(
    ([, a], [, b]) => {
      const sumA = a!.reduce((s, d) => s + d[DonationField.Amount], 0);
      const sumB = b!.reduce((s, d) => s + d[DonationField.Amount], 0);
      return sumB - sumA;
    },
  );

  sortedTypeEntries.forEach(([typeStr, donationsForType]) => {
    const type = Number(typeStr) as DonationType;
    const color = donationTypeColor(type);

    const donationByDonor = donationsForType!.reduce<
      Record<string, Donation[]>
    >((acc, donation) => {
      const donor = donation[DonationField.DonorName];
      acc[donor] ??= [];
      acc[donor].push(donation);
      return acc;
    }, {});

    const children: TreemapSeriesNodeItemOption[] = Object.entries(
      donationByDonor,
    ).map(([donor, donorDonations]) => {
      const donorDisplayName = getDonorName(donor, tCommon);
      const donorSum = donorDonations.reduce(
        (sum, donation) => sum + donation[DonationField.Amount],
        0,
      );

      return {
        id: donor,
        name: donorDisplayName,
        value: donorSum,
        itemStyle: {
          color,
          borderRadius: 2,
        },
        label: {
          position: "insideTopLeft",
          formatter(params) {
            return `{name|${donorDisplayName}}\n{value|${formatCountryCurrency(browserBasedLocale, params.value as number, country)}}`;
          },
          rich: {
            name: {
              fontWeight: "bold",
              padding: [0, 0, 4, 0],
              textBorderWidth: 3,
              textShadowBlur: 0,
            },
            value: {
              textBorderWidth: 3,
              textShadowBlur: 0,
            },
          },
        },
        tooltip: {
          show: true,
          formatter: () => {
            const typeName = capitalize(tDonationType(`${type}`));
            return `<div class="max-w-60 text-wrap">
              <div class="flex items-center font-semibold mb-1">
                <div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full" style="background-color: ${color}"></div>
                <div>${typeName}</div>
              </div>
              <div class="font-medium">${donorDisplayName}</div>
              <div>${formatCountryCurrency(browserBasedLocale, donorSum, country)}</div>
            </div>`;
          },
        },
      };
    });

    const typeTotal = donationsForType!.reduce(
      (sum, donation) => sum + donation[DonationField.Amount],
      0,
    );

    treemapData.push({
      id: `${type}`,
      name: `${type}`,
      value: typeTotal,
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
      formatter: (params) => {
        if (Array.isArray(params)) return "";

        const treeAncestors =
          (params as unknown as { treeAncestors?: Array<{ name?: string }> })
            .treeAncestors ?? [];
        let content = "";

        if (treeAncestors.length === 1) return "";

        if (treeAncestors.length === 2) {
          // is "root" level (DonationType)
          const type = Number(params.name) as DonationType;
          const typeName = capitalize(tDonationType(`${type}`));
          content = `<div class="font-semibold">${typeName}</div> <div>${formatCountryCurrency(browserBasedLocale, params.value as number, country)}</div>`;
        }

        if (treeAncestors.length === 3) {
          // is donor level
          const parentType = Number(treeAncestors[1]?.name) as DonationType;
          const typeName = capitalize(tDonationType(`${parentType}`));
          const color = donationTypeColor(parentType);
          content = `<div class="flex items-center font-semibold mb-1"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full" style="background-color: ${color}"></div><div>${typeName}</div></div><div class="font-medium">${params.name}</div><div>${formatCountryCurrency(browserBasedLocale, params.value as number, country)}</div>`;
        }

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
        formatter(params) {
          const treeAncestors =
            (params as unknown as { treeAncestors?: unknown[] })
              .treeAncestors ?? [];

          if (treeAncestors.length === 1) return "";

          if (treeAncestors.length === 2) {
            // is "root" level
            const type = Number(params.name) as DonationType;
            const typeName = capitalize(tDonationType(`${type}`));
            return `{name|${typeName}} {value|${formatCountryCurrency(browserBasedLocale, params.value as number, country)}}`;
          }

          return "";
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
      feature="treemap"
      option={option}
      onClick={(params) => {
        if (params.componentType !== "series") return;
        if (params.componentSubType !== "treemap") return;

        const typedParams = params as unknown as {
          data?: { id?: string };
          treeAncestors?: unknown[];
        };
        const dataId = typedParams.data?.id;
        if (!dataId) return;

        if (typedParams.treeAncestors?.length === 3) {
          // is donor level
          clientSha1(dataId).then((donorId) => {
            router.push(`/${locale}/${country.id}/donor/${donorId}`);
          });
        }
      }}
    />
  );
};

export const LoadingPartyDonationTypeTreemap = ({
  party,
  title,
  subtitle,
  donations,
}: {
  party: Party;
  title: string;
  subtitle: string;
  donations: Donation[];
}) => {
  return (
    <LoadedDonationTypeTreemap
      title={title}
      subtitle={subtitle}
      donations={donations}
      parties={[party]}
      years={[]}
    />
  );
};

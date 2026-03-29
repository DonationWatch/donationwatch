"use client";
import type { EChartsOption, TreemapSeriesOption } from "echarts";
import type { TreemapSeriesNodeItemOption } from "echarts/types/src/chart/treemap/TreemapSeries.js";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation, ReceiverId } from "@/utils/types";

import Loading from "@/components/loading/loading";
import { useDonationsByParty, useDonationsByYears } from "@/hooks/use-api";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { isNotNullandNotUndefined } from "@/utils/array";
import { partyColor } from "@/utils/color";
import { getParty } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import { formatCountryCurrency } from "@/utils/formatter";
import { clientSha1 } from "@/utils/hash";
import { DonationField } from "@/utils/types";

import { ExpandableReactEchart } from "./expandable-react-echart";

export const LoadedDonationYearsTreemap = ({
  country,
  tooSmallAreaColor = "#6366f1",
  title,
  subtitle,
  donations,
  parties = [],
  years = [],
}: {
  country: CountryConfig;
  tooSmallAreaColor?: string;
  title: string;
  subtitle: string;
  donations: Donation[];
  parties?: Party[];
  years?: string[];
}) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const locale = useLocale();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<Party>(parties);

  donations.forEach((donation) => {
    if (!years.length) {
      yearsSet.add(donationYear(donation));
    }
    if (!parties.length) {
      partiesSet.add(
        country.parties.find(
          (p) => p[PartyField.Id] === donation[DonationField.Receiver],
        )!,
      );
    }
  });

  years = years.length ? years : Array.from(yearsSet);
  parties = parties.length ? parties : Array.from(partiesSet);

  const router = useRouter();
  const { backgroundColor, isDark, isMobile } = useChart();

  if (!donations.length) return null;

  const partyIdsSet = new Set<string>(parties.map((p) => p[PartyField.Id]));
  const hasPartyLabel = parties.length > 1;

  const donorDonations: Record<string, Donation[]> = {};

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partyIdsSet.has(donation[DonationField.Receiver])) return;

    donorDonations[donation[DonationField.DonorName]] ??= [];
    donorDonations[donation[DonationField.DonorName]].push(donation);
  });

  const treemapData: TreemapSeriesNodeItemOption[] = [];

  Object.entries(donorDonations).forEach(([donor, donations]) => {
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
      const sum = donations.reduce(
        (sum, donation) => sum + donation[DonationField.Amount],
        0,
      );
      const party = getParty(country, receiver as ReceiverId);

      children.push({
        id: party[PartyField.Id],
        name: party[PartyField.Short],
        value: sum,
        itemStyle: {
          borderRadius: 2,
          color: party[PartyField.Color],
        },
        label: {
          position: "insideTopLeft",
          formatter(params) {
            return (
              (hasPartyLabel ? `{name|${party[PartyField.Short]}}\n` : "") +
              `{value|${formatCountryCurrency(locale, params.value as number, country)}}`
            );
          },
          rich: {
            name: {
              fontWeight: "bold",
              padding: [0, 0, 4, 0],
              textBorderColor: `color-mix(in srgb, ${party[PartyField.Color]} 40%, black)`,
              textBorderWidth: 3,
              textShadowBlur: 0,
            },
            value: {
              textBorderColor: `color-mix(in srgb, ${party[PartyField.Color]} 40%, black)`,
              textBorderWidth: 3,
              textShadowBlur: 0,
            },
          },
        },
        // @ts-expect-error Somehow the types are incorrect
        tooltip: {
          show: true,
          // @ts-expect-error Somehow the types are incorrect
          formatter: (params) => {
            if (params.treeAncestors.length !== 3) return "";

            const partyPart = `<div class="flex items-center font-semibold"><div class="mr-2 inline-block h-2 w-2 shrink-0 rounded-full border border-solid border-transparent dark:border-slate-600" style="background-color: ${partyColor(
              party[PartyField.Id],
              country,
            )}"></div>
        <div>${party[PartyField.Short]}</div>
      </div></div>`;

            return `<div class="max-w-60 text-wrap">${partyPart}<div>${formatCountryCurrency(locale, params.value as number, country)}</div></div>`;
          },
        },
      });
    });

    treemapData.push({
      id: donor,
      name: donor,
      value: donations.reduce(
        (sum, donation) => sum + donation[DonationField.Amount],
        0,
      ),
      colorSaturation: [0.35, 0.5],
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
        color: tooSmallAreaColor,
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

        let content = "";
        // @ts-expect-error Somehow the types are incorrect
        const treeAncestors: unknown[] = params.treeAncestors;

        if (treeAncestors.length === 1) return "";

        if (treeAncestors.length === 2) {
          // is "root" level
          content = `<div class="font-semibold">${params.name}</div> <div>${formatCountryCurrency(locale, params.value as number, country)}</div>`;
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
          // @ts-expect-error Somehow the types are incorrect
          const treeAncestors: unknown[] = params.treeAncestors;

          if (treeAncestors.length === 1) return "";

          if (treeAncestors.length === 2) {
            // is "root" level
            return `{name|${getDonorName(params.name, tCommon)}} {value|${formatCountryCurrency(locale, params.value as number, country)}}`;
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
      onClick={(params) => {
        if (params.componentType !== "series") return;
        if (params.componentSubType !== "treemap") return;

        // @ts-expect-error Somehow the types are incorrect
        const dataId: string | undefined = params.data?.["id"];
        if (!dataId) return;

        if (params.treeAncestors.length === 2) {
          // is donor level
          clientSha1(dataId).then((donorId) => {
            router.push(`/${locale}/${country.id}/donor/${donorId}`);
          });
        }

        if (!hasPartyLabel) return;
        if (params.treeAncestors.length === 3) {
          // is party level
          router.push(`/${locale}/${country.id}/party/${dataId}`);
        }
      }}
    />
  );
};

export const LoadingDonationYearsTreemap = ({
  country,
  years,
  parties,
  tooSmallAreaColor = "#6366f1",
  title,
  subtitle,
}: {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  tooSmallAreaColor?: string;
  title: string;
  subtitle: string;
}) => {
  const t = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{t("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <LoadedDonationYearsTreemap
      country={country}
      title={title}
      subtitle={subtitle}
      donations={donations}
      tooSmallAreaColor={tooSmallAreaColor}
      parties={parties}
      years={years}
    />
  );
};

export const LoadingDonationPartyTreemap = ({
  country,
  party,
  tooSmallAreaColor = "#6366f1",
  title,
  subtitle,
}: {
  country: CountryConfig;
  party: Party;
  tooSmallAreaColor?: string;
  title: string;
  subtitle: string;
}) => {
  const t = useTranslations("data");

  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{t("error")}</div>;

  return (
    <LoadedDonationYearsTreemap
      country={country}
      title={title}
      subtitle={subtitle}
      donations={data}
      tooSmallAreaColor={tooSmallAreaColor}
      parties={[party]}
      years={[]}
    />
  );
};

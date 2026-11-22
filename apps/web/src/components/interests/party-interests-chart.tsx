"use client";

import type {
  PolicyInterestTag,
  PolicyMacroDomain,
  TagExposureStats,
} from "@donationwatch/core/types/interests";
import type { EChartsOption, TreemapSeriesOption } from "echarts";
import type { TreemapSeriesNodeItemOption } from "echarts/types/src/chart/treemap/TreemapSeries.js";

import {
  AttributionRole,
  POLICY_MACRO_DOMAIN_SLUGS,
} from "@donationwatch/core/types/interests";
import { getCountryName } from "@donationwatch/core/utils/countries";
import { donationYear } from "@donationwatch/core/utils/date";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatYearsRange,
} from "@donationwatch/core/utils/formatter";
import { clientSha1 } from "@donationwatch/core/utils/hash";
import {
  interestColorFor,
  macroDomainColorFor,
} from "@donationwatch/core/utils/interests/interest-colors";
import { getPartyFullAndShortName } from "@donationwatch/core/utils/party";
import { DonationField } from "@donationwatch/core/utils/types";
import { getDonorInterests } from "@donationwatch/data/queries/aggregate-interests";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { ChartCard } from "@/components/charts/expandable-react-echart";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useChart } from "@/hooks/use-chart";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

import { useInterestsContext } from "./interests-context";

interface CustomTreemapNodeExtra {
  id: string;
  tag?: PolicyInterestTag;
  tagLabel?: string;
  macroDomain?: PolicyMacroDomain;
  macroDomainLabel?: string;
  description?: string;
  isUncategorized?: boolean;
  isCompany?: boolean;
  isUncategorizedCompany?: boolean;
  donorName?: string;
  role?: AttributionRole;
  donationCount?: number;
  sectorTotal?: number;
  coreAmount?: number;
  partialAmount?: number;
  uniqueDonorsCount?: number;
  activeValue: number;
  totalPartyDonations: number;
}

interface SectorCompanyDonation {
  donorName: string;
  amount: number;
  role: AttributionRole;
  donationCount: number;
}

interface UncategorizedDonorDonation {
  donorName: string;
  amount: number;
  donationCount: number;
}

export const PartyInterestsChart = () => {
  const {
    state: {
      donations,
      sortedTags,
      sortedMacroDomains,
      totalPartyDonations,
      totalTrackedExposure,
      viewMode,
      isGrouped,
    },
    meta: { scope, interestMap },
  } = useInterestsContext();
  const country = useRequiredCountryConfig();
  const locale = useBrowserBasedLocale();
  const routeLocale = useLocale();
  const router = useRouter();
  const t = useTranslations("party.interests");
  const tInterests = useTranslations("interests");
  const tCountries = useTranslations("countries");
  const {
    backgroundColor,
    isDark,
    isMobile,
    treemapBorderColor,
    treemapColors,
  } = useChart();

  const countryName = getCountryName(country, tCountries);
  const party = scope.kind === "party" ? scope.party : undefined;
  const propYears = scope.kind === "years" ? scope.years : undefined;
  const partyDisplayName = party ? getPartyFullAndShortName(party) : undefined;
  const yearsLabel = propYears
    ? formatYearsRange(propYears)
    : formatYearsRange(country.years);

  // Remaining donations not tied to any tracked policy interest
  const uncategorizedAmount = Math.max(
    0,
    totalPartyDonations - totalTrackedExposure,
  );

  // Decal pattern for peak bodies & umbrella groups (partial exposure)
  const decalPattern = useMemo(
    () => ({
      symbol: "rect",
      dashArrayX: [1, 0],
      dashArrayY: [3, 3],
      rotation: Math.PI / 4,
      color: isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.75)",
    }),
    [isDark],
  );

  // Group company donations by sector tag
  const companiesByTag = useMemo(() => {
    const map = new Map<
      PolicyInterestTag,
      Map<string, SectorCompanyDonation>
    >();

    for (const d of donations) {
      const donorName = d[DonationField.DonorName];
      if (!donorName) continue;
      const amount = d[DonationField.Amount] || 0;
      const attributions = getDonorInterests(donorName, interestMap);

      for (const attr of attributions) {
        if (viewMode === "core" && attr.role !== AttributionRole.core) {
          continue;
        }

        if (!map.has(attr.tag)) {
          map.set(attr.tag, new Map());
        }
        const tagMap = map.get(attr.tag)!;
        const existing = tagMap.get(donorName);
        if (existing) {
          existing.amount += amount;
          existing.donationCount++;
        } else {
          tagMap.set(donorName, {
            donorName,
            amount,
            role: attr.role,
            donationCount: 1,
          });
        }
      }
    }

    const result = new Map<PolicyInterestTag, SectorCompanyDonation[]>();
    for (const [tag, tagMap] of map.entries()) {
      const sorted = Array.from(tagMap.values()).sort(
        (a, b) => b.amount - a.amount,
      );
      result.set(tag, sorted);
    }
    return result;
  }, [donations, interestMap, viewMode]);

  // Group donations for untracked / uncategorized donors
  const uncategorizedDonors = useMemo(() => {
    const map = new Map<string, UncategorizedDonorDonation>();

    for (const d of donations) {
      const donorName = d[DonationField.DonorName];
      if (!donorName) continue;
      const attributions = getDonorInterests(donorName, interestMap);
      const hasActiveAttribution =
        viewMode === "core"
          ? attributions.some((a) => a.role === AttributionRole.core)
          : attributions.length > 0;
      if (hasActiveAttribution) continue;

      const amount = d[DonationField.Amount] || 0;
      const existing = map.get(donorName);
      if (existing) {
        existing.amount += amount;
        existing.donationCount++;
      } else {
        map.set(donorName, {
          donorName,
          amount,
          donationCount: 1,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [donations, interestMap, viewMode]);

  const treemapData = useMemo(() => {
    const nodes: (TreemapSeriesNodeItemOption & CustomTreemapNodeExtra)[] = [];

    // 1. Uncategorized / Other Donors node with its individual nested children
    if (uncategorizedAmount > 0) {
      const share =
        totalPartyDonations > 0 ? uncategorizedAmount / totalPartyDonations : 0;
      const pctStr = `${(share * 100).toFixed(share < 0.01 && share > 0 ? 2 : 1)}%`;
      const valFormatted = formatCompactCountryCurrency(
        locale,
        uncategorizedAmount,
        country,
      );

      const uncategorizedChildren: (TreemapSeriesNodeItemOption &
        CustomTreemapNodeExtra)[] = uncategorizedDonors.map((c) => {
        const compValFormatted = formatCompactCountryCurrency(
          locale,
          c.amount,
          country,
        );

        return {
          id: `uncategorized-${c.donorName}`,
          name: c.donorName,
          value: c.amount,
          activeValue: c.amount,
          donorName: c.donorName,
          donationCount: c.donationCount,
          sectorTotal: uncategorizedAmount,
          totalPartyDonations,
          isUncategorizedCompany: true,
          itemStyle: {
            color: isDark ? treemapColors.zinc800 : treemapColors.zinc200,
            borderRadius: 2,
          },
          label: {
            show: true,
            position: "insideTopLeft",
            formatter: () => {
              return `{name|${c.donorName}}\n{value|${compValFormatted}}`;
            },
            rich: {
              name: {
                fontWeight: "bold",
                fontSize: 11,
                lineHeight: 15,
                color: isDark ? treemapColors.zinc100 : treemapColors.zinc800,
              },
              value: {
                fontSize: 10,
                lineHeight: 14,
                color: isDark ? treemapColors.zinc400 : treemapColors.zinc600,
              },
            },
          },
        };
      });

      const uncategorizedLabel = t("chart.uncategorized");
      nodes.push({
        id: "uncategorized",
        name: uncategorizedLabel,
        value: uncategorizedAmount,
        activeValue: uncategorizedAmount,
        totalPartyDonations,
        isUncategorized: true,
        upperLabel: {
          show: true,
          height: 24,
          formatter: () => {
            return `{name|${uncategorizedLabel}} {value|${valFormatted} (${pctStr})}`;
          },
          rich: {
            name: {
              padding: [7, 4, 0, 4],
              fontSize: 12,
              color: isDark ? treemapColors.zinc100 : treemapColors.zinc900,
            },
            value: {
              padding: [7, 4, 0, 4],
              fontSize: 11,
              align: "right",
              color: isDark ? treemapColors.zinc400 : treemapColors.zinc600,
            },
          },
        },
        itemStyle: {
          borderRadius: 2,
          borderWidth: 3,
          gapWidth: 2,
          borderColor: treemapBorderColor,
        },
        children:
          uncategorizedChildren.length > 0 ? uncategorizedChildren : undefined,
      });
    }

    // 2. Tracked Sectors: 3-level (Macro-Domain -> Industry -> Donor) when grouped,
    // or 2-level (Industry -> Donor) when ungrouped.
    const buildSectorNode = (
      stat: TagExposureStats,
    ): TreemapSeriesNodeItemOption & CustomTreemapNodeExtra => {
      const activeValue =
        viewMode === "exposure" ? stat.totalExposureAmount : stat.coreAmount;
      const catColor = interestColorFor(stat.tag);
      const tagLabel = tInterests(
        `tags.${stat.slug}.label` as Parameters<typeof tInterests>[0],
      );
      const tagDesc = tInterests(
        `tags.${stat.slug}.description` as Parameters<typeof tInterests>[0],
      );
      const domainLabel = tInterests(
        `domains.${POLICY_MACRO_DOMAIN_SLUGS[stat.macroDomain]}.label` as Parameters<
          typeof tInterests
        >[0],
      );
      const share =
        totalPartyDonations > 0 ? activeValue / totalPartyDonations : 0;
      const pctStr = `${(share * 100).toFixed(share < 0.01 && share > 0 ? 2 : 1)}%`;
      const valFormatted = formatCompactCountryCurrency(
        locale,
        activeValue,
        country,
      );

      const companies = companiesByTag.get(stat.tag) ?? [];
      const companyChildren: (TreemapSeriesNodeItemOption &
        CustomTreemapNodeExtra)[] = companies.map((c) => {
        const isPartial = c.role === AttributionRole.partial;
        const compValFormatted = formatCompactCountryCurrency(
          locale,
          c.amount,
          country,
        );

        return {
          id: `${stat.tag}-${c.donorName}`,
          name: c.donorName,
          value: c.amount,
          activeValue: c.amount,
          tag: stat.tag,
          tagLabel,
          macroDomain: stat.macroDomain,
          macroDomainLabel: domainLabel,
          donorName: c.donorName,
          role: c.role,
          donationCount: c.donationCount,
          sectorTotal: activeValue,
          totalPartyDonations,
          isCompany: true,
          itemStyle: {
            color: catColor,
            decal: isPartial ? decalPattern : undefined,
            borderRadius: 2,
          },
          label: {
            show: true,
            position: "insideTopLeft",
            formatter: () => {
              return `{name|${c.donorName}}\n{value|${compValFormatted}}`;
            },
            rich: {
              name: {
                fontWeight: "bold",
                fontSize: 11,
                lineHeight: 15,
                color: "#ffffff",
                textBorderColor: "rgba(0, 0, 0, 0.65)",
                textBorderWidth: 2,
              },
              value: {
                fontSize: 10,
                lineHeight: 14,
                color: "#ffffff",
                textBorderColor: "rgba(0, 0, 0, 0.65)",
                textBorderWidth: 2,
              },
            },
          },
        };
      });

      return {
        id: String(stat.tag),
        name: tagLabel,
        value: activeValue,
        activeValue,
        tag: stat.tag,
        tagLabel,
        macroDomain: stat.macroDomain,
        macroDomainLabel: domainLabel,
        description: tagDesc,
        coreAmount: stat.coreAmount,
        partialAmount: stat.partialAmount,
        uniqueDonorsCount: stat.uniqueDonorsCount,
        totalPartyDonations,
        isUncategorized: false,
        upperLabel: {
          show: true,
          height: isGrouped ? 22 : 24,
          formatter: () => {
            return `{name|${tagLabel}} {value|${valFormatted} (${pctStr})}`;
          },
          rich: {
            name: {
              padding: isGrouped ? [5, 4, 0, 4] : [7, 4, 0, 4],
              fontSize: isGrouped ? 11 : 12,
              color: isDark ? treemapColors.zinc100 : treemapColors.zinc900,
            },
            value: {
              padding: isGrouped ? [5, 4, 0, 4] : [7, 4, 0, 4],
              fontSize: isGrouped ? 10 : 11,
              align: "right",
              color: isDark ? treemapColors.zinc400 : treemapColors.zinc600,
            },
          },
        },
        itemStyle: {
          borderRadius: 2,
          borderWidth: isGrouped ? 2 : 3,
          gapWidth: 2,
          borderColor: treemapBorderColor,
        },
        children: companyChildren.length > 0 ? companyChildren : undefined,
      };
    };

    if (isGrouped) {
      const tagsByDomain = new Map<PolicyMacroDomain, TagExposureStats[]>();
      for (const stat of sortedTags) {
        const activeValue =
          viewMode === "exposure" ? stat.totalExposureAmount : stat.coreAmount;
        if (activeValue <= 0) continue;
        const list = tagsByDomain.get(stat.macroDomain) ?? [];
        list.push(stat);
        tagsByDomain.set(stat.macroDomain, list);
      }

      for (const domainStat of sortedMacroDomains) {
        const domainActiveValue =
          viewMode === "exposure"
            ? domainStat.totalExposureAmount
            : domainStat.coreAmount;
        if (domainActiveValue <= 0) continue;

        const domainTags = tagsByDomain.get(domainStat.domain) ?? [];
        if (domainTags.length === 0) continue;

        const domainLabel = tInterests(
          `domains.${domainStat.slug}.label` as Parameters<
            typeof tInterests
          >[0],
        );
        const domainDesc = tInterests(
          `domains.${domainStat.slug}.description` as Parameters<
            typeof tInterests
          >[0],
        );

        // Omit naive sum from broad header to avoid misleading totals when sectors overlap;
        // the deduplicated domain total is shown in the tooltip via activeValue.
        nodes.push({
          id: `domain-${domainStat.domain}`,
          name: domainLabel,
          activeValue: domainActiveValue,
          macroDomain: domainStat.domain,
          macroDomainLabel: domainLabel,
          description: domainDesc,
          coreAmount: domainStat.coreAmount,
          partialAmount: domainStat.partialAmount,
          uniqueDonorsCount: domainStat.uniqueDonorsCount,
          totalPartyDonations,
          isUncategorized: false,
          upperLabel: {
            show: true,
            height: 24,
            formatter: () => `{name|${domainLabel}}`,
            rich: {
              name: {
                padding: [6, 4, 0, 4],
                fontSize: 12,
                fontWeight: "bold",
                color: isDark ? treemapColors.zinc100 : treemapColors.zinc900,
              },
            },
          },
          itemStyle: {
            borderRadius: 2,
            borderWidth: 3,
            gapWidth: 2,
            borderColor: treemapBorderColor,
          },
          children: domainTags.map(buildSectorNode),
        });
      }
    } else {
      for (const stat of sortedTags) {
        const activeValue =
          viewMode === "exposure" ? stat.totalExposureAmount : stat.coreAmount;
        if (activeValue <= 0) continue;
        nodes.push(buildSectorNode(stat));
      }
    }

    return nodes;
  }, [
    uncategorizedAmount,
    totalPartyDonations,
    locale,
    country,
    isDark,
    treemapBorderColor,
    treemapColors,
    isGrouped,
    sortedTags,
    sortedMacroDomains,
    viewMode,
    companiesByTag,
    uncategorizedDonors,
    decalPattern,
    t,
    tInterests,
  ]);

  const option = useMemo<EChartsOption>(() => {
    return {
      darkMode: isDark,
      backgroundColor,
      tooltip: {
        confine: true,
        show: true,
        formatter: (params: unknown) => {
          if (!params || typeof params !== "object" || Array.isArray(params)) {
            return "";
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = (params as any).data as
            | CustomTreemapNodeExtra
            | undefined;
          if (!data) return "";

          // 1. Tooltip for company node inside a policy interest sector or macro-domain
          if (data.isCompany && data.donorName) {
            const catColor =
              data.tag !== undefined
                ? interestColorFor(data.tag)
                : macroDomainColorFor(data.macroDomain!);
            const categoryLabel = data.tagLabel ?? data.macroDomainLabel ?? "";
            const categoryBreadcrumbs = data.tagLabel
              ? `${data.macroDomainLabel} · ${data.tagLabel}`
              : (data.macroDomainLabel ?? "");
            const shareOfParty =
              data.totalPartyDonations > 0
                ? (data.activeValue / data.totalPartyDonations) * 100
                : 0;
            const shareOfSector =
              data.sectorTotal && data.sectorTotal > 0
                ? (data.activeValue / data.sectorTotal) * 100
                : 0;

            return `
              <div class="space-y-1.5 p-0.5 text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="inline-block size-2.5 rounded-full shrink-0" style="background-color: ${catColor};"></span>
                  <span class="font-bold text-sm text-foreground">${data.donorName}</span>
                </div>
                <div class="text-xs text-muted-foreground">
                  ${categoryBreadcrumbs} · <span class="font-medium text-foreground">${
                    data.role === AttributionRole.core
                      ? t("chart.tooltip_direct_business")
                      : t("chart.tooltip_multisector")
                  }</span>
                </div>
                <div class="text-xs font-semibold text-foreground">
                  ${formatCountryCurrency(locale, data.activeValue, country)}
                </div>
                <div class="border-t border-border/50 pt-1 space-y-1 text-muted-foreground">
                  <div class="flex justify-between gap-4">
                    <span>${t("chart.tooltip_share_of", { category: categoryLabel })}</span>
                    <span class="font-medium text-foreground">${shareOfSector.toFixed(1)}%</span>
                  </div>
                  <div class="flex justify-between gap-4">
                    <span>${party ? t("chart.tooltip_share_party") : t("chart.tooltip_share_total")}</span>
                    <span class="font-medium text-foreground">${shareOfParty.toFixed(1)}%</span>
                  </div>
                  <div class="flex justify-between gap-4">
                    <span>${t("chart.tooltip_donations")}</span>
                    <span class="font-medium text-foreground">${data.donationCount ?? 1}</span>
                  </div>
                </div>
                ${
                  data.role === AttributionRole.core
                    ? `
                  <div class="border-t border-border/50 pt-1 text-[11px] text-muted-foreground">
                    ${t("chart.tooltip_solid_hint")}
                  </div>
                `
                    : `
                  <div class="border-t border-border/50 pt-1 text-[11px] text-amber-600 dark:text-amber-400">
                    ${t("chart.tooltip_striped_hint")}
                  </div>
                `
                }
              </div>
            `;
          }

          // 2. Tooltip for company node inside Other / Uncategorized Donors
          if (data.isUncategorizedCompany && data.donorName) {
            const shareOfParty =
              data.totalPartyDonations > 0
                ? (data.activeValue / data.totalPartyDonations) * 100
                : 0;
            const shareOfUncategorized =
              data.sectorTotal && data.sectorTotal > 0
                ? (data.activeValue / data.sectorTotal) * 100
                : 0;

            return `
              <div class="space-y-1.5 p-0.5 text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="inline-block size-2.5 rounded-full shrink-0 ${
                    isDark ? "bg-zinc-500" : "bg-zinc-400"
                  }"></span>
                  <span class="font-bold text-sm text-foreground">${data.donorName}</span>
                </div>
                <div class="text-xs text-muted-foreground">
                  ${t("chart.uncategorized_donor")}
                </div>
                <div class="text-xs font-semibold text-foreground">
                  ${formatCountryCurrency(locale, data.activeValue, country)}
                </div>
                <div class="border-t border-border/50 pt-1 space-y-1 text-muted-foreground">
                  <div class="flex justify-between gap-4">
                    <span>${t("chart.tooltip_share_uncategorized")}</span>
                    <span class="font-medium text-foreground">${shareOfUncategorized.toFixed(1)}%</span>
                  </div>
                  <div class="flex justify-between gap-4">
                    <span>${party ? t("chart.tooltip_share_party") : t("chart.tooltip_share_total")}</span>
                    <span class="font-medium text-foreground">${shareOfParty.toFixed(1)}%</span>
                  </div>
                  <div class="flex justify-between gap-4">
                    <span>${t("chart.tooltip_donations")}</span>
                    <span class="font-medium text-foreground">${data.donationCount ?? 1}</span>
                  </div>
                </div>
                <div class="border-t border-border/50 pt-1 text-[11px] text-muted-foreground">
                  ${t("chart.uncategorized_hint")}
                </div>
              </div>
            `;
          }

          // 3. Tooltip for parent Uncategorized container node
          if (data.isUncategorized) {
            const share =
              data.totalPartyDonations > 0
                ? (data.activeValue / data.totalPartyDonations) * 100
                : 0;

            return `
              <div class="space-y-1.5 p-0.5 text-xs">
                <div class="font-bold text-sm text-foreground">${t("chart.uncategorized")}</div>
                <div class="text-xs font-semibold text-foreground">
                  ${t("chart.tooltip_share_total_pct", {
                    amount: formatCountryCurrency(
                      locale,
                      data.activeValue,
                      country,
                    ),
                    percent: share.toFixed(1),
                  })}
                </div>
                <div class="border-t border-border/50 pt-1 text-muted-foreground leading-snug">
                  ${t("chart.uncategorized_desc")}
                </div>
              </div>
            `;
          }

          // 4. Tooltip for parent Sector or Macro-Domain node
          if (data.tag !== undefined || data.macroDomain !== undefined) {
            const catColor =
              data.tag !== undefined
                ? interestColorFor(data.tag)
                : macroDomainColorFor(data.macroDomain!);
            const nodeTitle = data.tagLabel ?? data.macroDomainLabel ?? "";
            const share =
              data.totalPartyDonations > 0
                ? (data.activeValue / data.totalPartyDonations) * 100
                : 0;

            return `
              <div class="space-y-1.5 p-0.5 text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="inline-block size-2.5 rounded-full shrink-0" style="background-color: ${catColor};"></span>
                  <span class="font-bold text-sm text-foreground">${nodeTitle}</span>
                </div>
                ${
                  data.tag !== undefined && data.macroDomainLabel
                    ? `<div class="text-[11px] text-muted-foreground">${data.macroDomainLabel}</div>`
                    : ""
                }
                ${
                  data.description
                    ? `<div class="text-xs text-muted-foreground italic">${data.description}</div>`
                    : ""
                }
                <div class="text-xs font-semibold text-foreground">
                  ${t("chart.tooltip_share_total_pct", {
                    amount: formatCountryCurrency(
                      locale,
                      data.activeValue,
                      country,
                    ),
                    percent: share.toFixed(1),
                  })}
                </div>
                <div class="border-t border-border/50 pt-1 space-y-1 text-muted-foreground">
                  <div class="flex justify-between gap-4">
                    <span>${t("chart.tooltip_direct_businesses")}</span>
                    <span class="font-medium text-foreground">${formatCountryCurrency(locale, data.coreAmount ?? 0, country)}</span>
                  </div>
                  ${
                    viewMode === "exposure"
                      ? `
                    <div class="flex justify-between gap-4">
                      <span>${t("chart.tooltip_multisector_bodies")}</span>
                      <span class="font-medium text-foreground">${formatCountryCurrency(locale, data.partialAmount ?? 0, country)}</span>
                    </div>
                  `
                      : ""
                  }
                  <div class="flex justify-between gap-4">
                    <span>${t("chart.tooltip_donors")}</span>
                    <span class="font-medium text-foreground">${data.uniqueDonorsCount ?? 0}</span>
                  </div>
                </div>
              </div>
            `;
          }

          return "";
        },
      },
      series: [
        {
          name: "Party Donations",
          type: "treemap",
          roam: !isMobile,
          nodeClick: "zoomToNode",
          visibleMin: 300,
          top: 12,
          bottom: 12,
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
          },
          itemStyle: {
            gapWidth: 2,
            borderColor: "transparent",
          },
          data: treemapData,
        } satisfies TreemapSeriesOption,
      ],
    };
  }, [
    isDark,
    isMobile,
    backgroundColor,
    locale,
    country,
    viewMode,
    treemapData,
    t,
  ]);

  const title = partyDisplayName
    ? t("chart.title", { party: partyDisplayName })
    : t("chart.title_years", { country: countryName, years: yearsLabel });
  const subtitle = isGrouped
    ? viewMode === "exposure"
      ? t("chart.subtitle_grouped_exposure")
      : t("chart.subtitle_grouped_core")
    : viewMode === "exposure"
      ? t("chart.subtitle_flat_exposure")
      : t("chart.subtitle_flat_core");

  const countryYears = country.years;
  const years = useMemo(() => {
    const yearsSet = new Set<string>();
    for (const d of donations) {
      yearsSet.add(donationYear(d));
    }
    return yearsSet.size > 0
      ? Array.from(yearsSet)
      : (propYears ?? countryYears);
  }, [donations, propYears, countryYears]);

  return (
    <ChartCard.Provider years={years} title={title}>
      <ChartCard.Frame>
        <ChartCard.Header title={title} subtitle={subtitle}>
          <ChartCard.ResetZoomTool />
          <ChartCard.ExpandTool />
        </ChartCard.Header>
        <TreemapPatternLegend />
        <ChartCard.Canvas
          height={480}
          heightMode="fixed"
          feature="treemap"
          option={option}
          onClick={(params) => {
            if (params.componentType !== "series") return;
            if (params.componentSubType !== "treemap") return;

            const data = params.data as CustomTreemapNodeExtra | undefined;
            if (
              !data?.donorName ||
              (!data.isCompany && !data.isUncategorizedCompany)
            ) {
              return;
            }

            void clientSha1(data.donorName).then((donorId) => {
              router.push(`/${routeLocale}/${country.id}/donor/${donorId}`);
            });
          }}
        />
        <ChartCard.Footer extraNote={t("chart.footer_note")} />
      </ChartCard.Frame>
    </ChartCard.Provider>
  );
};

const TreemapPatternLegend = () => {
  const {
    state: { viewMode },
  } = useInterestsContext();
  const t = useTranslations("party.interests");

  return (
    <div className="text-muted-foreground flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1.5 px-4 pb-2 text-xs select-none">
      <div className="flex items-center gap-1.5">
        <span
          className="size-3 shrink-0 rounded-xs border border-neutral-400 bg-neutral-700 dark:border-neutral-500 dark:bg-neutral-300"
          aria-hidden="true"
        />
        <span className="text-foreground font-semibold">
          {t("chart.legend_solid_label")}
        </span>
        <span>{t("chart.legend_solid_text")}</span>
      </div>
      {viewMode === "exposure" && (
        <div className="flex items-center gap-1.5">
          <span
            className="size-3 shrink-0 rounded-xs border border-neutral-400 dark:border-neutral-500"
            style={{
              background:
                "repeating-linear-gradient(45deg, #71717a, #71717a 2px, transparent 2px, transparent 4px)",
            }}
            aria-hidden="true"
          />
          <span className="text-foreground font-semibold">
            {t("chart.legend_striped_label")}
          </span>
          <span>{t("chart.legend_striped_text")}</span>
        </div>
      )}
    </div>
  );
};

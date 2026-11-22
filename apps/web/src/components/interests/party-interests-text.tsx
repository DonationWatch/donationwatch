"use client";

import type {
  PolicyMacroDomain,
  TagExposureStats,
} from "@donationwatch/core/types/interests";
import type { ReactNode } from "react";

import { POLICY_MACRO_DOMAIN_SLUGS } from "@donationwatch/core/types/interests";
import { PartyField } from "@donationwatch/core/types/party";
import { getCountryName } from "@donationwatch/core/utils/countries";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatYearsRange,
} from "@donationwatch/core/utils/formatter";
import {
  interestColorFor,
  macroDomainColorFor,
} from "@donationwatch/core/utils/interests/interest-colors";
import { getPartyFullAndShortName } from "@donationwatch/core/utils/party";
import { Switch } from "@donationwatch/ui/components/switch";
import { ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import {
  CurrencyRankingItem,
  RankBadge,
} from "@/components/donations/ranking-item";
import { PercentageHint } from "@/components/percentage-hint";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

import { useInterestsContext } from "./interests-context";

export const PartyInterestsText = ({ chart }: { chart?: ReactNode }) => {
  const {
    state: {
      totalPartyDonations,
      totalTrackedExposure,
      sortedTags,
      sortedMacroDomains,
      viewMode,
      isGrouped,
    },
    actions: { setViewMode: onViewModeChange, setIsGrouped: onGroupedChange },
    meta: { scope },
  } = useInterestsContext();
  const [expandedDomains, setExpandedDomains] = useState<PolicyMacroDomain[]>(
    [],
  );
  const [showAllFlat, setShowAllFlat] = useState(false);
  const country = useRequiredCountryConfig();
  const locale = useBrowserBasedLocale();
  const routeLocale = useLocale();
  const t = useTranslations("party.interests");
  const tInterests = useTranslations("interests");
  const tCountries = useTranslations("countries");

  const countryName = getCountryName(country, tCountries);
  const party = scope.kind === "party" ? scope.party : undefined;
  const partyDisplayName = party ? getPartyFullAndShortName(party) : undefined;
  const yearsLabel =
    scope.kind === "years"
      ? formatYearsRange(scope.years)
      : formatYearsRange(country.years);
  const exposureRatio =
    totalPartyDonations > 0 ? totalTrackedExposure / totalPartyDonations : 0;

  const formatPercent = (ratio: number) => {
    return `${(ratio * 100).toFixed(ratio < 0.01 && ratio > 0 ? 2 : 1)}%`;
  };

  const activeMacroDomains = sortedMacroDomains.filter((d) => {
    const amount =
      viewMode === "exposure" ? d.totalExposureAmount : d.coreAmount;
    const share =
      viewMode === "exposure"
        ? d.shareOfTotalPartyDonations
        : d.coreShareOfTotalPartyDonations;
    return amount > 0 && Math.round(share * 100) > 0;
  });

  const tagsByDomain = new Map<PolicyMacroDomain, TagExposureStats[]>();
  for (const tag of sortedTags) {
    const amount =
      viewMode === "exposure" ? tag.totalExposureAmount : tag.coreAmount;
    if (amount <= 0) continue;
    const list = tagsByDomain.get(tag.macroDomain) ?? [];
    list.push(tag);
    tagsByDomain.set(tag.macroDomain, list);
  }

  // Flat list of non-zero active sectors with >= 1% displayable share
  const activeTags = sortedTags.filter((t) => {
    const amount =
      viewMode === "exposure" ? t.totalExposureAmount : t.coreAmount;
    const share =
      viewMode === "exposure"
        ? t.shareOfTotalPartyDonations
        : t.coreShareOfTotalPartyDonations;
    return amount > 0 && Math.round(share * 100) > 0;
  });

  const displayedFlatTags =
    showAllFlat || activeTags.length <= 10
      ? activeTags
      : activeTags.slice(0, 10);

  const topFiveFormatted = activeTags.slice(0, 5).map((stat) => {
    const amount =
      viewMode === "exposure" ? stat.totalExposureAmount : stat.coreAmount;
    const share =
      viewMode === "exposure"
        ? stat.shareOfTotalPartyDonations
        : stat.coreShareOfTotalPartyDonations;
    const label = tInterests(
      `tags.${stat.slug}.label` as Parameters<typeof tInterests>[0],
    );
    return `${label} (${formatCompactCountryCurrency(locale, amount, country)}, ${formatPercent(share)})`;
  });

  const modeKey = viewMode === "exposure" ? "exposure" : "core";
  const topIndustriesSentence =
    topFiveFormatted.length === 1
      ? t(`summary.top_${modeKey}_one`, { item: topFiveFormatted[0] })
      : topFiveFormatted.length > 1
        ? t(`summary.top_${modeKey}_many`, {
            items: new Intl.ListFormat(routeLocale, {
              style: "long",
              type: "conjunction",
            }).format(topFiveFormatted),
          })
        : null;

  const toggleDomain = (domain: PolicyMacroDomain, expanded: boolean) => {
    setExpandedDomains((prev) =>
      expanded ? [...prev, domain] : prev.filter((d) => d !== domain),
    );
  };

  return (
    <div className="min-w-0 space-y-4">
      {/* SEO-friendly narrative introduction */}
      <p>
        {partyDisplayName
          ? t("intro", {
              country: countryName,
              party: partyDisplayName,
            })
          : t("intro_years", {
              country: countryName,
              years: yearsLabel,
            })}
      </p>

      {/* Explainer on Direct vs. Multi-Sector Attribution */}
      <details className="group cursor-pointer">
        <summary className="flex list-none items-center gap-1.5 text-sm font-semibold select-none">
          <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-90" />
          <span>{t("explainer.summary")}</span>
        </summary>
        <div className="mt-2 space-y-2.5 text-sm leading-relaxed">
          <p>
            <strong>{t("explainer.direct_label")}</strong>{" "}
            {t("explainer.direct_text")}
          </p>
          <p>
            <strong>{t("explainer.multisector_label")}</strong>{" "}
            {t("explainer.multisector_text")}
          </p>
          <p>
            <strong>{t("explainer.domains_label")}</strong>{" "}
            {t("explainer.domains_text")}
          </p>
        </div>
      </details>

      {/* Display Switches */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <Switch
            id="direct-businesses-only"
            aria-labelledby="direct-businesses-only-label"
            checked={viewMode === "core"}
            onCheckedChange={(checked) => {
              setShowAllFlat(false);
              onViewModeChange(checked ? "core" : "exposure");
            }}
            className="cursor-pointer"
          />
          <label
            id="direct-businesses-only-label"
            htmlFor="direct-businesses-only"
            className="cursor-pointer text-sm font-medium select-none"
          >
            {t("switches.direct_only")}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="group-by-domain"
            aria-labelledby="group-by-domain-label"
            checked={isGrouped}
            onCheckedChange={onGroupedChange}
            className="cursor-pointer"
          />
          <label
            id="group-by-domain-label"
            htmlFor="group-by-domain"
            className="cursor-pointer text-sm font-medium select-none"
          >
            {t("switches.group_by_domain")}
          </label>
        </div>
      </div>

      <p>
        {partyDisplayName
          ? t(viewMode === "exposure" ? "summary.exposure" : "summary.core", {
              total: formatCountryCurrency(
                locale,
                totalPartyDonations,
                country,
              ),
              party: partyDisplayName,
              tracked: formatCountryCurrency(
                locale,
                totalTrackedExposure,
                country,
              ),
              percent: formatPercent(exposureRatio),
            })
          : t(
              viewMode === "exposure"
                ? "summary.exposure_years"
                : "summary.core_years",
              {
                total: formatCountryCurrency(
                  locale,
                  totalPartyDonations,
                  country,
                ),
                years: yearsLabel,
                tracked: formatCountryCurrency(
                  locale,
                  totalTrackedExposure,
                  country,
                ),
                percent: formatPercent(exposureRatio),
              },
            )}
        {topIndustriesSentence ? ` ${topIndustriesSentence}` : ""}
      </p>

      {chart ? <div>{chart}</div> : null}

      {isGrouped ? (
        /* Expandable 2-level list using CurrencyRankingItem */
        <ul className="space-y-1 py-1">
          {activeMacroDomains.map((domainStat, idx) => {
            const domainAmount =
              viewMode === "exposure"
                ? domainStat.totalExposureAmount
                : domainStat.coreAmount;
            const childTags = tagsByDomain.get(domainStat.domain) ?? [];
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

            return (
              <li key={domainStat.domain}>
                <CurrencyRankingItem
                  id={`domain-${domainStat.domain}`}
                  rank={idx + 1}
                  amount={domainAmount}
                  sum={totalPartyDonations}
                  country={country}
                  expanded={expandedDomains.includes(domainStat.domain)}
                  onToggleExpanded={(expanded) =>
                    toggleDomain(domainStat.domain, expanded)
                  }
                  detail={
                    childTags.length > 0 ? (
                      <ul className="space-y-1">
                        {childTags.map((tagStat) => {
                          const tagAmount =
                            viewMode === "exposure"
                              ? tagStat.totalExposureAmount
                              : tagStat.coreAmount;
                          const tagShare =
                            viewMode === "exposure"
                              ? tagStat.shareOfTotalPartyDonations
                              : tagStat.coreShareOfTotalPartyDonations;
                          const tagLabel = tInterests(
                            `tags.${tagStat.slug}.label` as Parameters<
                              typeof tInterests
                            >[0],
                          );
                          const tagDesc = tInterests(
                            `tags.${tagStat.slug}.description` as Parameters<
                              typeof tInterests
                            >[0],
                          );

                          return (
                            <li
                              key={tagStat.tag}
                              title={`${tagLabel}: ${tagDesc}`}
                              className="flex w-full min-w-0 items-center justify-between px-1.5 py-1"
                            >
                              <div className="flex min-w-0 items-center overflow-x-hidden">
                                <span
                                  className="mr-2 size-2 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: interestColorFor(
                                      tagStat.tag,
                                    ),
                                  }}
                                  aria-hidden="true"
                                />
                                <span className="truncate">{tagLabel}</span>
                              </div>
                              <div className="ml-2 flex shrink-0 tabular-nums">
                                <span className="lg:mr-1">
                                  {formatCountryCurrency(
                                    locale,
                                    tagAmount,
                                    country,
                                  )}
                                </span>
                                <PercentageHint
                                  browserBasedLocale={locale}
                                  percentage={tagShare}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null
                  }
                >
                  <div
                    title={`${domainLabel}: ${domainDesc}`}
                    className="flex min-w-0 items-center overflow-x-hidden"
                  >
                    <span
                      className="mr-2 size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: macroDomainColorFor(domainStat.domain),
                      }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{domainLabel}</span>
                  </div>
                </CurrencyRankingItem>
              </li>
            );
          })}
        </ul>
      ) : (
        /* Flat ranked list of specific industries */
        <>
          <ul className="space-y-1 py-1">
            {displayedFlatTags.map((stat, idx) => {
              const activeAmount =
                viewMode === "exposure"
                  ? stat.totalExposureAmount
                  : stat.coreAmount;
              const activeShare =
                viewMode === "exposure"
                  ? stat.shareOfTotalPartyDonations
                  : stat.coreShareOfTotalPartyDonations;
              const catColor = interestColorFor(stat.tag);
              const tagLabel = tInterests(
                `tags.${stat.slug}.label` as Parameters<typeof tInterests>[0],
              );
              const tagDesc = tInterests(
                `tags.${stat.slug}.description` as Parameters<
                  typeof tInterests
                >[0],
              );
              const domainLabel = tInterests(
                `domains.${POLICY_MACRO_DOMAIN_SLUGS[stat.macroDomain]}.label` as Parameters<
                  typeof tInterests
                >[0],
              );

              return (
                <li
                  key={stat.tag}
                  title={`${domainLabel} / ${tagLabel}: ${tagDesc}`}
                  className="flex w-full items-center justify-between rounded px-1.5 py-1 text-left text-sm font-semibold"
                >
                  <div className="flex min-w-0 grow items-center overflow-x-hidden">
                    <RankBadge rank={idx + 1} />
                    <span
                      className="mr-2 size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: catColor }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{tagLabel}</span>
                  </div>
                  <div className="ml-2 flex shrink-0 tabular-nums">
                    <span className="lg:mr-1">
                      {formatCountryCurrency(locale, activeAmount, country)}
                    </span>
                    <PercentageHint
                      browserBasedLocale={locale}
                      percentage={activeShare}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {activeTags.length > 10 && (
            <div className="px-2">
              <button
                type="button"
                onClick={() => setShowAllFlat((prev) => !prev)}
                className="hover:text-foreground text-muted-foreground cursor-pointer text-sm font-medium hover:underline"
              >
                {showAllFlat
                  ? t("show_top")
                  : t("show_all", { count: activeTags.length })}
              </button>
            </div>
          )}
        </>
      )}

      {/* Methodological Note: in text-sm without artificial darkening */}
      <p className="pt-2 text-sm leading-relaxed">
        {t("note.prefix")}{" "}
        {t(viewMode === "exposure" ? "note.exposure" : "note.core")}{" "}
        {party
          ? t("note.share", { party: party[PartyField.Short] })
          : t("note.share_years", { years: yearsLabel })}{" "}
        <Link
          href={`/${routeLocale}/${country.id}/methodology#sec-policy-domains`}
          className="underline"
        >
          {t("note.methodology_link")}
        </Link>
        .
      </p>
    </div>
  );
};

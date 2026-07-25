"use client";

import { useLocale } from "next-intl";
import { useEffect, useMemo } from "react";

import type { Party } from "@/types/party";
import type { Country } from "@/utils/countries";
import type { PartySum } from "@/utils/data/get-parties-sum";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ReceiverId } from "@/utils/types";

import { DonationYearScatterPlot } from "@/components/charts/donation-year-scatter-plot";
import { DonationsPieChart } from "@/components/charts/donations-pie-chart";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import { FormatAnd } from "@/components/formatter";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { TextPartyLink } from "@/components/parties/text-party-link";
import {
  useParties,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { Translation } from "@/components/translation";
import { LoadedTopPartyDonations } from "@/components/years/top-party-year-donations";
import { useDonationsByYears } from "@/hooks/use-api";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { PartyField } from "@/types/party";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getPartiesByYears } from "@/utils/data/get-parties-by-years";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import {
  formatAnd,
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "@/utils/formatter";
import { DonationField } from "@/utils/types";

interface YearsOverviewClientPageProps {
  country: Country;
  years: string[];
  parties: Party[];
  partyYearSums: PartyYearsSums;
  sectionTitle: string;
  summary: string;
  scatterTitle: string;
  scatterSummary: string;
  scatterSubtitle: string;
}

export const YearsOverviewClientPage = ({
  years,
  parties: initialParties,
  partyYearSums,
  sectionTitle,
  summary,
  scatterTitle,
  scatterSummary,
  scatterSubtitle,
}: YearsOverviewClientPageProps) => {
  const countryConfig = useRequiredCountryConfig();
  const t = useTranslations();
  const tData = useTranslations("data");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const parties = useParties();

  const {
    isFiltered,
    filteredYears,
    filteredDonations,
    setDonations,
    activeFilters,
    controls,
  } = useFilterEngine();

  const activeYears = useMemo(() => {
    return isFiltered ? years.filter((y) => filteredYears.includes(y)) : years;
  }, [years, isFiltered, filteredYears]);

  const activeParties = useMemo(() => {
    return getPartiesByYears(activeYears, parties);
  }, [activeYears, parties]);

  const results = useDonationsByYears(countryConfig, years);
  const isLoading = results.some((r) => r.isLoading);
  const error = results.some((r) => r.error);
  const isSuccess = results.every((r) => r.isSuccess);

  useScrollToHash(isSuccess);

  const rawDonations = useMemo(() => {
    return results
      .flatMap((r) => r.data ?? [])
      .filter(isNotNullandNotUndefined);
  }, [results]);

  useEffect(() => {
    if (isSuccess && !error) {
      setDonations(rawDonations);
    }
  }, [isSuccess, error, rawDonations, setDonations]);

  const ssrStats = useMemo(() => {
    return getPartiesSum(
      countryConfig,
      partyYearSums,
      activeParties,
      activeYears,
    );
  }, [countryConfig, partyYearSums, activeParties, activeYears]);

  const { sum, sums, count } = useMemo(() => {
    if (filteredDonations && filteredDonations.length > 0) {
      const partyStatsMap: Record<ReceiverId, { sum: number; count: number }> =
        {};

      initialParties.forEach((party) => {
        const partyId = party[PartyField.Id];
        if (activeFilters.activePartyIds.has(partyId)) {
          partyStatsMap[partyId] = { sum: 0, count: 0 };
        }
      });

      let totalSum = 0;
      let totalCount = 0;

      for (let i = 0; i < filteredDonations.length; i++) {
        const d = filteredDonations[i];
        const partyId = d[DonationField.Receiver];
        const stats = partyStatsMap[partyId];
        if (stats) {
          const amount = d[DonationField.Amount];
          stats.sum += amount;
          stats.count += 1;
          totalSum += amount;
          totalCount += 1;
        }
      }

      const sortedSums = (Object.entries(partyStatsMap) as PartySum[]).toSorted(
        ([, dataA], [, dataB]) => dataB.sum - dataA.sum,
      );

      return {
        sum: totalSum,
        sums: sortedSums,
        count: totalCount,
      };
    }

    return {
      sum: ssrStats.sum,
      sums: ssrStats.sums,
      count: ssrStats.count,
    };
  }, [
    filteredDonations,
    ssrStats,
    initialParties,
    activeFilters.activePartyIds,
  ]);

  const mostDonations = useMemo(() => {
    let most: PartySum | undefined;
    sums.forEach((s) => {
      if (!most || most[1].count < s[1].count) most = s;
    });
    return most;
  }, [sums]);

  const topDonationSums = useMemo(() => {
    return sums.toSorted((a, b) => b[1].sum - a[1].sum).slice(0, 5);
  }, [sums]);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  if (isFiltered && filteredDonations.length === 0) {
    return <FilterEmptyState onReset={controls.resetFilters} />;
  }

  return (
    <>
      <ArticleSectionWrapper id={"sec-years-overview"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-overview"}
              title={sectionTitle}
            />
            <p className="mb-6">{summary}</p>
            <p className="mb-6">
              {t("overview.detail.summary2", {
                years: formatAnd(browserBasedLocale, activeYears),
                partyCount: sums.length,
                donationCount: count,
                minimumAmount: formatCompactCountryCurrency(
                  browserBasedLocale,
                  countryConfig.minPublicDonationAmount,
                  countryConfig,
                ),
                donationSum: formatCountryCurrency(
                  browserBasedLocale,
                  sum,
                  countryConfig,
                ),
              })}
            </p>
            {topDonationSums.length ? (
              <p className="mb-6">
                <Translation
                  t={t}
                  translationId={"overview.detail.highest_sum"}
                  variables={{
                    years: formatAnd(browserBasedLocale, activeYears),
                    parties: (
                      <FormatAnd
                        locale={locale}
                        items={topDonationSums.map(([receiverId, sum]) => (
                          <span key={receiverId}>
                            <TextPartyLink party={receiverId} locale={locale} />
                            (
                            {formatCountryCurrency(
                              browserBasedLocale,
                              sum.sum,
                              countryConfig,
                            )}
                            )
                          </span>
                        ))}
                      />
                    ),
                  }}
                />
              </p>
            ) : null}
            {mostDonations && (
              <p className="mb-6">
                <Translation
                  t={t}
                  translationId={"overview.detail.most_donations"}
                  variables={{
                    party: (
                      <TextPartyLink party={mostDonations[0]} locale={locale} />
                    ),
                    count: mostDonations[1].count,
                    sum: formatCountryCurrency(
                      browserBasedLocale,
                      mostDonations[1].sum,
                      countryConfig,
                    ),
                  }}
                />
              </p>
            )}
            <LoadedTopPartyDonations
              locale={locale}
              donations={filteredDonations}
              sums={sums}
              sum={sum}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationsPieChart
                years={activeYears}
                partyYearsSums={partyYearSums}
                sums={sums}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>

      {count > 0 ? (
        <ArticleSectionWrapper id={"sec-scatter"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h2"}
                id={"sec-scatter"}
                title={scatterTitle}
              />
              <p className="mb-6">{scatterSummary}</p>
              <DonationYearScatterPlot
                years={activeYears}
                parties={activeParties}
                title={scatterTitle}
                subtitle={scatterSubtitle}
                donations={filteredDonations}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
    </>
  );
};

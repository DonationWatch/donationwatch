"use client";

import { useEffect, useMemo } from "react";

import type { Party } from "@/types/party";

import { InfoAlert } from "@/components/alert";
import { DonationPerMonthChart } from "@/components/charts/donation-per-month-chart";
import { DonationSumChart } from "@/components/charts/donation-sum-chart";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { YearBarsPageText } from "@/components/loading/loading-year-bars-page-text";
import { YearTimelineYearText } from "@/components/loading/loading-year-timeline-year-text";
import { YearTimeseriesText } from "@/components/loading/loading-year-timeseries-text";
import {
  useParties,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getPartiesByYears } from "@/utils/data/get-parties-by-years";
import { Features, hasFeature } from "@/utils/features";

interface YearsTimelineClientPageProps {
  years: string[];
  parties: Party[];
  resolution: "month" | "year";
  timelineTitle: string;
  timelineSummary: string;
  sumChartTitle: string;
  sumChartSubtitle: string;
  perMonthTitle: string;
  perMonthDescription: string;
  perMonthSubtitle: string;
  yearResolutionNote: string;
}

export const YearsTimelineClientPage = ({
  years,
  resolution,
  timelineTitle,
  timelineSummary,
  sumChartTitle,
  sumChartSubtitle,
  perMonthTitle,
  perMonthDescription,
  perMonthSubtitle,
  yearResolutionNote,
}: YearsTimelineClientPageProps) => {
  const country = useRequiredCountryConfig();
  const tData = useTranslations("data");
  const parties = useParties();

  const {
    isFiltered,
    filteredYears,
    filteredDonations,
    setDonations,
    controls,
  } = useFilterEngine();

  const activeYears = useMemo(() => {
    return isFiltered ? years.filter((y) => filteredYears.includes(y)) : years;
  }, [years, isFiltered, filteredYears]);

  const activeParties = useMemo(() => {
    return getPartiesByYears(activeYears, parties);
  }, [activeYears, parties]);

  const results = useDonationsByYears(country, years);
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

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  if (isFiltered && filteredDonations.length === 0) {
    return <FilterEmptyState onReset={controls.resetFilters} />;
  }

  return (
    <>
      {resolution === "month" ? (
        <ArticleSectionWrapper id={"sec-timeline"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={timelineTitle}
              />
              <p className="mb-6">{timelineSummary}</p>
              <YearTimeseriesText
                parties={activeParties}
                years={activeYears}
                donations={filteredDonations}
              />
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <DonationSumChart
                title={sumChartTitle}
                subtitle={sumChartSubtitle}
                years={activeYears}
                parties={activeParties}
                donations={filteredDonations}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
      <ArticleSectionWrapper id={"sec-per-month"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-per-month"}
              title={perMonthTitle}
            />

            {resolution === "year" && hasFeature(country, Features.Date) && (
              <div className="mb-6">
                <InfoAlert text={yearResolutionNote} />
              </div>
            )}

            <p className="mb-6">{perMonthDescription}</p>
            {resolution === "month" ? (
              <YearBarsPageText
                parties={activeParties}
                years={activeYears}
                donations={filteredDonations}
              />
            ) : (
              <YearTimelineYearText
                parties={activeParties}
                years={activeYears}
                donations={filteredDonations}
              />
            )}
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationPerMonthChart
                title={perMonthTitle}
                subtitle={perMonthSubtitle}
                resolution={resolution}
                years={activeYears}
                parties={activeParties}
                donations={filteredDonations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
    </>
  );
};

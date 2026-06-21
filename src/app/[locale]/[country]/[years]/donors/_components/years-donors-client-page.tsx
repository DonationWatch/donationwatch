"use client";

import { useMemo, useEffect } from "react";

import type { CountryConfig } from "@/types/country-config";

import { DonationYearsTreemap } from "@/components/charts/loading-donation-years-treemap";
import { DonorReceiverHistogram } from "@/components/charts/loading-donor-receiver-histogram";
import { DonorYearOverview } from "@/components/donors/donor-year-overview";
import { YearsDonorHistogramText } from "@/components/donors/years-donor-histogram-text";
import { YearsDonorPageText } from "@/components/donors/years-donor-page-text";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getParties } from "@/utils/data/get-parties";

interface YearsDonorsClientPageProps {
  country: CountryConfig;
  years: string[];
  treemapTitle: string;
  treemapSubtitle: string;
  histogramTitle: string;
  histogramSubtitle: string;
  sectionTitle: string;
  histogramSectionTitle: string;
  summary: string;
  summary2: string;
  histogramP0: string;
  listTitle: string;
  listP0: string;
}

export const YearsDonorsClientPage = ({
  country,
  years,
  treemapTitle,
  treemapSubtitle,
  histogramTitle,
  histogramSubtitle,
  sectionTitle,
  histogramSectionTitle,
  summary,
  summary2,
  histogramP0,
  listTitle,
  listP0,
}: YearsDonorsClientPageProps) => {
  const tData = useTranslations("data");

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
    return getParties(country, activeYears);
  }, [country, activeYears]);

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
      <ArticleSectionWrapper id={"sec-years-donors"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-donors"}
              title={sectionTitle}
            />
            <p className="mb-6">{summary}</p>
            <p className="mb-6">{summary2}</p>
            <YearsDonorPageText
              country={country}
              years={activeYears}
              parties={activeParties}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationYearsTreemap
                country={country}
                years={activeYears}
                parties={activeParties}
                title={treemapTitle}
                subtitle={treemapSubtitle}
                donations={filteredDonations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
      <ArticleSectionWrapper id={"sec-histogram"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-histogram"}
              title={histogramSectionTitle}
            />
            <p className="mb-6">{histogramP0}</p>
            <YearsDonorHistogramText
              country={country}
              years={activeYears}
              parties={activeParties}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonorReceiverHistogram
                country={country}
                years={activeYears}
                parties={activeParties}
                title={histogramTitle}
                subtitle={histogramSubtitle}
                donations={filteredDonations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
      <ArticleSectionWrapper id={"sec-donor-list"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-donor-list"}
              title={listTitle}
            />
            <p className="mb-6">{listP0}</p>
            <DonorYearOverview
              country={country}
              years={activeYears}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </>
  );
};

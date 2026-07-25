"use client";

import { useMemo, useEffect } from "react";

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
import {
  useParties,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import {
  hasPendingFilterDonationSync,
  useFilterEngine,
} from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getPartiesByYears } from "@/utils/data/get-parties-by-years";

interface YearsDonorsClientPageProps {
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
  const country = useRequiredCountryConfig();
  const parties = useParties();
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

  const isSyncing = hasPendingFilterDonationSync({
    dataDonations: isSuccess ? rawDonations : undefined,
    filterDonations: filteredDonations,
    isFiltered,
  });

  if (isLoading || isSyncing) return <Loading />;
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
              years={activeYears}
              parties={activeParties}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationYearsTreemap
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
              years={activeYears}
              parties={activeParties}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonorReceiverHistogram
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
              years={activeYears}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </>
  );
};

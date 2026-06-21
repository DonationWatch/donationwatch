"use client";

import { useEffect, useMemo } from "react";

import type { CountryConfig } from "@/types/country-config";

import { YearDonationHistory } from "@/components/donations/party-donation-history";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import {
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";

interface YearsChangesClientPageProps {
  country: CountryConfig;
  years: string[];
  title: string;
  summary: string;
}

export const YearsChangesClientPage = ({
  country,
  years,
  title,
  summary,
}: YearsChangesClientPageProps) => {
  const tData = useTranslations("data");

  const results = useDonationsByYears(country, years);
  const isLoading = results.some((r) => r.isLoading);
  const error = results.some((r) => r.error);
  const isSuccess = results.every((r) => r.isSuccess);

  const {
    isFiltered,
    filteredYears,
    filteredDonations,
    setDonations,
    controls,
  } = useFilterEngine();

  useEffect(() => {
    if (isSuccess && !error) {
      const allData = results
        .flatMap((r) => r.data)
        .filter(isNotNullandNotUndefined);
      setDonations(allData);
    }
  }, [isSuccess, error, results, setDonations]);

  const activeYears = useMemo(() => {
    return isFiltered ? years.filter((y) => filteredYears.includes(y)) : years;
  }, [years, isFiltered, filteredYears]);

  useScrollToHash(isSuccess);

  return (
    <ArticleSectionWrapper id={"sec-years-changes"}>
      <ArticleSectionTitle as={"h1"} id={"sec-years-changes"} title={title} />
      <p className="mb-6">{summary}</p>
      {isLoading ? (
        <Loading heightClass="h-[80vh]" />
      ) : error ? (
        <div>{tData("error")}</div>
      ) : isFiltered && filteredDonations.length === 0 ? (
        <FilterEmptyState onReset={controls.resetFilters} />
      ) : (
        <YearDonationHistory
          years={activeYears}
          country={country}
          donations={filteredDonations}
        />
      )}
    </ArticleSectionWrapper>
  );
};

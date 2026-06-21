"use client";

import { useMemo, useEffect } from "react";

import type { CountryConfig } from "@/types/country-config";

import { DonationYearOrigin } from "@/components/donations/donation-origin";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getParties } from "@/utils/data/get-parties";

interface YearsOriginClientPageProps {
  country: CountryConfig;
  years: string[];
}

export const YearsOriginClientPage = ({
  country,
  years,
}: YearsOriginClientPageProps) => {
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
    <DonationYearOrigin
      country={country}
      parties={activeParties}
      years={activeYears}
      donations={filteredDonations}
    />
  );
};

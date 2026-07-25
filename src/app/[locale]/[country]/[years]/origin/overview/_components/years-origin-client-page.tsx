"use client";

import { useMemo, useEffect } from "react";

import { DonationYearOrigin } from "@/components/donations/donation-origin";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import Loading from "@/components/loading/loading";
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

interface YearsOriginClientPageProps {
  years: string[];
}

export const YearsOriginClientPage = ({
  years,
}: YearsOriginClientPageProps) => {
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
    <DonationYearOrigin
      parties={activeParties}
      years={activeYears}
      donations={filteredDonations}
    />
  );
};

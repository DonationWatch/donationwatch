"use client";
import { notFound } from "next/navigation";
import { useEffect } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";

import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import { Article } from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByDonorId } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { donationYear } from "@/utils/date";
import { Features, hasFeature } from "@/utils/features";
import { DonationField } from "@/utils/types";

import { DonorClientPageContent } from "./_components/donor-client-page-content";
import { DonorDonationTable } from "./_components/donor-donation-table";
import { DonorDonationTimeline } from "./_components/donor-donation-timeline";
import { DonorDonationTypes } from "./_components/donor-donation-types";

export const DonorClientPage = ({
  donorId,
  countryConfig,
}: {
  donorId: string;
  countryConfig: CountryConfig;
  country: Country;
}) => {
  const t = useTranslations("data");
  const {
    isFiltered,
    setYearStats,
    setAvailableRange,
    filteredDonations,
    setDonations,
    controls,
  } = useFilterEngine();
  const { data, isLoading, error, isSuccess } = useDonationsByDonorId(
    countryConfig,
    donorId,
  );

  useScrollToHash(isSuccess);

  // Compute year stats exactly once when data loads
  useEffect(() => {
    if (!data || !data.length) return;

    const sums: Record<number, number> = {};
    data.forEach((d) => {
      const y = parseInt(donationYear(d), 10);
      sums[y] = (sums[y] || 0) + d[DonationField.Amount];
    });

    const activeYears = Object.keys(sums)
      .map((y) => parseInt(y, 10))
      .toSorted((a, b) => a - b);
    if (activeYears.length > 0) {
      setAvailableRange([activeYears[0], activeYears[activeYears.length - 1]]);
    } else {
      setAvailableRange(null);
    }

    setYearStats(sums);
    return () => {
      setYearStats(null);
      setAvailableRange(null);
    };
  }, [data, setYearStats, setAvailableRange]);

  useEffect(() => {
    if (isSuccess && !error) {
      setDonations(data ?? []);
    }
  }, [isSuccess, error, data, setDonations]);

  if (!filteredDonations || filteredDonations.length === 0) {
    if (isFiltered) {
      return (
        <Article fullWidth={true}>
          <FilterEmptyState onReset={controls.resetFilters} />
        </Article>
      );
    }
    if (!isLoading && data && data.length > 0) {
      return (
        <Article fullWidth={true}>
          <div className="flex h-screen items-center justify-center">
            <Loading />
          </div>
        </Article>
      );
    }
  }

  return (
    <Article fullWidth={true}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      ) : error || !data || !data.length ? (
        error || !data ? (
          t("error")
        ) : (
          notFound()
        )
      ) : (
        <>
          <DonorClientPageContent
            donorId={donorId}
            countryConfig={countryConfig}
            donations={filteredDonations}
          />
          <DonorDonationTimeline
            donorId={donorId}
            countryConfig={countryConfig}
            donations={filteredDonations}
          />
          {hasFeature(countryConfig, Features.DonationType) ? (
            <DonorDonationTypes
              countryConfig={countryConfig}
              donations={filteredDonations}
            />
          ) : null}
          <DonorDonationTable
            countryConfig={countryConfig}
            donations={filteredDonations}
          />
        </>
      )}
    </Article>
  );
};

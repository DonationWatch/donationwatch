"use client";

import { useEffect, useMemo } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { DonationPartyOrigin } from "@/components/donations/donation-origin";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import Loading from "@/components/loading/loading";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

interface PartyOriginClientPageProps {
  country: CountryConfig;
  party: Party;
  years: string[];
}

export const PartyOriginClientPage = ({
  country,
  party,
  years,
}: PartyOriginClientPageProps) => {
  const tData = useTranslations("data");
  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

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

  useEffect(() => {
    if (isSuccess && !error) {
      setDonations(data ?? []);
    }
  }, [isSuccess, error, data, setDonations]);

  useScrollToHash(isSuccess);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{tData("error")}</div>;

  if (isFiltered && filteredDonations.length === 0) {
    return <FilterEmptyState onReset={controls.resetFilters} />;
  }

  return (
    <DonationPartyOrigin
      country={country}
      party={party}
      years={activeYears}
      donations={filteredDonations.flat()}
    />
  );
};

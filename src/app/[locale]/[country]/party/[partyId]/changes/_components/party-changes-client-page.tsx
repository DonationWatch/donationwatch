"use client";

import { useEffect } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { PartyDonationHistory } from "@/components/donations/party-donation-history";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import {
  hasPendingFilterDonationSync,
  useFilterEngine,
} from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

interface PartyChangesClientPageProps {
  country: CountryConfig;
  party: Party;
  title: string;
  summary: string;
}

export const PartyChangesClientPage = ({
  country,
  party,
  title,
  summary,
}: PartyChangesClientPageProps) => {
  const tData = useTranslations("data");
  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

  const { isFiltered, filteredDonations, setDonations, controls } =
    useFilterEngine();

  const isSyncing = hasPendingFilterDonationSync({
    dataDonations: isSuccess ? data : undefined,
    filterDonations: filteredDonations,
    isFiltered,
  });

  useEffect(() => {
    if (isSuccess && !error) {
      setDonations(data ?? []);
    }
  }, [isSuccess, error, data, setDonations]);

  useScrollToHash(isSuccess);

  return (
    <ArticleSectionWrapper id={"sec-party-changes"}>
      <ArticleSectionOneColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            as={"h1"}
            id={"sec-party-changes"}
            title={title}
          />
          <p className="mb-6">{summary}</p>
          {isLoading || isSyncing ? (
            <Loading heightClass="h-[80vh]" />
          ) : error || !data ? (
            <div>{tData("error")}</div>
          ) : isFiltered && filteredDonations.length === 0 ? (
            <FilterEmptyState onReset={controls.resetFilters} />
          ) : (
            <PartyDonationHistory
              country={country}
              party={party}
              donations={filteredDonations}
            />
          )}
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};

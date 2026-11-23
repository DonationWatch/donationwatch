"use client";

import type { DonorInterestMap } from "@donationwatch/core/types/interests";
import type { Party } from "@donationwatch/core/types/party";
import type { PartyDonorStats } from "@donationwatch/data/queries/get-party-donor-stats";

import { PartyField } from "@donationwatch/core/types/party";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
import { useEffect } from "react";

import { LoadingChartCard } from "@/components/charts/expandable-react-echart";
import { LoadingPartyDonationTypeTreemap } from "@/components/charts/loading-donation-types-treemap";
import { LoadingDonationPartyTreemap } from "@/components/charts/loading-donation-years-treemap";
import { LoadingPartyDonorTypeTreemap } from "@/components/charts/loading-donor-types-treemap";
import { DonorOverviewList } from "@/components/donors/donor-overview-list";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import { PartyInterestsSection } from "@/components/interests/party-interests-section";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { LoadingPartyDonorTypeText } from "@/components/parties/part-donor-type-text";
import { LoadingPartyDonationTypeText } from "@/components/parties/party-donation-type-text";
import { PartyDonorPageText } from "@/components/parties/party-donor-page-text";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import {
  hasPendingFilterDonationSync,
  useFilterEngine,
} from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

import { usePartyViaSummary } from "./original-receivers/use-party-via-summary";
import { PartyOriginalReceivers } from "./party-original-receivers";

interface PartyDonorsClientPageProps {
  party: Party;
  ssrStats?: PartyDonorStats | null;
  donorInterests?: DonorInterestMap;
  treemapTitle: string;
  treemapSubtitle: string;
  donorTypesTitle: string;
  donorTypesTreemapTitle: string;
  donorTypesTreemapSubtitle: string;
  donationTypesTitle: string;
  donationTypesTreemapTitle: string;
  donationTypesTreemapSubtitle: string;
  listTitle: string;
  listP0: string;
}

export const PartyDonorsClientPage = ({
  party,
  ssrStats,
  donorInterests,
  treemapTitle,
  treemapSubtitle,
  donorTypesTitle,
  donorTypesTreemapTitle,
  donorTypesTreemapSubtitle,
  donationTypesTitle,
  donationTypesTreemapTitle,
  donationTypesTreemapSubtitle,
  listTitle,
  listP0,
}: PartyDonorsClientPageProps) => {
  const country = useRequiredCountryConfig();
  const tData = useTranslations("data");
  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

  const {
    state: { isFiltered, filteredDonations },
    actions: { setDonations, ...controls },
  } = useFilterEngine();

  const viaSummary = usePartyViaSummary(party, filteredDonations);

  useEffect(() => {
    if (isSuccess && !error) {
      setDonations(data ?? []);
    }
  }, [isSuccess, error, data, setDonations]);

  const isSyncing = hasPendingFilterDonationSync({
    dataDonations: isSuccess ? data : undefined,
    filterDonations: filteredDonations,
    isFiltered,
  });

  useScrollToHash(isSuccess);

  const isPendingClientDonations = isLoading || isSyncing;

  if (!ssrStats && isPendingClientDonations) {
    return <Loading heightClass="h-[80vh]" />;
  }

  if (!isPendingClientDonations && (error || !data)) {
    return <div>{tData("error")}</div>;
  }

  if (
    !isPendingClientDonations &&
    isFiltered &&
    filteredDonations.length === 0
  ) {
    return <FilterEmptyState onReset={controls.resetFilters} />;
  }

  return (
    <>
      <ArticleSectionWrapper id={"sec-party-donors"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <PartyDonorPageText
              party={party}
              donations={filteredDonations}
              ssrStats={ssrStats}
              chart={
                isPendingClientDonations ? (
                  <LoadingChartCard
                    height={600}
                    title={treemapTitle}
                    subtitle={treemapSubtitle}
                    feature="treemap"
                  />
                ) : (
                  <LoadingDonationPartyTreemap
                    party={party}
                    tooSmallAreaColor={party[PartyField.Color]}
                    title={treemapTitle}
                    subtitle={treemapSubtitle}
                    donations={filteredDonations}
                  />
                )
              }
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>

      {hasFeature(country, Features.DonorType) ? (
        <ArticleSectionWrapper id={"sec-party-donor-types"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                id={"sec-party-donor-types"}
                title={donorTypesTitle}
              />
              <LoadingPartyDonorTypeText
                party={party}
                donations={filteredDonations}
                ssrDonorTypes={ssrStats?.donorTypes}
                chart={
                  isPendingClientDonations ? (
                    <LoadingChartCard
                      height={600}
                      title={donorTypesTreemapTitle}
                      subtitle={donorTypesTreemapSubtitle}
                      feature="treemap"
                    />
                  ) : (
                    <LoadingPartyDonorTypeTreemap
                      party={party}
                      title={donorTypesTreemapTitle}
                      subtitle={donorTypesTreemapSubtitle}
                      donations={filteredDonations}
                    />
                  )
                }
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}

      {hasFeature(country, Features.DonationType) ? (
        <ArticleSectionWrapper id={"sec-party-donation-types"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                id={"sec-party-donation-types"}
                title={donationTypesTitle}
              />
              <LoadingPartyDonationTypeText
                party={party}
                donations={filteredDonations}
                ssrDonationTypes={ssrStats?.donationTypes}
                chart={
                  isPendingClientDonations ? (
                    <LoadingChartCard
                      height={600}
                      title={donationTypesTreemapTitle}
                      subtitle={donationTypesTreemapSubtitle}
                      feature="treemap"
                    />
                  ) : (
                    <LoadingPartyDonationTypeTreemap
                      party={party}
                      title={donationTypesTreemapTitle}
                      subtitle={donationTypesTreemapSubtitle}
                      donations={filteredDonations}
                    />
                  )
                }
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}

      {/* Contributing Committees Section */}
      {viaSummary.hasViaData ? (
        <PartyOriginalReceivers summary={viaSummary} />
      ) : null}

      {/* Policy Interest & Lobby Groups Breakdown */}
      {hasFeature(country, Features.DonorInterests) && donorInterests ? (
        <ArticleSectionWrapper id={"sec-party-interests"}>
          <PartyInterestsSection
            party={party}
            donations={filteredDonations}
            donorInterests={donorInterests}
            isPendingClientDonations={isPendingClientDonations}
          />
        </ArticleSectionWrapper>
      ) : null}

      <ArticleSectionWrapper id={"sec-donor-list"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle id={"sec-donor-list"} title={listTitle} />
            <p className="mb-6">{listP0}</p>
            {isPendingClientDonations ? (
              <Loading />
            ) : (
              <DonorOverviewList
                countryConfig={country}
                party={party}
                donations={filteredDonations}
              />
            )}
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </>
  );
};

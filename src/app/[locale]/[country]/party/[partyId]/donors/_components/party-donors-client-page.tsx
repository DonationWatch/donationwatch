"use client";

import { useEffect } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { LoadingDonationPartyTreemap } from "@/components/charts/loading-donation-years-treemap";
import { LoadingPartyDonorTypeTreemap } from "@/components/charts/loading-donor-types-treemap";
import { DonorOverviewList } from "@/components/donors/donor-overview-list";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { LoadingPartyDonorTypeText } from "@/components/parties/part-donor-type-text";
import { PartyDonorPageText } from "@/components/parties/party-donor-page-text";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import {
  hasPendingFilterDonationSync,
  useFilterEngine,
} from "@/hooks/use-filter-engine";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { PartyField } from "@/types/party";
import { Features, hasFeature } from "@/utils/features";

interface PartyDonorsClientPageProps {
  country: CountryConfig;
  party: Party;
  treemapTitle: string;
  treemapSubtitle: string;
  donorTypesTitle: string;
  donorTypesTreemapTitle: string;
  donorTypesTreemapSubtitle: string;
  listTitle: string;
  listP0: string;
}

export const PartyDonorsClientPage = ({
  country,
  party,
  treemapTitle,
  treemapSubtitle,
  donorTypesTitle,
  donorTypesTreemapTitle,
  donorTypesTreemapSubtitle,
  listTitle,
  listP0,
}: PartyDonorsClientPageProps) => {
  const tData = useTranslations("data");
  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

  const { isFiltered, filteredDonations, setDonations, controls } =
    useFilterEngine();

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

  if (isLoading || isSyncing) {
    return <Loading heightClass="h-[80vh]" />;
  }

  if (error || !data) {
    return <div>{tData("error")}</div>;
  }

  if (isFiltered && filteredDonations.length === 0) {
    return <FilterEmptyState onReset={controls.resetFilters} />;
  }

  return (
    <>
      <ArticleSectionWrapper id={"sec-party-donors"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <PartyDonorPageText
              party={party}
              country={country}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <LoadingDonationPartyTreemap
                country={country}
                party={party}
                tooSmallAreaColor={party[PartyField.Color]}
                title={treemapTitle}
                subtitle={treemapSubtitle}
                donations={filteredDonations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>

      {hasFeature(country, Features.DonorType) ? (
        <ArticleSectionWrapper id={"sec-party-donor-types"}>
          <ArticleSectionTwoColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                id={"sec-party-donor-types"}
                title={donorTypesTitle}
              />
              <LoadingPartyDonorTypeText
                country={country}
                party={party}
                donations={filteredDonations}
              />
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <LoadingPartyDonorTypeTreemap
                country={country}
                party={party}
                title={donorTypesTreemapTitle}
                subtitle={donorTypesTreemapSubtitle}
                donations={filteredDonations}
              />
            </ArticleSectionColumn>
          </ArticleSectionTwoColumns>
        </ArticleSectionWrapper>
      ) : null}

      <ArticleSectionWrapper id={"sec-donor-list"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle id={"sec-donor-list"} title={listTitle} />
            <p className="mb-6">{listP0}</p>
            <DonorOverviewList
              countryConfig={country}
              party={party}
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </>
  );
};

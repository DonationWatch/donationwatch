"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { LoadingDonationPartyTreemap } from "@/components/charts/loading-donation-years-treemap";
import { LoadingPartyDonorTypeTreemap } from "@/components/charts/loading-donor-types-treemap";
import { DonorOverviewList } from "@/components/donors/donor-overview-list";
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

  useScrollToHash(isSuccess);

  if (isLoading) {
    return <Loading heightClass="h-[80vh]" />;
  }

  if (error || !data) {
    return <div>{tData("error")}</div>;
  }

  return (
    <>
      <ArticleSectionWrapper id={"sec-party-donors"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <PartyDonorPageText
              party={party}
              country={country}
              donations={data}
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
                donations={data}
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
                donations={data}
              />
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <LoadingPartyDonorTypeTreemap
                country={country}
                party={party}
                title={donorTypesTreemapTitle}
                subtitle={donorTypesTreemapSubtitle}
                donations={data}
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
              donations={data}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </>
  );
};

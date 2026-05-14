"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { PartyDonationHistory } from "@/components/donations/party-donation-history";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
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
          {isLoading ? (
            <Loading heightClass="h-[80vh]" />
          ) : error || !data ? (
            <div>{tData("error")}</div>
          ) : (
            <PartyDonationHistory
              country={country}
              party={party}
              donations={data}
            />
          )}
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};

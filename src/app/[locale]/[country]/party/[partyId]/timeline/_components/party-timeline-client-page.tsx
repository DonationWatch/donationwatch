"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { DonationPerMonthChart } from "@/components/charts/donation-per-month-chart";
import { DonationPartyChart } from "@/components/charts/donation-sum-chart";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { PartyTimelineText } from "@/components/parties/party-timeline-text";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { Features, hasFeature } from "@/utils/features";

interface PartyTimelineClientPageProps {
  country: CountryConfig;
  party: Party;
  timelineTitle: string;
  timelineSummary: string;
  chartTitle: string;
  chartSubtitle: string;
  perYearTitle: string;
  perYearSubtitle: string;
}

export const PartyTimelineClientPage = ({
  country,
  party,
  timelineTitle,
  timelineSummary,
  chartTitle,
  chartSubtitle,
  perYearTitle,
  perYearSubtitle,
}: PartyTimelineClientPageProps) => {
  const tData = useTranslations("data");
  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

  useScrollToHash(isSuccess);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{tData("error")}</div>;

  return (
    <>
      {hasFeature(country, Features.Date) ? (
        <ArticleSectionWrapper id={"sec-timeline"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={timelineTitle}
              />
              <p>{timelineSummary}</p>
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <DonationPartyChart
                title={chartTitle}
                subtitle={chartSubtitle}
                country={country}
                years={country.years}
                party={party}
                limitToFirstDateYear={true}
                donations={data}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
      <ArticleSectionWrapper id={"sec-per-year"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            {hasFeature(country, Features.Date) ? null : (
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={timelineTitle}
              />
            )}
            <PartyTimelineText
              country={country}
              party={party}
              donations={data}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <DonationPerMonthChart
              donations={data}
              country={country}
              title={perYearTitle}
              resolution={"year"}
              subtitle={perYearSubtitle}
              years={country.years}
              parties={[party]}
            />
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
    </>
  );
};

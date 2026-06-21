"use client";

import { useMemo, useEffect } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { DonationPerMonthChart } from "@/components/charts/donation-per-month-chart";
import { DonationPartyChart } from "@/components/charts/donation-sum-chart";
import { FilterEmptyState } from "@/components/filter/filter-empty-state";
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
import { useFilterEngine } from "@/hooks/use-filter-engine";
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

  const {
    isFiltered,
    filteredYears,
    filteredDonations,
    setDonations,
    controls,
  } = useFilterEngine();

  const activeYears = useMemo(() => {
    return isFiltered
      ? country.years.filter((y) => filteredYears.includes(y))
      : country.years;
  }, [country.years, isFiltered, filteredYears]);

  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

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
                years={activeYears}
                party={party}
                limitToFirstDateYear={true}
                donations={filteredDonations}
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
              donations={filteredDonations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <DonationPerMonthChart
              donations={filteredDonations}
              country={country}
              title={perYearTitle}
              resolution={"year"}
              subtitle={perYearSubtitle}
              years={activeYears}
              parties={[party]}
            />
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
    </>
  );
};

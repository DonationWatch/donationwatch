"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { InfoAlert } from "@/components/alert";
import { DonationPerMonthChart } from "@/components/charts/donation-per-month-chart";
import { DonationSumChart } from "@/components/charts/donation-sum-chart";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { YearBarsPageText } from "@/components/loading/loading-year-bars-page-text";
import { YearTimelineYearText } from "@/components/loading/loading-year-timeline-year-text";
import { YearTimeseriesText } from "@/components/loading/loading-year-timeseries-text";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";
import { Features, hasFeature } from "@/utils/features";

interface YearsTimelineClientPageProps {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  resolution: "month" | "year";
  timelineTitle: string;
  timelineSummary: string;
  sumChartTitle: string;
  sumChartSubtitle: string;
  perMonthTitle: string;
  perMonthDescription: string;
  perMonthSubtitle: string;
  yearResolutionNote: string;
}

export const YearsTimelineClientPage = ({
  country,
  years,
  parties,
  resolution,
  timelineTitle,
  timelineSummary,
  sumChartTitle,
  sumChartSubtitle,
  perMonthTitle,
  perMonthDescription,
  perMonthSubtitle,
  yearResolutionNote,
}: YearsTimelineClientPageProps) => {
  const tData = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const isLoading = results.some((r) => r.isLoading);
  const error = results.some((r) => r.error);
  const isSuccess = results.every((r) => r.isSuccess);

  useScrollToHash(isSuccess);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <>
      {resolution === "month" ? (
        <ArticleSectionWrapper id={"sec-timeline"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={timelineTitle}
              />
              <p className="mb-6">{timelineSummary}</p>
              <YearTimeseriesText
                country={country}
                parties={parties}
                years={years}
                donations={donations}
              />
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <DonationSumChart
                country={country}
                title={sumChartTitle}
                subtitle={sumChartSubtitle}
                years={years}
                parties={parties}
                donations={donations}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
      <ArticleSectionWrapper id={"sec-per-month"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-per-month"}
              title={perMonthTitle}
            />

            {resolution === "year" && hasFeature(country, Features.Date) && (
              <div className="mb-6">
                <InfoAlert text={yearResolutionNote} />
              </div>
            )}

            <p className="mb-6">{perMonthDescription}</p>
            {resolution === "month" ? (
              <YearBarsPageText
                country={country}
                parties={parties}
                years={years}
                donations={donations}
              />
            ) : (
              <YearTimelineYearText
                country={country}
                parties={parties}
                years={years}
                donations={donations}
              />
            )}
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationPerMonthChart
                country={country}
                title={perMonthTitle}
                subtitle={perMonthSubtitle}
                resolution={resolution}
                years={years}
                parties={parties}
                donations={donations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
    </>
  );
};

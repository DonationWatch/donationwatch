"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { DonationYearsTreemap } from "@/components/charts/loading-donation-years-treemap";
import { DonorReceiverHistogram } from "@/components/charts/loading-donor-receiver-histogram";
import { DonorYearOverview } from "@/components/donors/donor-year-overview";
import { YearsDonorHistogramText } from "@/components/donors/years-donor-histogram-text";
import { YearsDonorPageText } from "@/components/donors/years-donor-page-text";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";

interface YearsDonorsClientPageProps {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  treemapTitle: string;
  treemapSubtitle: string;
  histogramTitle: string;
  histogramSubtitle: string;
  sectionTitle: string;
  histogramSectionTitle: string;
  summary: string;
  summary2: string;
  histogramP0: string;
  listTitle: string;
  listP0: string;
}

export const YearsDonorsClientPage = ({
  country,
  years,
  parties,
  treemapTitle,
  treemapSubtitle,
  histogramTitle,
  histogramSubtitle,
  sectionTitle,
  histogramSectionTitle,
  summary,
  summary2,
  histogramP0,
  listTitle,
  listP0,
}: YearsDonorsClientPageProps) => {
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
      <ArticleSectionWrapper id={"sec-years-donors"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-donors"}
              title={sectionTitle}
            />
            <p className="mb-6">{summary}</p>
            <p className="mb-6">{summary2}</p>
            <YearsDonorPageText
              country={country}
              years={years}
              parties={parties}
              donations={donations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationYearsTreemap
                country={country}
                years={years}
                parties={parties}
                title={treemapTitle}
                subtitle={treemapSubtitle}
                donations={donations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
      <ArticleSectionWrapper id={"sec-histogram"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-histogram"}
              title={histogramSectionTitle}
            />
            <p className="mb-6">{histogramP0}</p>
            <YearsDonorHistogramText
              country={country}
              years={years}
              parties={parties}
              donations={donations}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonorReceiverHistogram
                country={country}
                years={years}
                parties={parties}
                title={histogramTitle}
                subtitle={histogramSubtitle}
                donations={donations}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
      <ArticleSectionWrapper id={"sec-donor-list"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-donor-list"}
              title={listTitle}
            />
            <p className="mb-6">{listP0}</p>
            <DonorYearOverview
              country={country}
              years={years}
              donations={donations}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </>
  );
};

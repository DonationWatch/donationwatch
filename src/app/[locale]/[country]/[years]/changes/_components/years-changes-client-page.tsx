"use client";

import type { CountryConfig } from "@/types/country-config";

import { YearDonationHistory } from "@/components/donations/party-donation-history";
import {
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";

interface YearsChangesClientPageProps {
  country: CountryConfig;
  years: string[];
  title: string;
  summary: string;
}

export const YearsChangesClientPage = ({
  country,
  years,
  title,
  summary,
}: YearsChangesClientPageProps) => {
  const tData = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const isLoading = results.some((r) => r.isLoading);
  const error = results.some((r) => r.error);
  const isSuccess = results.every((r) => r.isSuccess);

  useScrollToHash(isSuccess);

  return (
    <ArticleSectionWrapper id={"sec-years-changes"}>
      <ArticleSectionTitle as={"h1"} id={"sec-years-changes"} title={title} />
      <p className="mb-6">{summary}</p>
      {isLoading ? (
        <Loading heightClass="h-[80vh]" />
      ) : error ? (
        <div>{tData("error")}</div>
      ) : (
        <YearDonationHistory
          years={years}
          country={country}
          donations={results
            .flatMap((r) => r.data)
            .filter(isNotNullandNotUndefined)}
        />
      )}
    </ArticleSectionWrapper>
  );
};

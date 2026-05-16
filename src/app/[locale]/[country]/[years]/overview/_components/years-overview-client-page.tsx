"use client";

import { useLocale } from "next-intl";
import { useMemo } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { PartySum } from "@/utils/data/get-parties-sum";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import { DonationYearScatterPlot } from "@/components/charts/donation-year-scatter-plot";
import { DonationsPieChart } from "@/components/charts/donations-pie-chart";
import { FormatAnd } from "@/components/formatter";
import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { TextPartyLink } from "@/components/parties/text-party-link";
import { Translation } from "@/components/translation";
import { LoadedTopPartyDonations } from "@/components/years/top-party-year-donations";
import { useDonationsByYears } from "@/hooks/use-api";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import {
  formatAnd,
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "@/utils/formatter";

interface YearsOverviewClientPageProps {
  country: CountryConfig;
  years: string[];
  parties: Party[];
  partyYearSums: PartyYearsSums;
  sectionTitle: string;
  summary: string;
  scatterTitle: string;
  scatterSummary: string;
  scatterSubtitle: string;
}

export const YearsOverviewClientPage = ({
  country,
  years,
  parties,
  partyYearSums,
  sectionTitle,
  summary,
  scatterTitle,
  scatterSummary,
  scatterSubtitle,
}: YearsOverviewClientPageProps) => {
  const t = useTranslations();
  const tData = useTranslations("data");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const results = useDonationsByYears(country, years);
  const isLoading = results.some((r) => r.isLoading);
  const error = results.some((r) => r.error);
  const isSuccess = results.every((r) => r.isSuccess);

  useScrollToHash(isSuccess);

  const donations = useMemo(() => {
    return results.flatMap((r) => r.data).filter(isNotNullandNotUndefined);
  }, [results]);

  const { sum, sums, count } = useMemo(() => {
    return getPartiesSum(country, partyYearSums, parties, years);
  }, [country, partyYearSums, parties, years]);

  const mostDonations = useMemo(() => {
    let most: PartySum | undefined;
    sums.forEach((s) => {
      if (!most || most[1].count < s[1].count) most = s;
    });
    return most;
  }, [sums]);

  const topDonationSums = useMemo(() => {
    return sums.toSorted((a, b) => b[1].sum - a[1].sum).slice(0, 5);
  }, [sums]);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  return (
    <>
      <ArticleSectionWrapper id={"sec-years-overview"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-overview"}
              title={sectionTitle}
            />
            <p className="mb-6">{summary}</p>
            <p className="mb-6">
              {t("overview.detail.summary2", {
                years: formatAnd(browserBasedLocale, years),
                partyCount: sums.length,
                donationCount: count,
                minimumAmount: formatCompactCountryCurrency(
                  browserBasedLocale,
                  country.minPublicDonationAmount,
                  country,
                ),
                donationSum: formatCountryCurrency(
                  browserBasedLocale,
                  sum,
                  country,
                ),
              })}
            </p>
            {topDonationSums.length ? (
              <p className="mb-6">
                <Translation
                  text={t.raw("overview.detail.highest_sum")}
                  variables={{
                    years: formatAnd(browserBasedLocale, years),
                    parties: (
                      <FormatAnd
                        locale={locale}
                        items={topDonationSums.map(([receiverId, sum]) => (
                          <span key={receiverId}>
                            <TextPartyLink
                              country={country}
                              party={receiverId}
                              locale={locale}
                            />
                            (
                            {formatCountryCurrency(
                              browserBasedLocale,
                              sum.sum,
                              country,
                            )}
                            )
                          </span>
                        ))}
                      />
                    ),
                  }}
                />
              </p>
            ) : null}
            {mostDonations && (
              <p className="mb-6">
                <Translation
                  text={t.raw("overview.detail.most_donations")}
                  variables={{
                    party: (
                      <TextPartyLink
                        party={mostDonations[0]}
                        country={country}
                        locale={locale}
                      />
                    ),
                    count: mostDonations[1].count,
                    sum: formatCountryCurrency(
                      browserBasedLocale,
                      mostDonations[1].sum,
                      country,
                    ),
                  }}
                />
              </p>
            )}
            <LoadedTopPartyDonations
              locale={locale}
              donations={donations}
              country={country}
              sums={sums}
              sum={sum}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationsPieChart
                years={years}
                country={country}
                partyYearsSums={partyYearSums}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>

      {count > 0 ? (
        <ArticleSectionWrapper id={"sec-scatter"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h2"}
                id={"sec-scatter"}
                title={scatterTitle}
              />
              <p className="mb-6">{scatterSummary}</p>
              <DonationYearScatterPlot
                years={years}
                country={country}
                parties={parties}
                title={scatterTitle}
                subtitle={scatterSubtitle}
                donations={donations}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
    </>
  );
};

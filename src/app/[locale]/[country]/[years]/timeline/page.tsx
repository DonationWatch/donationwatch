import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { InfoAlert } from "@/components/alert";
import { DonationPerMonthChart } from "@/components/charts/donation-per-month-chart";
import { DonationSumChart } from "@/components/charts/donation-sum-chart";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { LoadingYearBarsPageText } from "@/components/loading/loading-year-bars-page-text";
import { LoadingYearTimelineYearText } from "@/components/loading/loading-year-timeline-year-text";
import { LoadingYearTimeseriesText } from "@/components/loading/loading-year-timeseries-text";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getParties } from "@/utils/data/get-parties";
import { Features, hasFeature } from "@/utils/features";
import { formatYearsRange } from "@/utils/formatter";
import {
  getPartyYearsSums,
  hasYearSums,
} from "@/utils/loader/party-years-sums";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import {
  canShowYearsTimeline,
  yearPartiesHaveYearOnlyDonations,
} from "@/utils/party";
import { deserializeYears } from "@/utils/serializers";
import { isValidCountry, isValidLocale } from "@/utils/validate";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const [t, tCountries, tPageTitle, countryConfig, partySums] =
    await Promise.all([
      getTranslations({ locale: params.locale }),
      getTranslations({ locale: params.locale, namespace: "countries" }),
      getTranslations({ locale: params.locale, namespace: "page_title" }),
      getCountryConfig(country),
      getPartyYearsSums(country),
    ]);
  const years = deserializeYears(params.years);

  if (!canShowYearsTimeline(countryConfig, partySums, years)) {
    return notFoundMetadata;
  }

  if (!hasYearSums(partySums, years)) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  const yearsRange = formatYearsRange(years);
  const countryName = getCountryName(countryConfig, tCountries);
  const description = t("timeline.description", {
    years: yearsRange,
    country: countryName,
  });

  return {
    title: tPageTitle("years.timeline", {
      year: formatYearsRange(years),
      country: getCountryName(countryConfig, tCountries),
    }),
    description,
    alternates: generateAlternates(`${country}/${params.years}/timeline`),
  };
}
export default async function TimelinePage(
  props: PageProps<"/[locale]/[country]/[years]/timeline">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const years = deserializeYears(params.years);
  const [t, tCountries, countryConfig, partyYearSums] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(params.country),
    getPartyYearsSums(params.country),
  ]);

  if (!canShowYearsTimeline(countryConfig, partyYearSums, years)) {
    return notFound();
  }

  const hasYearOnlyDonations = yearPartiesHaveYearOnlyDonations(
    partyYearSums,
    years,
  );

  const parties = getParties(countryConfig, years);

  const resolution =
    !hasYearOnlyDonations && hasFeature(countryConfig, Features.Date)
      ? "month"
      : "year";
  const chartStrings =
    resolution === "month"
      ? {
          title: "per_month.title" as const,
          subtitle: "per_month.subtitle" as const,
          description: "per_month.description" as const,
        }
      : {
          title: "per_year.title" as const,
          subtitle: "per_year.subtitle" as const,
          description: "per_year.description" as const,
        };

  return (
    <Article fullWidth={true}>
      {resolution === "month" ? (
        <ArticleSectionWrapper id={"sec-timeline"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={t("timeline.detail.title")}
              />
              <p className="mb-6">{t("timeline.detail.summary")}</p>
              <LoadingYearTimeseriesText
                country={countryConfig}
                parties={parties}
                years={years}
              />
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <DonationSumChart
                country={countryConfig}
                title={t("years.title")}
                subtitle={t("years.subtitle", {
                  country: getCountryName(countryConfig, tCountries),
                  years: formatYearsRange(years),
                })}
                years={years}
                parties={parties}
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
              title={t(chartStrings.title)}
            />

            {resolution === "year" &&
              hasFeature(countryConfig, Features.Date) && (
                <div className="mb-6">
                  <InfoAlert text={t("timeline.year_resolution_note")} />
                </div>
              )}

            <p className="mb-6">{t(chartStrings.description)}</p>
            {resolution === "month" ? (
              <LoadingYearBarsPageText
                country={countryConfig}
                parties={parties}
                years={years}
              />
            ) : (
              <LoadingYearTimelineYearText
                country={countryConfig}
                parties={parties}
                years={years}
              />
            )}
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationPerMonthChart
                country={countryConfig}
                title={t(chartStrings.title)}
                subtitle={t(chartStrings.subtitle, {
                  country: getCountryName(countryConfig, tCountries),
                  years: formatYearsRange(years),
                })}
                resolution={resolution}
                years={years}
                parties={parties}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
    </Article>
  );
}

import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DonationPerMonthChart } from "../../../../../components/chart/donation-per-month-chart";
import { DonationSumChart } from "../../../../../components/chart/donation-sum-chart";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "../../../../../components/layout/article";
import { LoadingYearBarsPageText } from "../../../../../components/loading-year-bars-page-text";
import { LoadingYearTimeseriesText } from "../../../../../components/loading-year-timeseries-text";
import { getCountryName } from "../../../../../utils/countries";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import { getParties } from "../../../../../utils/data/get-parties";
import { formatYearsRange } from "../../../../../utils/formatter";
import {
  getPartyYearsSums,
  hasYearSums,
} from "../../../../../utils/loader/party-years-sums";
import { generateAlternates } from "../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { deserializeYears } from "../../../../../utils/serializers";
import { isValidCountry, isValidLocale } from "../../../../../utils/validate";

import type { Metadata } from "next";

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
  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(params.country),
  ]);

  const parties = getParties(countryConfig, years);

  return (
    <Article fullWidth={true}>
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
      <ArticleSectionWrapper id={"sec-per-month"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h2"}
              id={"sec-per-month"}
              title={t("per_month.title")}
            />
            <LoadingYearBarsPageText
              country={countryConfig}
              parties={parties}
              years={years}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationPerMonthChart
                country={countryConfig}
                title={t("per_month.title")}
                subtitle={t("per_month.subtitle", {
                  country: getCountryName(countryConfig, tCountries),
                  years: formatYearsRange(years),
                })}
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

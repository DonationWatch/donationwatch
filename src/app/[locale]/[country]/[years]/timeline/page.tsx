import { notFound, redirect } from "next/navigation";

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
import { getTranslations, t } from "../../../translations";

import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { locale, country } = params;

  const [translations, countryConfig, partySums] = await Promise.all([
    getTranslations(locale),
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
  const countryName = getCountryName(countryConfig, translations);
  const description = t(translations.timeline.description, {
    years: yearsRange,
    country: countryName,
  });

  return {
    title: `${t(translations.page_title.years.timeline, {
      year: formatYearsRange(years),
      country: getCountryName(countryConfig, translations),
    })}`,
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

  const years = deserializeYears(params.years);
  const [translations, countryConfig] = await Promise.all([
    getTranslations(params.locale),
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
              title={translations.timeline.detail.title}
            />
            <p className="mb-6">{translations.timeline.detail.summary}</p>
            <LoadingYearTimeseriesText
              country={countryConfig}
              parties={parties}
              years={years}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <DonationSumChart
              country={countryConfig}
              title={translations.years.title}
              subtitle={t(translations.years.subtitle, {
                country: getCountryName(countryConfig, translations),
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
              title={translations.per_month.title}
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
                title={translations.per_month.title}
                subtitle={t(translations.per_month.subtitle, {
                  country: getCountryName(countryConfig, translations),
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

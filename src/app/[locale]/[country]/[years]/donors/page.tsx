import { notFound, redirect } from "next/navigation";

import { LoadingDonationYearsTreemap } from "../../../../../components/chart/loading-donation-years-treemap";
import { LoadingDonorReceiverHistogram } from "../../../../../components/chart/loading-donor-receiver-histogram";
import { DonorYearOverview } from "../../../../../components/donor-year-overview";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "../../../../../components/layout/article";
import { LoadingYearsDonorHistogramText } from "../../../../../components/years-donor-histogram-text";
import { YearsDonorPageText } from "../../../../../components/years-donor-page-text";
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
  props: PageProps<"/[locale]/[country]/[years]/donors">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { locale, country } = params;
  const years = params.years;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  const yearsRange = formatYearsRange(deserializeYears(years));
  const countryName = getCountryName(countryConfig, translations);
  const description = t(translations.donors.description, {
    year: yearsRange,
    country: countryName,
  });

  return {
    title: `${t(translations.page_title.years.donors, {
      year: yearsRange,
      country: countryName,
    })}`,
    description,
    alternates: generateAlternates(`${country}/${years}/donors`),
  };
}

export default async function YearPage(
  props: PageProps<"/[locale]/[country]/[years]/donors">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();

  const { locale, country } = params;
  const years = deserializeYears(params.years);

  const [translations, countryConfig, partySums] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  if (!hasYearSums(partySums, years)) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  const parties = getParties(countryConfig, years);

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-years-donors"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-donors"}
              title={translations.donors.detail.title}
            />
            <p className="mb-6">{translations.donors.detail.summary}</p>
            <p className="mb-6">{translations.donors.detail.summary2}</p>
            <YearsDonorPageText
              country={countryConfig}
              years={years}
              parties={parties}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <LoadingDonationYearsTreemap
                country={countryConfig}
                years={years}
                parties={parties}
                title={translations.donors.detail.title}
                subtitle={t(translations.donors.detail.subtitle, {
                  country: getCountryName(countryConfig, translations),
                  years: formatYearsRange(years),
                })}
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
              title={translations.donors.histogram.title}
            />
            <p className="mb-6">{translations.donors.histogram.p0}</p>
            <LoadingYearsDonorHistogramText
              country={countryConfig}
              years={years}
              parties={parties}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <LoadingDonorReceiverHistogram
                country={countryConfig}
                years={years}
                parties={parties}
                title={translations.donors.histogram.title}
                subtitle={t(translations.donors.histogram.subtitle, {
                  country: getCountryName(countryConfig, translations),
                  years: formatYearsRange(years),
                })}
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
              title={translations.donors.list.title}
            />
            <p className="mb-6">{translations.donors.list.p0}</p>
            <DonorYearOverview country={countryConfig} years={years} />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </Article>
  );
}

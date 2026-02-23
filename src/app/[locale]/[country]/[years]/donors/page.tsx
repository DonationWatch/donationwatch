import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

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

import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/donors">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const years = params.years;

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  const yearsRange = formatYearsRange(deserializeYears(years));
  const countryName = getCountryName(countryConfig, tCountries);
  const description = t("donors.description", {
    year: yearsRange,
    country: countryName,
  });

  return {
    title: `${t("page_title.years.donors", {
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
  setRequestLocale(params.locale);

  const { country } = params;
  const years = deserializeYears(params.years);

  const [t, tCountries, countryConfig, partySums] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
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
              title={t("donors.detail.title")}
            />
            <p className="mb-6">{t("donors.detail.summary")}</p>
            <p className="mb-6">{t("donors.detail.summary2")}</p>
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
                title={t("donors.detail.title")}
                subtitle={t("donors.detail.subtitle", {
                  country: getCountryName(countryConfig, tCountries),
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
              title={t("donors.histogram.title")}
            />
            <p className="mb-6">{t("donors.histogram.p0")}</p>
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
                title={t("donors.histogram.title")}
                subtitle={t("donors.histogram.subtitle", {
                  country: getCountryName(countryConfig, tCountries),
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
              title={t("donors.list.title")}
            />
            <p className="mb-6">{t("donors.list.p0")}</p>
            <DonorYearOverview country={countryConfig} years={years} />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </Article>
  );
}

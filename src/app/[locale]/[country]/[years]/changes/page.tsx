import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DynamicYearDonationHistory } from "../../../../../components/dynamic-donation-history";
import {
  Article,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "../../../../../components/layout/article";
import { getCountryName } from "../../../../../utils/countries";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import {
  formatCompactCountryCurrency,
  formatYearsRange,
} from "../../../../../utils/formatter";
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
  props: PageProps<"/[locale]/[country]/[years]/changes">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  setRequestLocale(params.locale);

  const locale = params.locale;
  const country = params.country;
  const years = params.years;

  const [t, tCountries, tPageTitle, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "page_title" }),
    getCountryConfig(country),
  ]);

  const countryName = getCountryName(countryConfig, tCountries);
  const deserializedYears = deserializeYears(years);
  const yearRange = formatYearsRange(deserializedYears);

  const description = t("changes.description", {
    country: countryName,
    year: yearRange,
    minAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
  });

  return {
    title: tPageTitle("years.changes", {
      year: yearRange,
      country: countryName,
    }),
    description,
    alternates: generateAlternates(`${country}/${years}/changes`),
  };
}

export default async function ChangesPage(
  props: PageProps<"/[locale]/[country]/[years]/changes">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const years = deserializeYears(params.years);

  const [t, countryConfig, partySums] = await Promise.all([
    getTranslations({ locale }),
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  if (!hasYearSums(partySums, years)) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-years-donors"}>
        <ArticleSectionTitle
          as={"h1"}
          id={"sec-years-changes"}
          title={t("changes.detail.title")}
        />
        <p className="mb-6">{t("changes.detail.summary")}</p>
        <DynamicYearDonationHistory years={years} country={countryConfig} />
      </ArticleSectionWrapper>
    </Article>
  );
}

import type { Metadata } from "next";

import { getCountryName } from "@donationwatch/core/utils/countries";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
import { formatYearsRange } from "@donationwatch/core/utils/formatter";
import { hasYearSums } from "@donationwatch/core/utils/party";
import { deserializeYears } from "@donationwatch/core/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
} from "@donationwatch/core/utils/validate";
import { getPartyYearsSums } from "@donationwatch/data/loader/party-years-sums";
import { getCountryDonorInterests } from "@donationwatch/data/queries/categorized-donors";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { Article } from "@/components/layout/article";
import { generateAlternates, isCanonicalYearRange } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { YearsDonorsClientPage } from "./_components/years-donors-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/donors">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const years = params.years;

  const [t, tCountries, tPageTitle, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "page_title" }),
    getCountryConfig(country),
  ]);

  const deserializedYears = deserializeYears(years);
  const yearsRange = formatYearsRange(deserializedYears);
  const countryName = getCountryName(countryConfig, tCountries);
  const description = t("donors.description", {
    year: yearsRange,
    country: countryName,
  });

  return {
    title: tPageTitle("years.donors", {
      year: yearsRange,
      country: countryName,
    }),
    description,
    alternates: generateAlternates(`${country}/${years}/donors`),
    ...(!isCanonicalYearRange(deserializedYears, countryConfig)
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
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

  if (!hasFeature(countryConfig, Features.Donors)) {
    return notFound();
  }

  if (!hasYearSums(partySums, years)) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  const donorInterests = hasFeature(countryConfig, Features.DonorInterests)
    ? await getCountryDonorInterests(countryConfig.id)
    : undefined;

  return (
    <Article>
      <YearsDonorsClientPage
        years={years}
        donorInterests={donorInterests}
        sectionTitle={t("donors.detail.title")}
        summary={t("donors.detail.summary")}
        summary2={t("donors.detail.summary2")}
        treemapTitle={t("donors.detail.title")}
        treemapSubtitle={t("donors.detail.subtitle", {
          country: getCountryName(countryConfig, tCountries),
          years: formatYearsRange(years),
        })}
        histogramSectionTitle={t("donors.histogram.title")}
        histogramP0={t("donors.histogram.p0")}
        histogramTitle={t("donors.histogram.title")}
        histogramSubtitle={t("donors.histogram.subtitle", {
          country: getCountryName(countryConfig, tCountries),
          years: formatYearsRange(years),
        })}
        listTitle={t("donors.list.title")}
        listP0={t("donors.list.p0")}
      />
    </Article>
  );
}

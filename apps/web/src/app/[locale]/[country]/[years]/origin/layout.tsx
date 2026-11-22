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
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { notFoundMetadata } from "@/utils/not-found-metadata";

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/[years]/origin">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { country } = params;
  const years = params.years;

  const [t, tCountries, tPageTitle, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getTranslations({ locale: params.locale, namespace: "page_title" }),
    getCountryConfig(country),
  ]);

  const yearsRange = formatYearsRange(deserializeYears(years));
  const countryName = getCountryName(countryConfig, tCountries);

  const description = t("origin.description", {
    years: yearsRange,
    country: countryName,
  });

  return {
    title: tPageTitle("years.origin", {
      year: formatYearsRange(deserializeYears(years)),
      country: getCountryName(countryConfig, tCountries),
    }),
    description,
  };
}

export default async function OriginLayout(
  props: LayoutProps<"/[locale]/[country]/[years]/origin">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country } = params;
  const { children } = props;

  const [countryConfig, partySums] = await Promise.all([
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  if (!hasFeature(countryConfig, Features.Origin)) {
    return notFound();
  }

  if (!hasYearSums(partySums, deserializeYears(params.years))) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  return children;
}

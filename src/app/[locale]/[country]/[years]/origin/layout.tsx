import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { getCountryName } from "../../../../../utils/countries";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import { formatYearsRange } from "../../../../../utils/formatter";
import {
  getPartyYearsSums,
  hasYearSums,
} from "../../../../../utils/loader/party-years-sums";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { deserializeYears } from "../../../../../utils/serializers";
import { isValidCountry, isValidLocale } from "../../../../../utils/validate";

import type { Metadata } from "next";

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/[years]/origin">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { country } = params;
  const years = params.years;

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  const yearsRange = formatYearsRange(deserializeYears(years));
  const countryName = getCountryName(countryConfig, tCountries);

  const description = t("origin.description", {
    years: yearsRange,
    country: countryName,
  });

  return {
    title: `${t("page_title.years.origin", {
      year: formatYearsRange(deserializeYears(years)),
      country: getCountryName(countryConfig, tCountries),
    })}`,
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

  if (!countryConfig.hasOrigin) {
    return redirect("/not-found");
  }

  if (!hasYearSums(partySums, deserializeYears(params.years))) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  return children;
}

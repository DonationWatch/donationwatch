import { notFound, redirect } from "next/navigation";

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
import { getTranslations, t } from "../../../translations";

import type { Metadata } from "next";

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/[years]/origin">,
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

  const description = t(translations.origin.description, {
    years: yearsRange,
    country: countryName,
  });

  return {
    title: `${t(translations.page_title.years.origin, {
      year: formatYearsRange(deserializeYears(years)),
      country: getCountryName(countryConfig, translations),
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

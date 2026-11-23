import type { Metadata } from "next";

import { deserializeYears } from "@donationwatch/core/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
} from "@donationwatch/core/utils/validate";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { generateAlternates, isCanonicalYearRange } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { YearsOriginClientPage } from "./_components/years-origin-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/origin/overview">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { country, years } = params;
  const countryConfig = await getCountryConfig(country);
  const deserializedYears = deserializeYears(years);

  return {
    alternates: generateAlternates(`${country}/${years}/origin/overview`),
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

export default async function OverviewPage(
  props: PageProps<"/[locale]/[country]/[years]/origin/overview">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const years = deserializeYears(params.years);

  return <YearsOriginClientPage years={years} />;
}

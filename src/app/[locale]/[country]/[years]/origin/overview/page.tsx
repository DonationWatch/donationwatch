import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getCountryConfig } from "@/utils/data/get-country-config";
import { getParties } from "@/utils/data/get-parties";
import { generateAlternates } from "@/utils/meta";
import { deserializeYears } from "@/utils/serializers";
import { isValidCountry, isValidLocale } from "@/utils/validate";

import { YearsOriginClientPage } from "./_components/years-origin-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/origin/overview">,
): Promise<Metadata> {
  const params = await props.params;

  const { country, years } = params;

  return {
    alternates: generateAlternates(`${country}/${years}/origin/overview`),
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

  const [countryConfig] = await Promise.all([getCountryConfig(params.country)]);

  const parties = getParties(countryConfig, years);

  return (
    <YearsOriginClientPage
      country={countryConfig}
      parties={parties}
      years={years}
    />
  );
}

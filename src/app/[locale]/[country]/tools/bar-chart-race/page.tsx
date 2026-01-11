import { notFound } from "next/navigation";

import { RacingBars } from "./racing-bars";
import { Article } from "../../../../../components/layout/article";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import { LOCALES } from "../../../../../utils/locales";
import { generateAlternates } from "../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../../../utils/validate";
import { getTranslations } from "../../../translations";

import type { Metadata } from "next";

export const dynamicParams = false;
export const dynamic = "error";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/tools/bar-chart-race">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  const { locale, country } = params;

  const translations = await getTranslations(locale);

  return {
    title: `${translations.bar_chart_race.title} | DonationWatch`,
    description: translations.bar_chart_race.description,
    alternates: generateAlternates(`${country}/tools/data`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/tools/bar-chart-race">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  const { locale, country } = params;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  if (!countryConfig.hasTimeline) {
    return notFound();
  }

  return (
    <Article title={translations.bar_chart_race.title}>
      {countryConfig.hasTimeline ? (
        <>
          <p className="mb-8 max-w-prose">
            {translations.bar_chart_race.description}
          </p>
          <p className="mb-8 max-w-prose text-sm">
            {translations.bar_chart_race.note}
          </p>
          <RacingBars countryConfig={countryConfig} />
        </>
      ) : null}
    </Article>
  );
}

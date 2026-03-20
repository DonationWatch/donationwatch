import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Article } from "@/components/layout/article";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

import { RacingBars } from "./racing-bars";

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/tools/bar-chart-race">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const t = await getTranslations({
    locale: params.locale,
    namespace: "bar_chart_race",
  });

  return {
    title: `${t("title")} | DonationWatch`,
    description: t("description"),
    alternates: generateAlternates(`${country}/tools/data`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/tools/bar-chart-race">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country } = params;

  const [tBarChartRace, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "bar_chart_race" }),
    getCountryConfig(country),
  ]);

  if (!countryConfig.hasDate) {
    return notFound();
  }

  return (
    <Article title={tBarChartRace("title")}>
      {countryConfig.hasDate ? (
        <>
          <p className="mb-8 max-w-prose">{tBarChartRace("description")}</p>
          <p className="mb-8 max-w-prose text-sm">{tBarChartRace("note")}</p>
          <RacingBars countryConfig={countryConfig} />
        </>
      ) : null}
    </Article>
  );
}

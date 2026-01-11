import { notFound } from "next/navigation";
import { Suspense } from "react";

import { DataExport } from "../../../../../components/data-export";
import { Article } from "../../../../../components/layout/article";
import Loading from "../../../../../components/loading";
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
  props: PageProps<"/[locale]/[country]/tools/data">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  const { locale, country } = params;

  const translations = await getTranslations(locale);

  return {
    title: `${translations.export.title} | DonationWatch`,
    alternates: generateAlternates(`${country}/tools/data`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/tools/data">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  const { locale, country } = params;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  return (
    <Article title={translations.export.title}>
      <DataExport country={countryConfig} />
    </Article>
  );
}

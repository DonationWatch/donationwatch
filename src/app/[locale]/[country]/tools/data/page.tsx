import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DataExport } from "../../../../../components/data-export";
import { Article } from "../../../../../components/layout/article";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import { LOCALES } from "../../../../../utils/locales";
import { generateAlternates } from "../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../../../utils/validate";

import type { Metadata } from "next";
import { COUNTRIES } from "@/utils/countries";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...COUNTRIES].flatMap((country) =>
    LOCALES.map((locale) => ({ locale, country })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/tools/data">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const tExport = await getTranslations({
    locale: params.locale,
    namespace: "export",
  });

  return {
    title: `${tExport("title")} | DonationWatch`,
    alternates: generateAlternates(`${country}/tools/data`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/tools/data">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale, country } = params;

  const [tExport, countryConfig] = await Promise.all([
    getTranslations({ locale, namespace: "export" }),
    getCountryConfig(country),
  ]);

  return (
    <Article title={tExport("title")}>
      <DataExport country={countryConfig} />
    </Article>
  );
}

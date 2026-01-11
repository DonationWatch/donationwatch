import { notFound } from "next/navigation";

import { Transparency } from "./transparency";
import { Article } from "../../../../components/layout/article";
import { getCountryConfig } from "../../../../utils/data/get-country-config";
import { LOCALES } from "../../../../utils/locales";
import { generateAlternates } from "../../../../utils/meta";
import { notFoundMetadata } from "../../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../../utils/validate";
import { getTranslations } from "../../translations";

import type { Metadata } from "next";

export const dynamicParams = false;
export const dynamic = "error";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/transparency">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  const { locale, country } = params;

  const translations = await getTranslations(locale);

  return {
    robots: "noindex, nofollow",
    title: `${translations.transparency.title} | DonationWatch`,
    alternates: generateAlternates(`${country}/transparency`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/transparency">,
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
    <Article title={translations.transparency.title}>
      <Transparency countryConfig={countryConfig} />
    </Article>
  );
}

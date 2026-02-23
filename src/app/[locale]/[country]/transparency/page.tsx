import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Transparency } from "./transparency";
import { Article } from "../../../../components/layout/article";
import { getCountryConfig } from "../../../../utils/data/get-country-config";
import { LOCALES } from "../../../../utils/locales";
import { generateAlternates } from "../../../../utils/meta";
import { notFoundMetadata } from "../../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../../utils/validate";

import type { Metadata } from "next";

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/transparency">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const t = await getTranslations({
    locale: params.locale,
    namespace: "transparency",
  });

  return {
    robots: "noindex, nofollow",
    title: `${t("title")} | DonationWatch`,
    alternates: generateAlternates(`${country}/transparency`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/transparency">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country } = params;

  const [t, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "transparency" }),
    getCountryConfig(country),
  ]);

  return (
    <Article title={t("title")}>
      <Transparency countryConfig={countryConfig} />
    </Article>
  );
}

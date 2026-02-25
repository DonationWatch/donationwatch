import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Metadata } from "next";

import { Article } from "@/components/layout/article";
import { PartyComparison } from "@/components/party-comparison";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...COUNTRIES].flatMap((country) =>
    LOCALES.map((locale) => ({ locale, country })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/tools/compare">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const tCompareParties = await getTranslations({
    locale: params.locale,
    namespace: "compare_parties_page",
  });

  return {
    title: `${tCompareParties("title")} | DonationWatch`,
    alternates: generateAlternates(`${country}/tools/compare`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/tools/compare">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country } = params;

  const [countryConfig, tCompareParties] = await Promise.all([
    getCountryConfig(country),
    getTranslations({
      locale: params.locale,
      namespace: "compare_parties_page",
    }),
  ]);

  return (
    <Article title={tCompareParties("title")}>
      <p className="mb-8 max-w-prose">{tCompareParties("description")}</p>
      <PartyComparison countryConfig={countryConfig} />
    </Article>
  );
}

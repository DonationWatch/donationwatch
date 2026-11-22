import type { Metadata } from "next";

import { COUNTRIES, getCountryName } from "@donationwatch/core/utils/countries";
import { LOCALES } from "@donationwatch/core/utils/locales";
import {
  isValidCountry,
  isValidLocale,
} from "@donationwatch/core/utils/validate";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import {
  ArticleHeader,
  ArticleLead,
  ArticleTitle,
  WideArticle,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { PartyComparison } from "@/components/parties/party-comparison";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

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

  const [tCompareParties, tCountries, countryConfig] = await Promise.all([
    getTranslations({
      locale: params.locale,
      namespace: "compare_parties_page",
    }),
    getTranslations({
      locale: params.locale,
      namespace: "countries",
    }),
    getCountryConfig(country),
  ]);
  const localizedCountryName = getCountryName(countryConfig, tCountries);

  return {
    title: `${tCompareParties("title")} - ${localizedCountryName}`,
    description: tCompareParties("description"),
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

  const [tCompareParties, messages] = await Promise.all([
    getTranslations({
      locale: params.locale,
      namespace: "compare_parties_page",
    }),
    getMessagesForLocale(params.locale),
  ]);

  const pageMessages = pick(messages, [
    "compare_parties_page",
    "compare_parties",
    "donor_type",
    "chart",
    "bar_chart_race",
  ]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
      <WideArticle>
        <ArticleHeader>
          <ArticleTitle>{tCompareParties("title")}</ArticleTitle>
          <ArticleLead>
            <p>{tCompareParties("description")}</p>
          </ArticleLead>
        </ArticleHeader>
        <Suspense fallback={<Loading />}>
          <PartyComparison />
        </Suspense>
      </WideArticle>
    </ScopedClientIntlProvider>
  );
}

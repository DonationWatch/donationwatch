import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DynamicTransparencyPageContent } from "@/app/[locale]/[country]/transparency/transparency-list";
import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import { Article } from "@/components/layout/article";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

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

  const [tTransparency, tCountries, countryConfig, messages] =
    await Promise.all([
      getTranslations({ locale: params.locale, namespace: "transparency" }),
      getTranslations({ locale: params.locale, namespace: "countries" }),
      getCountryConfig(country),
      getMessagesForLocale(params.locale),
    ]);

  const pageMessages = pick(messages, ["transparency", "countries"]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
      <Article title={tTransparency("title")}>
        <DynamicTransparencyPageContent
          texts={{
            filteredReceivers: {
              title: tTransparency("section.filtered_receivers"),
              p0: tTransparency("filtered_receivers.p0"),
              p1: tTransparency("filtered_receivers.p1"),
            },
            filteredDonors: {
              title: tTransparency("section.filtered_donors"),
              p0: tTransparency("filtered_donors.p0"),
              p1: tTransparency("filtered_donors.p1"),
            },
            normalizedReceivers: {
              title: tTransparency("receivers.title"),
              p0: tTransparency("receivers.p0", {
                country: getCountryName(countryConfig, tCountries),
              }),
            },
            aggregatedDonors: {
              title: tTransparency("section.aggregated"),
              p0: tTransparency("p0"),
              p1: tTransparency("p1"),
            },
          }}
        />
      </Article>
    </ScopedClientIntlProvider>
  );
}

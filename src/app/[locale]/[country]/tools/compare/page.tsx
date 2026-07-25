import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import { Article } from "@/components/layout/article";
import { PartyComparison } from "@/components/parties/party-comparison";
import { COUNTRIES } from "@/utils/countries";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
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
      <Article title={tCompareParties("title")}>
        <p className="mb-8 max-w-prose">{tCompareParties("description")}</p>
        <PartyComparison />
      </Article>
    </ScopedClientIntlProvider>
  );
}

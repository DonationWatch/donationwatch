import type { Metadata } from "next";

import { CONTACT_MAIL, IMPRINT } from "@donationwatch/core/utils/config";
import { LOCALES } from "@donationwatch/core/utils/locales";
import { isValidLocale } from "@donationwatch/core/utils/validate";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  Article,
  ArticleHeader,
  ArticleTitle,
} from "@/components/layout/article";
import { NonCountryRootLayout } from "@/components/layout/non-country-root-layout";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/imprint">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const tImprint = await getTranslations({
    locale: params.locale,
    namespace: "imprint",
  });

  return {
    robots: "noindex, nofollow",
    title: `${tImprint("title")} | DonationWatch`,
    alternates: generateAlternates("imprint"),
  };
}

export default async function Page(props: PageProps<"/[locale]/imprint">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;

  const tImprint = await getTranslations({ locale, namespace: "imprint" });

  return (
    <NonCountryRootLayout locale={locale}>
      <Article>
        <ArticleHeader>
          <ArticleTitle>{tImprint("title")}</ArticleTitle>
        </ArticleHeader>
        <div className="space-y-4">
          <p className="whitespace-pre">{IMPRINT}</p>
          <a
            href={`mailto:${CONTACT_MAIL}`}
            className="text-primary-700 dark:text-primary-400 inline-block underline hover:no-underline"
          >
            {CONTACT_MAIL}
          </a>
        </div>
      </Article>
    </NonCountryRootLayout>
  );
}

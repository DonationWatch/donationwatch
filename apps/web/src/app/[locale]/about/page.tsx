import type { Metadata } from "next";

import { CONTACT_MAIL } from "@donationwatch/core/utils/config";
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
  props: PageProps<"/[locale]/about">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const tAbout = await getTranslations({
    locale: params.locale,
    namespace: "about",
  });

  return {
    title: `${tAbout("title")} | DonationWatch`,
    description: tAbout("description.p0"),
    alternates: generateAlternates("about"),
  };
}

export default async function Page(props: PageProps<"/[locale]/about">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;

  const tAbout = await getTranslations({ locale, namespace: "about" });

  return (
    <NonCountryRootLayout locale={locale}>
      <Article>
        <ArticleHeader>
          <ArticleTitle>{tAbout("title")}</ArticleTitle>
        </ArticleHeader>
        <div className="space-y-4">
          <p>{tAbout("description.p0")}</p>
          <p>{tAbout("description.p1")}</p>
          <p>{tAbout("description.p2")}</p>
          <p>
            {tAbout("description.p3")} {tAbout("description.mail")}:{" "}
            <a
              href={`mailto:${CONTACT_MAIL}`}
              className="text-primary-700 dark:text-primary-400 inline-block underline hover:no-underline"
            >
              {CONTACT_MAIL}
            </a>
            .
          </p>
          <p>{tAbout("source")}</p>
        </div>
      </Article>
    </NonCountryRootLayout>
  );
}

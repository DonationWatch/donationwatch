import { notFound } from "next/navigation";

import { Article } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL, IMPRINT } from "../../../utils/config";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidLocale } from "../../../utils/validate";
import { getTranslations } from "../translations";

import type { Metadata } from "next";

export const dynamicParams = false;
export const dynamic = "error";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/imprint">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  const { locale } = params;

  const translations = await getTranslations(locale);

  return {
    robots: "noindex, nofollow",
    title: `${translations.imprint.title} | DonationWatch`,
    alternates: generateAlternates("imprint"),
  };
}

export default async function Page(props: PageProps<"/[locale]/imprint">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  const { locale } = params;

  const translations = await getTranslations(locale);

  return (
    <NonCountryRootLayout locale={locale} translations={translations}>
      <Article title={translations.imprint.title}>
        <div className="whitespace-pre">{IMPRINT}</div>
        <a
          href={`mailto:${CONTACT_MAIL}`}
          className="text-primary-700 dark:text-primary-400 hover:underline"
        >
          {CONTACT_MAIL}
        </a>
      </Article>
    </NonCountryRootLayout>
  );
}

import { notFound } from "next/navigation";

import { Article } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL } from "../../../utils/config";
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
  props: PageProps<"/[locale]/about">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  const { locale } = params;

  const translations = await getTranslations(locale);

  return {
    robots: "noindex, nofollow",
    title: `${translations.about.title} | DonationWatch`,
    alternates: generateAlternates("about"),
  };
}

export default async function Page(props: PageProps<"/[locale]/about">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  const { locale } = params;

  const translations = await getTranslations(locale);

  return (
    <NonCountryRootLayout locale={locale} translations={translations}>
      <Article
        title={translations.about.title}
        subtitle={
          <>
            <p>{translations.about.description.p0}</p>
            <p>{translations.about.description.p1}</p>
            <p>{translations.about.description.p2}</p>
            <p>
              {translations.about.description.p3}{" "}
              {translations.about.description.mail}:{" "}
              <a
                href={`mailto:${CONTACT_MAIL}`}
                className="text-primary-700 dark:text-primary-400 inline-block hover:underline"
              >
                {CONTACT_MAIL}
              </a>
              .
            </p>
            <p>{translations.about.source}</p>
          </>
        }
      />
    </NonCountryRootLayout>
  );
}

import { notFound } from "next/navigation";

import { Article, ArticleSection } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL } from "../../../utils/config";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidLocale } from "../../../utils/validate";
import { getTranslations, t } from "../translations";

import type { Metadata } from "next";

export const dynamicParams = false;
export const dynamic = "error";

const LAST_UPDATE = "2025-02-10";
const EFFECTIVE_DATE = "2025-02-10";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/privacy">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  const { locale } = params;

  const translations = await getTranslations(locale);

  return {
    robots: "noindex, nofollow",
    title: `${translations.privacy.title} | DonationWatch`,
    alternates: generateAlternates("privacy"),
  };
}

export default async function Page(props: PageProps<"/[locale]/privacy">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  const { locale } = params;

  const translations = await getTranslations(locale);

  return (
    <NonCountryRootLayout locale={locale} translations={translations}>
      <Article
        title={translations.privacy.title}
        subtitle={
          <div className="text-sm text-gray-500">
            <p>{t(translations.privacy.last_updated, { date: LAST_UPDATE })}</p>
            <p className="mt-1">
              {t(translations.privacy.effective_date, { date: EFFECTIVE_DATE })}
            </p>
          </div>
        }
      >
        <ArticleSection title={translations.privacy.data.title}>
          <p className="mb-4">{translations.privacy.data.p}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{translations.privacy.data.li0}</li>
            <li>{translations.privacy.data.li1}</li>
            <li>{translations.privacy.data.li2}</li>
            <li>{translations.privacy.data.li3}</li>
          </ul>
        </ArticleSection>

        {/* Cloudflare Section */}
        <ArticleSection title={translations.privacy.cf.title}>
          <p className="mb-4">{translations.privacy.cf.p}</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>{translations.privacy.cf.workers.summary}</li>
            <li>
              {translations.privacy.cf.analytics.summary}
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>{translations.privacy.cf.analytics.li0}</li>
                <li>{translations.privacy.cf.analytics.li1}</li>
              </ul>
            </li>
          </ol>
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            className="text-primary-700 dark:text-primary-400 mt-4 inline-block hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {translations.privacy.cf.link}
          </a>
        </ArticleSection>

        <ArticleSection title={translations.privacy.logs.title}>
          <p>{translations.privacy.logs.p}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{translations.privacy.logs.li0}</li>
            <li>{translations.privacy.logs.li1}</li>
            <li>{translations.privacy.logs.li2}</li>
          </ul>
          <p className="mt-2">{translations.privacy.logs.retention}</p>
        </ArticleSection>

        <ArticleSection title={translations.privacy.contact.title}>
          <p>
            {translations.privacy.contact.p} <br />
            <a
              href={`mailto:${CONTACT_MAIL}`}
              className="text-primary-700 dark:text-primary-400 hover:underline"
            >
              {CONTACT_MAIL}
            </a>
          </p>
        </ArticleSection>
      </Article>
    </NonCountryRootLayout>
  );
}

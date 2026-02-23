import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Article, ArticleSection } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL } from "../../../utils/config";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidLocale } from "../../../utils/validate";

import type { Metadata } from "next";

export const dynamicParams = false;

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
  setRequestLocale(params.locale);

  const t = await getTranslations({
    locale: params.locale,
    namespace: "privacy",
  });

  return {
    robots: "noindex, nofollow",
    title: `${t("title")} | DonationWatch`,
    alternates: generateAlternates("privacy"),
  };
}

export default async function Page(props: PageProps<"/[locale]/privacy">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <NonCountryRootLayout locale={locale}>
      <Article
        title={t("title")}
        subtitle={
          <div className="text-sm text-gray-500">
            <p>{t("last_updated", { date: LAST_UPDATE })}</p>
            <p className="mt-1">
              {t("effective_date", { date: EFFECTIVE_DATE })}
            </p>
          </div>
        }
      >
        <ArticleSection title={t("data.title")}>
          <p className="mb-4">{t("data.p")}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{t("data.li0")}</li>
            <li>{t("data.li1")}</li>
            <li>{t("data.li2")}</li>
            <li>{t("data.li3")}</li>
          </ul>
        </ArticleSection>

        {/* Cloudflare Section */}
        <ArticleSection title={t("cf.title")}>
          <p className="mb-4">{t("cf.p")}</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>{t("cf.workers.summary")}</li>
            <li>
              {t("cf.analytics.summary")}
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>{t("cf.analytics.li0")}</li>
                <li>{t("cf.analytics.li1")}</li>
              </ul>
            </li>
          </ol>
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            className="text-primary-700 dark:text-primary-400 mt-4 inline-block hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("cf.link")}
          </a>
        </ArticleSection>

        <ArticleSection title={t("logs.title")}>
          <p>{t("logs.p")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{t("logs.li0")}</li>
            <li>{t("logs.li1")}</li>
            <li>{t("logs.li2")}</li>
          </ul>
          <p className="mt-2">{t("logs.retention")}</p>
        </ArticleSection>

        <ArticleSection title={t("contact.title")}>
          <p>
            {t("contact.p")} <br />
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

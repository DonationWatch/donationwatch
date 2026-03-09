import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Article, ArticleSection } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL, IMPRINT } from "../../../utils/config";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidLocale } from "../../../utils/validate";

import type { Metadata } from "next";

export const dynamicParams = false;

const LAST_UPDATE = "2026-03-09";
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

  const tPrivacy = await getTranslations({
    locale: params.locale,
    namespace: "privacy",
  });

  return {
    robots: "noindex, nofollow",
    title: `${tPrivacy("title")} | DonationWatch`,
    alternates: generateAlternates("privacy"),
  };
}

export default async function Page(props: PageProps<"/[locale]/privacy">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;

  const tPrivacy = await getTranslations({ locale, namespace: "privacy" });

  return (
    <NonCountryRootLayout locale={locale}>
      <Article
        title={tPrivacy("title")}
        subtitle={
          <div className="text-sm text-gray-500">
            <p>{tPrivacy("last_updated", { date: LAST_UPDATE })}</p>
            <p className="mt-1">
              {tPrivacy("effective_date", { date: EFFECTIVE_DATE })}
            </p>
          </div>
        }
      >
        {/* Controller Section */}
        <ArticleSection title={tPrivacy("controller.title")}>
          <p className="mb-4">{tPrivacy("controller.p")}</p>
          <p className="whitespace-pre">{IMPRINT}</p>
          <a
            href={`mailto:${CONTACT_MAIL}`}
            className="text-primary-700 dark:text-primary-400 inline-block hover:underline"
          >
            {CONTACT_MAIL}
          </a>
        </ArticleSection>

        {/* Data Collection Section */}
        <ArticleSection title={tPrivacy("data.title")}>
          <p className="mb-4">{tPrivacy("data.p")}</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>{tPrivacy("data.li0")}</li>
            <li>{tPrivacy("data.li1")}</li>
            <li>{tPrivacy("data.li2")}</li>
          </ul>
        </ArticleSection>

        <ArticleSection title={tPrivacy("logs.title")}>
          <p>{tPrivacy("logs.p")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>{tPrivacy("logs.li0")}</li>
            <li>{tPrivacy("logs.li1")}</li>
            <li>{tPrivacy("logs.li2")}</li>
          </ul>
          <p className="mt-2">{tPrivacy("logs.retention")}</p>
        </ArticleSection>

        {/* Cloudflare Section */}
        <ArticleSection title={tPrivacy("cf.title")}>
          <p className="mb-4">{tPrivacy("cf.p")}</p>
          <p className="mb-4">{tPrivacy("cf.p2")}</p>
          <p className="mb-4">{tPrivacy("cf.p3")}</p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>{tPrivacy("cf.workers.summary")}</li>
            <li>{tPrivacy("cf.analytics.summary")}</li>
          </ol>
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            className="text-primary-700 dark:text-primary-400 mt-4 inline-block hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {tPrivacy("cf.link")}
          </a>
        </ArticleSection>

        <ArticleSection title={tPrivacy("user_rights.title")}>
          <p>{tPrivacy("user_rights.p")}</p>
        </ArticleSection>
      </Article>
    </NonCountryRootLayout>
  );
}

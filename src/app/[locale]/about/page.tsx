import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Article } from "@/components/layout/article";
import { NonCountryRootLayout } from "@/components/layout/non-country-root-layout";
import { CONTACT_MAIL } from "@/utils/config";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidLocale } from "@/utils/validate";

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
    robots: "noindex, nofollow",
    title: `${tAbout("title")} | DonationWatch`,
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
      <Article
        title={tAbout("title")}
        subtitle={
          <>
            <p>{tAbout("description.p0")}</p>
            <p>{tAbout("description.p1")}</p>
            <p>{tAbout("description.p2")}</p>
            <p>
              {tAbout("description.p3")} {tAbout("description.mail")}:{" "}
              <a
                href={`mailto:${CONTACT_MAIL}`}
                className="text-primary-700 dark:text-primary-400 inline-block hover:underline"
              >
                {CONTACT_MAIL}
              </a>
              .
            </p>
            <p>{tAbout("source")}</p>
          </>
        }
      />
    </NonCountryRootLayout>
  );
}

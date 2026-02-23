import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Article } from "../../../components/layout/article";
import { NonCountryRootLayout } from "../../../components/ui/non-country-root-layout";
import { CONTACT_MAIL, IMPRINT } from "../../../utils/config";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidLocale } from "../../../utils/validate";

import type { Metadata } from "next";

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
      <Article title={tImprint("title")}>
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

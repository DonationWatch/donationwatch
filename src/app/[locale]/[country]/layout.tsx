"use server";

import { notFound } from "next/navigation";

import { AppSidebar } from "../../../components/app-sidebar";
import { CountryFooter } from "../../../components/country-footer";
import { PageFooter } from "../../../components/page-footer";
import { PageHeader } from "../../../components/page-header";
import { SidebarInset } from "../../../components/ui/sidebar";
import { THUMBNAIL_PREFIX } from "../../../utils/config";
import { COUNTRIES, getCountryName } from "../../../utils/countries";
import { getCountryConfig } from "../../../utils/data/get-country-config";
import { baseOpenGraph, baseTwitter } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../utils/validate";
import { getTranslations, t } from "../translations";

import type { Metadata } from "next";

export async function generateStaticParams() {
  return [...COUNTRIES].map((country) => ({ country }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]">,
): Promise<Metadata> {
  const { locale, country } = await props.params;

  if (!isValidLocale(locale)) return notFoundMetadata;
  if (!isValidCountry(country)) return notFoundMetadata;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  const title = {
    template: `%s | DonationWatch`,
    default: `${t(translations.title, { country: getCountryName(countryConfig, translations) })} | DonationWatch`,
  };

  const imageUrl = `${THUMBNAIL_PREFIX}/${locale}/${country}/cover.png`;

  return {
    title,
    openGraph: baseOpenGraph({
      locale,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    }),
    twitter: baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    }),
  };
}

export default async function CountryRootLayout(
  props: LayoutProps<"/[locale]/[country]">,
) {
  const params = await props.params;

  if (!isValidCountry(params.country)) return notFound();
  if (!isValidLocale(params.locale)) return notFound();

  const { locale, country } = params;
  const { children } = props;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  return (
    <>
      <AppSidebar
        translations={translations}
        locale={locale}
        countryConfig={countryConfig}
      />
      <SidebarInset className="min-w-0 flex-1">
        <div className="flex min-h-screen flex-col lg:px-16">
          <PageHeader />
          <main className="relative flex grow flex-col dark:text-white">
            <div className="flex grow flex-col">{children}</div>
            <CountryFooter
              translations={translations}
              country={countryConfig}
              locale={locale}
            />
          </main>
          <PageFooter translations={translations} locale={locale} />
        </div>
      </SidebarInset>
    </>
  );
}

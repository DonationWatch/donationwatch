import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DonationFilterSheet } from "@/components/donations-filter/donation-filter-sheet";
import { CountryFooter } from "@/components/layout/country-footer";
import { DynamicAppSidebar as AppSidebar } from "@/components/layout/dynamic-app-sidebar";
import { PageFooter } from "@/components/layout/page-footer";
import { StickyFooter } from "@/components/layout/sticky-footer";
import { StickyHeader } from "@/components/layout/sticky-header";
import { CountryLayoutProviders } from "@/components/providers/country-layout-providers";
import { SidebarInset } from "@/components/ui/sidebar";
import { THUMBNAIL_PREFIX } from "@/utils/config";
import { COUNTRIES, getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { getParties } from "@/utils/loader/parties";
import { baseOpenGraph, baseTwitter } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

export async function generateStaticParams() {
  return [...COUNTRIES].map((country) => ({ country }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]">,
): Promise<Metadata> {
  const { locale, country } = await props.params;

  if (!isValidLocale(locale)) return notFoundMetadata;
  if (!isValidCountry(country)) return notFoundMetadata;
  setRequestLocale(locale);

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  const title = {
    template: `%s | DonationWatch`,
    default: `${t("title", { country: getCountryName(countryConfig, tCountries) })} | DonationWatch`,
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
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const { children } = props;

  const [messages, countryConfig, parties] = await Promise.all([
    getMessagesForLocale(locale),
    getCountryConfig(country),
    getParties(country),
  ]);
  const filterMessages = pick(messages, ["donation_type", "donor_type"]);

  return (
    <CountryLayoutProviders
      countryConfig={countryConfig}
      parties={parties}
      filterMessages={filterMessages}
    >
      <AppSidebar />
      <SidebarInset className="min-w-0 flex-1">
        <div className="flex min-h-screen flex-col lg:px-16">
          <StickyHeader />
          <div className="relative flex grow flex-col dark:text-white">
            <div className="flex grow flex-col">{children}</div>
            <CountryFooter
              country={country}
              locale={locale}
              source={countryConfig.source}
            />
          </div>
          <DonationFilterSheet />
          <PageFooter locale={locale} />
          <StickyFooter />
        </div>
      </SidebarInset>
    </CountryLayoutProviders>
  );
}

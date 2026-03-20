import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { Country, Currency } from "@/utils/countries";

import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import {
  Article,
  ArticleSection,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { DetectedCountry } from "@/components/layout/detected-country";
import { NonCountryRootLayout } from "@/components/layout/non-country-root-layout";
import { MetaCard } from "@/components/meta-card";
import { Translation } from "@/components/translation";
import { GITHUB_URL, THUMBNAIL_PREFIX } from "@/utils/config";
import { COUNTRIES, COUNTRY_CONFIG, getCountryName } from "@/utils/countries";
import { countryFlags } from "@/utils/country-flags";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { formatCompactCurrency, formatNumber } from "@/utils/formatter";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { LOCALES } from "@/utils/locales";
import { baseOpenGraph, baseTwitter, generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidLocale } from "@/utils/validate";

export const dynamicParams = false;
export const dynamic = "error";

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]">,
): Promise<Metadata> {
  const { locale } = await props.params;

  if (!isValidLocale(locale)) return notFoundMetadata;
  setRequestLocale(locale);

  const [t, tRoot] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "root" }),
  ]);
  const imageUrl = `${THUMBNAIL_PREFIX}/${locale}/cover.png`;

  return {
    title: `DonationWatch – ${tRoot("title")}`,
    description: t("description"),
    alternates: generateAlternates(""),
    openGraph: baseOpenGraph({
      locale,
      title: `DonationWatch – ${tRoot("title")}`,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    }),
    twitter: baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    }),
  };
}

export default async function RootPage(props: PageProps<"/[locale]">) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;
  const [t, tCountries, tRoot] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "root" }),
  ]);
  const countriesArray = [...COUNTRIES];

  const countryDatas = await Promise.all(
    countriesArray.map((country) =>
      Promise.all([
        country,
        getCountryConfig(country),
        getPartyYearsSums(country),
      ]),
    ),
  );

  const sumPerCountry: Partial<Record<Country, number>> = {};
  const currencyTotals: Partial<Record<Currency, number>> = {};
  const trackedCountries = countryDatas.length;
  let trackedParties = 0;
  let trackedDonations = 0;

  countryDatas.forEach(([, config, partyYearsSums]) => {
    trackedParties += config.parties.length;
    currencyTotals[config.currency] ??= 0;
    sumPerCountry[config.id] ??= 0;

    Object.entries(partyYearsSums).forEach(([, partyStats]) => {
      Object.values(partyStats).forEach((stats) => {
        trackedDonations += stats.count;
        currencyTotals[config.currency]! += stats.sum;
        sumPerCountry[config.id]! += stats.sum;
      });
    });
  });

  return (
    <NonCountryRootLayout locale={locale}>
      <AbsoluteMultipleColorsGradient
        colors={[{ color: "#3730a3", width: 100 }]}
      />

      <header
        aria-labelledby="hero-title"
        className="relative flex min-h-64 flex-row items-center justify-center p-4 pt-14 sm:py-10 sm:pt-20"
      >
        <div className="z-1 container mx-auto lg:text-center">
          <h1 className="mb-2 text-4xl font-bold sm:text-5xl" id="hero-title">
            DonationWatch
          </h1>
          <p className="mb-4 text-xl sm:text-2xl">{tRoot("title")}</p>
          <p className="mx-auto mb-4 text-base sm:text-lg lg:max-w-2xl">
            {tRoot("subtitle")}
          </p>
          <div className="flex justify-center">
            <div className="inline-block text-left">
              <DetectedCountry />
            </div>
          </div>
        </div>
      </header>

      <Article fullWidth skipTitleOffset>
        <ArticleSectionWrapper id="stats">
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <MetaCard
                    title={tRoot("stats.countries")}
                    value={formatNumber(locale, trackedCountries)}
                  />
                </div>
                <div className="text-center">
                  <MetaCard
                    title={tRoot("stats.parties")}
                    value={formatNumber(locale, trackedParties)}
                  />
                </div>
                <div className="text-center">
                  <MetaCard
                    title={tRoot("stats.donations")}
                    value={formatNumber(locale, trackedDonations)}
                  />
                </div>
                <div className="text-center">
                  <MetaCard
                    title={tRoot("stats.currencies")}
                    value={Object.keys(currencyTotals).length}
                  />
                </div>
              </div>
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>

        <ArticleSection title={tRoot("countries.title")} id="countries">
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {tRoot("countries.subtitle")}
          </p>
          <nav
            aria-label={t("header.country_selection")}
            className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:gap-4 2xl:grid-cols-5"
          >
            {countriesArray
              .toSorted((a, b) => {
                const nameA = getCountryName(COUNTRY_CONFIG[a], tCountries);
                const nameB = getCountryName(COUNTRY_CONFIG[b], tCountries);
                return nameA.localeCompare(nameB, locale);
              })
              .map((countryId) => {
                const config = COUNTRY_CONFIG[countryId];
                const countryName = getCountryName(config, tCountries);

                return (
                  <Link
                    prefetch={false}
                    key={countryId}
                    href={`/${locale}/${countryId}`}
                    className="group flex gap-2 rounded border border-gray-200 px-2 py-1 transition-colors hover:border-gray-300 hover:bg-gray-50 xl:p-2 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex w-8 shrink-0 items-center justify-center 2xl:w-16">
                      <Image
                        aria-hidden="true"
                        height={18}
                        className="max-h-full rounded-xs"
                        src={countryFlags[countryId]}
                        alt=""
                      />
                    </div>
                    <div className="grow overflow-hidden">
                      <div className="group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate text-sm font-medium xl:text-base">
                        {countryName}
                      </div>
                      <div className="text-xs text-slate-500 xl:text-sm dark:text-slate-300">
                        {formatCompactCurrency(
                          locale,
                          sumPerCountry[countryId] ?? 0,
                          config.currency,
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </nav>
        </ArticleSection>

        <ArticleSection title={tRoot("why.title")} id="why-transparency">
          <p className="text-gray-700 dark:text-gray-300">{tRoot("why.p0")}</p>
        </ArticleSection>

        <ArticleSection title={tRoot("open_source.title")} id="open-source">
          <p className="text-gray-700 dark:text-gray-300">
            <Translation
              text={tRoot.raw("open_source.p0")}
              variables={{
                github: (
                  <a
                    href={GITHUB_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 underline"
                  >
                    GitHub
                  </a>
                ),
              }}
            />
          </p>
        </ArticleSection>
      </Article>
    </NonCountryRootLayout>
  );
}

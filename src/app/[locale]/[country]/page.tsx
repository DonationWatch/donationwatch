import Link from "next/link";
import { notFound } from "next/navigation";

import { AbsoluteMultipleColorsGradient } from "../../../components/absolute-multiple-colors-gradient";
import { BiggestDonationsHero } from "../../../components/biggest-donations-hero";
import { DonationStackedYears } from "../../../components/chart/donation-stacked-years";
import { DetectedCountry } from "../../../components/detected-country";
import { DonorsHero } from "../../../components/donors-hero";
import { ExternalThanks } from "../../../components/external-thanks";
import { HistoryComponent } from "../../../components/history-component";
import { PartiesHero } from "../../../components/parties-hero";
import { YearsCards } from "../../../components/years-cards";
import { YearsHeader } from "../../../components/years-header";
import { COUNTRIES, getCountryName } from "../../../utils/countries";
import { getCountryConfig } from "../../../utils/data/get-country-config";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "../../../utils/formatter";
import { getBiggestDonors } from "../../../utils/loader/biggest-donors";
import { loadCountryData } from "../../../utils/loader/country-data-loaders";
import { getPartyYearsSums } from "../../../utils/loader/party-years-sums";
import { LOCALES } from "../../../utils/locales";
import { generateAlternates } from "../../../utils/meta";
import { notFoundMetadata } from "../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../utils/validate";
import { getTranslations, t } from "../translations";

import type { Metadata } from "next";

export const dynamicParams = false;
export const dynamic = "error";

export async function generateStaticParams() {
  return [...COUNTRIES].flatMap((country) =>
    LOCALES.map((locale) => ({ locale, country })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]">,
): Promise<Metadata> {
  const { country, locale } = await props.params;

  if (!isValidLocale(locale)) return notFoundMetadata;
  if (!isValidCountry(country)) return notFoundMetadata;

  return {
    alternates: generateAlternates(country),
  };
}

export default async function YearsPage(
  props: PageProps<"/[locale]/[country]">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();

  const { locale, country } = params;

  const [
    translations,
    countryConfig,
    partySums,
    biggestDonors,
    biggestDonations,
  ] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
    getPartyYearsSums(country),
    getBiggestDonors(country),
    loadCountryData(country, "biggestDonations"),
  ]);

  // Get years that actually have donations by checking partySums
  const yearsWithDonations = Object.entries(partySums)
    .filter(([, partyStats]) =>
      Object.values(partyStats).some((stat) => stat.sum > 0),
    )
    .toSorted(([a], [b]) => parseInt(b, 10) - parseInt(a, 10))
    .map(([year]) => year);

  const currentYear = yearsWithDonations[0];
  const previousYear = yearsWithDonations[1];

  return (
    <>
      <AbsoluteMultipleColorsGradient
        colors={[{ color: "#3730a3", width: 100 }]}
      />

      <section
        aria-labelledby="hero-label"
        className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_484px] relative flex min-h-75 flex-row items-center justify-end p-4 pt-14 sm:min-h-[350px] sm:py-10"
      >
        <div className="z-1 container mx-auto grid items-center max-lg:gap-10 lg:grid-cols-2 lg:gap-2">
          <div className="flex flex-col">
            <h1 className="mb-6 lg:mt-20">
              <div className="mb-2 flex items-center text-3xl font-bold">
                DonationWatch
              </div>
              <div className="text-lg sm:text-xl" id="hero-label">
                {t(translations.home.hero.subtitle, {
                  country: getCountryName(countryConfig, translations, true),
                })}
              </div>
            </h1>
            <div>
              <div className="lg:inline-block">
                <DetectedCountry country={countryConfig} />
              </div>
            </div>
          </div>
          <div className="">
            <section aria-labelledby="last-period-title">
              <YearsHeader
                className="card card--action"
                title={translations.home.last_period}
                idPrefix={"last-period-"}
                translations={translations}
                locale={locale}
                years={[`${currentYear}`]}
                country={countryConfig}
                partySums={partySums}
              />
            </section>
            {currentYear !== previousYear && previousYear ? (
              <Link
                aria-label={translations.home.previous_period}
                title={translations.home.previous_period}
                scroll={true}
                href={`/${locale}/${countryConfig.id}/${previousYear}/overview`}
                className="card card--action hover:text-primary-600 dark:hover:text-primary-400 mt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{previousYear}</span>
                  {formatCountryCurrency(
                    locale,
                    Object.values(partySums[previousYear]).reduce(
                      (all, stats) => all + stats.sum,
                      0,
                    ),
                    countryConfig,
                  )}
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section
        className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_512px] container mx-auto p-4 py-12 sm:py-24"
        aria-labelledby="home-what-title"
      >
        <div className="items-center space-y-4 lg:flex lg:space-x-4">
          <div className="lg:basis-1/2">
            <h2 className="mb-4 text-2xl" id="home-what-title">
              {translations.home.what.title}
            </h2>
            <p className="mb-4 whitespace-pre-wrap">
              {translations.home.what.summary}
            </p>
            <p className="mb-4 whitespace-pre-wrap">
              {translations.home.what.source[country]}
              <br />
              {countryConfig.knownPartyRequirements ? (
                <>
                  <br />
                  {t(translations.home.what.threshold, {
                    count: countryConfig.knownPartyRequirements.count,
                    sum: formatCompactCountryCurrency(
                      locale,
                      countryConfig.knownPartyRequirements.sum,
                      countryConfig,
                    ),
                  })}
                  <br />
                </>
              ) : null}
              <br />
              <a
                className="hover:text-primary-800 dark:hover:text-primary-400 underline"
                target="_blank"
                href={countryConfig.source.url}
                rel="noreferrer"
              >
                {translations.home.what.source_link}
              </a>
            </p>
          </div>
          {countryConfig.hasDate ? (
            <section
              aria-labelledby="home-most-recent-donations"
              className="flex items-center justify-center lg:basis-1/2"
            >
              <div className="card w-full">
                <h3 className="mb-2 px-2" id="home-most-recent-donations">
                  {translations.home.most_recent}
                </h3>
                <HistoryComponent country={countryConfig} />
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <section
        className="content-visibility-auto @container container mx-auto p-4 pb-12 sm:pb-24"
        aria-labelledby="year-donations-list"
      >
        <div className="text-primary-700 dark:text-primary-400 mb-2 text-lg">
          {translations.home.years.subtitle}
        </div>
        <h2 className="mb-6 text-2xl" id="year-donations-list">
          {translations.home.years.title}
        </h2>

        <div className="grid gap-8 @4xl:grid-cols-2">
          <DonationStackedYears
            country={countryConfig}
            partyYearsSums={partySums}
          />
          <div>
            <p className="mb-8 lg:text-lg">{translations.home.years.summary}</p>

            <YearsCards
              country={countryConfig}
              translations={translations}
              locale={locale}
              partyYearsSums={partySums}
            />
          </div>
        </div>
      </section>

      <section
        className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_512px] container mx-auto p-4 pb-12 sm:pb-24"
        aria-labelledby="home-parties-list"
      >
        <div className="text-primary-700 dark:text-primary-400 mb-2 text-lg">
          {translations.home.parties.subtitle}
        </div>
        <h2 className="mb-6 text-2xl" id="home-parties-list">
          {translations.home.parties.title}
        </h2>
        <p className="mb-8 lg:w-10/12 lg:text-lg">
          {translations.home.parties.summary}
        </p>

        <PartiesHero
          country={countryConfig}
          translations={translations}
          locale={locale}
        />
      </section>

      <section
        className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_508px] container mx-auto p-4 pb-12 sm:pb-24"
        aria-labelledby="home-donor-list"
      >
        <div className="text-primary-700 dark:text-primary-400 mb-2 text-lg">
          {translations.home.donors.subtitle}
        </div>
        <h2 className="mb-6 text-2xl" id="home-donor-list">
          {translations.home.donors.title}
        </h2>
        <p className="mb-8 lg:w-10/12 lg:text-lg">
          {t(translations.home.donors.summary, {
            minYear: countryConfig.minYear,
          })}
        </p>

        <DonorsHero
          country={countryConfig}
          locale={locale}
          biggestDonors={biggestDonors}
        />

        <BiggestDonationsHero
          locale={locale}
          translations={translations}
          country={countryConfig}
          biggestDonations={biggestDonations}
        />
      </section>

      {countryConfig.legislativeYears.length ? (
        <section
          className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_924px] @container container mx-auto p-4 pb-12 sm:pb-24"
          aria-labelledby="home-history-list"
        >
          <div className="text-primary-700 dark:text-primary-400 mb-2 text-lg">
            {translations.home.list.subtitle}
          </div>
          <h2 className="mb-6 text-2xl" id="home-history-list">
            {translations.home.list.title}
          </h2>
          <p className="mb-8 lg:w-10/12 lg:text-lg">
            {translations.home.list.summary}
          </p>

          <div className="grid gap-4 @3xl:grid-cols-2">
            {countryConfig.legislativeYears.map((years, idx) => (
              <YearsHeader
                className="card card--action"
                key={idx}
                country={countryConfig}
                idPrefix="list-"
                translations={translations}
                locale={locale}
                years={years}
                partySums={partySums}
              />
            ))}
          </div>
        </section>
      ) : null}

      <ExternalThanks
        translations={translations}
        country={countryConfig}
        locale={locale}
      />
    </>
  );
}

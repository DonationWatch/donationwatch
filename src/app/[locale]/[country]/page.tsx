import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AbsoluteMultipleColorsGradient } from "@/components/absolute-multiple-colors-gradient";
import {
  FormattedCompactCountryCurrency,
  FormattedCountryCurrency,
} from "@/components/browser-based-formatter";
import { DonationStackedYears } from "@/components/charts/donation-stacked-years";
import { BiggestDonationsHero } from "@/components/donations/biggest-donations-hero";
import { DonorsHero } from "@/components/donors/donors-hero";
import { ExternalThanks } from "@/components/external-thanks";
import { HistoryComponent } from "@/components/history-component";
import { DetectedCountry } from "@/components/layout/detected-country";
import { PartiesHero } from "@/components/parties/parties-hero";
import { Translation } from "@/components/translation";
import { YearsCards } from "@/components/years/years-cards";
import { YearsHeader } from "@/components/years/years-header";
import {
  COUNTRIES,
  getCountryName,
  getReferencingCountryName,
} from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { getBiggestDonors } from "@/utils/loader/biggest-donors";
import { loadCountryData } from "@/utils/loader/country-data-loaders";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

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
  setRequestLocale(locale);

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
  setRequestLocale(params.locale);

  const { locale, country } = params;

  const [
    tRefCountries,
    tHome,
    tCountries,
    countryConfig,
    partySums,
    biggestDonors,
    biggestDonations,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "ref_countries" }),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "countries" }),
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
                {tHome("hero.subtitle", {
                  country: getReferencingCountryName(
                    countryConfig,
                    tRefCountries,
                  ),
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
                title={tHome("last_period")}
                idPrefix={"last-period-"}
                locale={locale}
                years={[`${currentYear}`]}
                country={countryConfig}
                partySums={partySums}
              />
            </section>
            {currentYear !== previousYear && previousYear ? (
              <Link
                aria-label={tHome("previous_period")}
                title={tHome("previous_period")}
                scroll={true}
                href={`/${locale}/${countryConfig.id}/${previousYear}/overview`}
                className="card card--action hover:text-primary-600 dark:hover:text-primary-400 mt-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{previousYear}</span>
                  {
                    <FormattedCountryCurrency
                      country={countryConfig}
                      value={Object.values(partySums[previousYear]).reduce(
                        (all, stats) => all + stats.sum,
                        0,
                      )}
                    />
                  }
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
              {tHome("what.title")}
            </h2>
            <p className="mb-4 whitespace-pre-wrap">{tHome("what.summary")}</p>
            <p className="mb-4 whitespace-pre-wrap">
              {tHome(`what.source.${country}`)}
              <br />
              {countryConfig.knownPartyRequirements ? (
                <>
                  <br />
                  <Translation
                    t={tHome}
                    translationId="what.threshold"
                    variables={{
                      type:
                        countryConfig.knownPartyRequirements.count === -1
                          ? "sum"
                          : countryConfig.knownPartyRequirements.sum === -1
                            ? "count"
                            : "both",
                      count: countryConfig.knownPartyRequirements.count,
                      sum: (
                        <FormattedCompactCountryCurrency
                          country={countryConfig}
                          value={Math.max(
                            0,
                            countryConfig.knownPartyRequirements.sum,
                          )}
                        />
                      ),
                    }}
                  />
                  <br />
                </>
              ) : null}
              {!hasFeature(countryConfig, Features.Donors) ? (
                <>
                  <br />
                  {tHome("what.no_donors", {
                    country: getCountryName(countryConfig, tCountries),
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
                {tHome("what.source_link")}
              </a>
            </p>
          </div>
          {hasFeature(countryConfig, Features.Date) ? (
            <section
              aria-labelledby="home-most-recent-donations"
              className="flex items-center justify-center lg:basis-1/2"
            >
              <div className="card w-full">
                <h3 className="mb-2 px-2" id="home-most-recent-donations">
                  {tHome("most_recent")}
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
          {tHome("years.subtitle")}
        </div>
        <h2 className="mb-6 text-2xl" id="year-donations-list">
          {tHome("years.title")}
        </h2>

        <div className="grid gap-8 @4xl:grid-cols-2">
          <DonationStackedYears
            country={countryConfig}
            partyYearsSums={partySums}
          />
          <div>
            <p className="mb-8 lg:text-lg">{tHome("years.summary")}</p>

            <YearsCards
              country={countryConfig}
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
          {tHome("parties.subtitle")}
        </div>
        <h2 className="mb-6 text-2xl" id="home-parties-list">
          {tHome("parties.title")}
        </h2>
        <p className="mb-8 lg:w-10/12 lg:text-lg">{tHome("parties.summary")}</p>

        <PartiesHero country={countryConfig} locale={locale} />
      </section>

      {hasFeature(countryConfig, Features.Donors) ? (
        <section
          className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_508px] container mx-auto p-4 pb-12 sm:pb-24"
          aria-labelledby="home-donor-list"
        >
          <div className="text-primary-700 dark:text-primary-400 mb-2 text-lg">
            {tHome("donors.subtitle")}
          </div>
          <h2 className="mb-6 text-2xl" id="home-donor-list">
            {tHome("donors.title")}
          </h2>
          <p className="mb-8 lg:w-10/12 lg:text-lg">
            {tHome("donors.summary", {
              minYear: countryConfig.minYear,
            })}
          </p>

          <DonorsHero country={countryConfig} biggestDonors={biggestDonors} />

          <BiggestDonationsHero
            country={countryConfig}
            biggestDonations={biggestDonations}
          />
        </section>
      ) : null}

      {countryConfig.legislativeYears?.length ? (
        <section
          className="content-visibility-auto contain-intrinsic-size-[auto_1100px_auto_924px] @container container mx-auto p-4 pb-12 sm:pb-24"
          aria-labelledby="home-history-list"
        >
          <div className="text-primary-700 dark:text-primary-400 mb-2 text-lg">
            {tHome("list.subtitle")}
          </div>
          <h2 className="mb-6 text-2xl" id="home-history-list">
            {tHome("list.title")}
          </h2>
          <p className="mb-8 lg:w-10/12 lg:text-lg">{tHome("list.summary")}</p>

          <div className="grid gap-4 @3xl:grid-cols-2">
            {countryConfig.legislativeYears.map((years, idx) => (
              <YearsHeader
                className="card card--action"
                key={idx}
                country={countryConfig}
                idPrefix="list-"
                locale={locale}
                years={years}
                partySums={partySums}
              />
            ))}
          </div>
        </section>
      ) : null}

      <ExternalThanks country={countryConfig} locale={locale} />
    </>
  );
}

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
import { DynamicStackedPartyDonations } from "@/components/charts/dynamic-stacked-party-line";
import { partyYearsSumsToStackedConfig } from "@/components/charts/stacked-party-line-config";
import { BiggestDonationsHero } from "@/components/donations/biggest-donations-hero";
import { DonorsHero } from "@/components/donors/donors-hero";
import { ExternalThanks } from "@/components/external-thanks";
import { HistoryComponent } from "@/components/history-component";
import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import {
  ArticleSection,
  ArticleSectionTwoColumns,
  WideArticle,
} from "@/components/layout/article";
import { DetectedCountry } from "@/components/layout/detected-country";
import { OldDataWarning } from "@/components/old-data-warning";
import { PartiesHero } from "@/components/parties/parties-hero";
import { Translation } from "@/components/translation";
import { Card, cardVariants } from "@/components/ui/card";
import { YearsCards } from "@/components/years/years-cards";
import { UnfilteredYearsHeader } from "@/components/years/years-header";
import { PartyStatField } from "@/types/party-stats";
import { TOP_DONORS_TO_SHOW } from "@/utils/config";
import {
  COUNTRIES,
  getCountryName,
  getReferencingCountryName,
} from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { getBiggestDonors } from "@/utils/loader/biggest-donors";
import { loadCountryData } from "@/utils/loader/country-data-loaders";
import { getParties } from "@/utils/loader/parties";
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
    messages,
    parties,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "ref_countries" }),
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "countries" }),
    getCountryConfig(country),
    getPartyYearsSums(country),
    getBiggestDonors(country),
    loadCountryData(country, "biggestDonations"),
    getMessagesForLocale(locale),
    getParties(country),
  ]);

  // Get years that actually have donations by checking partySums
  const yearsWithDonations = Object.entries(partySums)
    .filter(([, partyStats]) =>
      Object.values(partyStats).some((stat) => stat[PartyStatField.Sum] > 0),
    )
    .toSorted(([a], [b]) => parseInt(b, 10) - parseInt(a, 10))
    .map(([year]) => year);

  const currentYear = yearsWithDonations[0];
  const previousYear = yearsWithDonations[1];

  const pageMessages = pick(messages, [
    "home",
    "biggest_donations",
    "countries",
    "ref_countries",
    "stacked_years",
    "chart",
  ]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
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
              <div className="mb-2 flex items-center text-3xl font-semibold tracking-tight">
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
            <div className="space-y-2">
              <div className="lg:inline-block">
                <OldDataWarning />
              </div>
              <div className="lg:inline-block">
                <DetectedCountry countryCode={countryConfig.code} />
              </div>
            </div>
          </div>
          <div className="">
            {currentYear ? (
              <section aria-labelledby="last-period-title">
                <UnfilteredYearsHeader
                  className={cardVariants({ variant: "action" })}
                  title={tHome("last_period")}
                  idPrefix={"last-period-"}
                  locale={locale}
                  years={[`${currentYear}`]}
                  country={countryConfig}
                  partySums={partySums}
                  parties={parties}
                >
                  <div className="h-2.5">
                    <DynamicStackedPartyDonations
                      years={[`${currentYear}`]}
                      partyYearsSums={partySums}
                    />
                  </div>
                </UnfilteredYearsHeader>
              </section>
            ) : null}
            {currentYear !== previousYear && previousYear ? (
              <Card
                variant="action"
                className="mt-2"
                render={
                  <Link
                    title={tHome("previous_period")}
                    scroll={true}
                    href={`/${locale}/${countryConfig.id}/${previousYear}/overview`}
                  />
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{previousYear}</span>
                  {
                    <FormattedCountryCurrency
                      value={Object.values(partySums[previousYear]).reduce(
                        (all, stats) => all + stats[PartyStatField.Sum],
                        0,
                      )}
                    />
                  }
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      <WideArticle>
        <ArticleSection title={tHome("what.title")} id="home-what-title">
          <ArticleSectionTwoColumns className="mb-0 items-center">
            <div className="min-w-0 space-y-4">
              <p className="whitespace-pre-wrap">{tHome("what.summary")}</p>
              <p className="whitespace-pre-wrap">
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
                  className="text-primary-700 dark:text-primary-400 underline hover:no-underline"
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
                className="flex min-w-0 items-center justify-center"
              >
                <Card className="w-full">
                  <h3
                    className="mb-2 px-2 text-base font-semibold"
                    id="home-most-recent-donations"
                  >
                    {tHome("most_recent")}
                  </h3>
                  <HistoryComponent country={countryConfig} />
                </Card>
              </section>
            ) : null}
          </ArticleSectionTwoColumns>
        </ArticleSection>

        <ArticleSection title={tHome("years.title")} id="year-donations-list">
          <div className="content-visibility-auto @container">
            <div className="grid gap-8 @4xl:grid-cols-2">
              <DonationStackedYears partyYearsSums={partySums} />
              <div className="space-y-4">
                <p>{tHome("years.summary")}</p>

                <YearsCards
                  country={countryConfig}
                  locale={locale}
                  partyYearsSums={partySums}
                />
              </div>
            </div>
          </div>
        </ArticleSection>

        <ArticleSection title={tHome("parties.title")} id="home-parties-list">
          <p>{tHome("parties.summary")}</p>

          <PartiesHero country={countryConfig} locale={locale} />
        </ArticleSection>

        {hasFeature(countryConfig, Features.Donors) ? (
          <ArticleSection title={tHome("donors.title")} id="home-donor-list">
            <p>
              {tHome("donors.summary", {
                minYear: countryConfig.minYear,
              })}
            </p>

            <DonorsHero
              country={countryConfig}
              biggestDonors={biggestDonors
                .slice(0, TOP_DONORS_TO_SHOW)
                .map((donor) => ({
                  id: donor.id,
                  name: donor.name,
                  sum: donor.sum,
                  stackedConfig: partyYearsSumsToStackedConfig(
                    countryConfig.years,
                    donor.partyYearSums,
                  ),
                }))}
            />

            <BiggestDonationsHero biggestDonations={biggestDonations} />
          </ArticleSection>
        ) : null}

        {countryConfig.legislativeYears?.length ? (
          <ArticleSection title={tHome("list.title")} id="home-history-list">
            <p>{tHome("list.summary")}</p>

            <div className="@container">
              <div className="grid gap-4 @3xl:grid-cols-2">
                {countryConfig.legislativeYears.map((years, idx) => {
                  return (
                    <UnfilteredYearsHeader
                      className={cardVariants({ variant: "action" })}
                      key={idx}
                      country={countryConfig}
                      idPrefix="list-"
                      locale={locale}
                      years={years}
                      partySums={partySums}
                      parties={parties}
                    >
                      <div className="h-2.5">
                        <DynamicStackedPartyDonations
                          years={years}
                          partyYearsSums={partySums}
                        />
                      </div>
                    </UnfilteredYearsHeader>
                  );
                })}
              </div>
            </div>
          </ArticleSection>
        ) : null}
      </WideArticle>

      <ExternalThanks country={countryConfig} locale={locale} />
    </ScopedClientIntlProvider>
  );
}

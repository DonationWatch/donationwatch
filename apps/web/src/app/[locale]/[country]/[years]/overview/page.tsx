import type { Country } from "@donationwatch/core/utils/countries";
import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { Metadata } from "next";

import { getCountryName } from "@donationwatch/core/utils/countries";
import {
  formatCompactCountryCurrency,
  formatYearsRange,
} from "@donationwatch/core/utils/formatter";
import { hasYearSums } from "@donationwatch/core/utils/party";
import { deserializeYears } from "@donationwatch/core/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
  isValidMetadataLocale,
} from "@donationwatch/core/utils/validate";
import { getPartiesSync } from "@donationwatch/data/config/parties";
import { getPartyYearsSums } from "@donationwatch/data/loader/party-years-sums";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { getPartiesByYears } from "@donationwatch/data/queries/get-parties-by-years";
import { getPartiesSum } from "@donationwatch/data/queries/get-parties-sum";
import { cardVariants } from "@donationwatch/ui/components/card";
import { cn } from "@donationwatch/ui/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DynamicStackedPartyDonations } from "@/components/charts/dynamic-stacked-party-line";
import {
  Article,
  ArticleHeader,
  ArticleLead,
  ArticleTitle,
} from "@/components/layout/article";
import { FilteredYearsCard } from "@/components/years/filtered-years-header";
import { generateAlternates, isCanonicalYearRange } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { YearsOverviewClientPage } from "./_components/years-overview-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/overview">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidMetadataLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const years = params.years;

  const [tCountries, tPageTitle, countryConfig, partyYearSums] =
    await Promise.all([
      getTranslations({ locale, namespace: "countries" }),
      getTranslations({ locale, namespace: "page_title" }),
      getCountryConfig(country),
      getPartyYearsSums(country),
    ]);

  const countryName = getCountryName(countryConfig, tCountries);
  const deserializedYears = deserializeYears(years);
  const yearRange = formatYearsRange(deserializedYears);
  const parties = getPartiesByYears(
    deserializedYears,
    getPartiesSync(countryConfig.id),
  );
  const { sum, count } = getPartiesSum(
    countryConfig,
    partyYearSums,
    parties,
    deserializedYears,
  );

  const description = tPageTitle("years.description", {
    year: yearRange,
    country: countryName,
    parties: parties.length,
    sum: formatCompactCountryCurrency(locale, sum, countryConfig),
    count,
    minAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
  });

  return {
    title: tPageTitle("years.overview", {
      year: yearRange,
      country: countryName,
    }),
    description,
    alternates: generateAlternates(`${country}/${years}/overview`),
    ...(!isCanonicalYearRange(deserializedYears, countryConfig)
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}

export default async function OverviewPage(props: {
  params: Promise<{
    locale: ConstLocale;
    years: string;
    country: Country;
  }>;
}) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale } = params;
  const years = deserializeYears(params.years);
  const [t, tCountries, countryConfig, partyYearSums] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getCountryConfig(params.country),
    getPartyYearsSums(params.country),
  ]);

  if (!hasYearSums(partyYearSums, years)) {
    const lastYearWithData = Object.entries(partyYearSums)
      .toReversed()
      .find(([, sums]) => Object.keys(sums).length > 0);

    return (
      <div className="grow">
        <Article>
          <ArticleHeader className="mt-0">
            <ArticleTitle>{t("years.no_data.title")}</ArticleTitle>
            <ArticleLead>
              <p>
                {t("years.no_data.summary", {
                  year: formatYearsRange(years),
                })}
                {lastYearWithData
                  ? " " +
                    t("years.no_data.last_year", {
                      year: lastYearWithData[0],
                    })
                  : null}
              </p>
            </ArticleLead>
          </ArticleHeader>
          {lastYearWithData ? (
            <FilteredYearsCard
              className={cn(cardVariants({ variant: "action" }), "mt-8")}
              idPrefix="list-"
              locale={locale}
              years={[lastYearWithData[0]]}
              partySums={partyYearSums}
            >
              <div className="h-2.5">
                <DynamicStackedPartyDonations
                  years={[lastYearWithData[0]]}
                  partyYearsSums={partyYearSums}
                />
              </div>
            </FilteredYearsCard>
          ) : null}
        </Article>
      </div>
    );
  }

  const parties = getPartiesByYears(years, getPartiesSync(countryConfig.id));

  return (
    <Article>
      <YearsOverviewClientPage
        country={params.country}
        years={years}
        parties={parties}
        partyYearSums={partyYearSums}
        sectionTitle={t("overview.detail.title")}
        summary={t("overview.detail.summary")}
        scatterTitle={t("overview.scatter.title")}
        scatterSummary={t("overview.scatter.summary")}
        scatterSubtitle={t("overview.scatter.subtitle", {
          country: getCountryName(countryConfig, tCountries),
          years: formatYearsRange(years),
        })}
      />
    </Article>
  );
}

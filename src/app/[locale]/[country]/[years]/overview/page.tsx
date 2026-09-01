import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { Country } from "@/utils/countries";
import type { ConstLocale } from "@/utils/locales";

import { DynamicStackedPartyDonations } from "@/components/charts/dynamic-stacked-party-line";
import { Article } from "@/components/layout/article";
import { cardVariants } from "@/components/ui/card";
import { FilteredYearsHeader } from "@/components/years/filtered-years-header";
import { getPartiesSync } from "@/config/parties";
import { cn } from "@/lib/utils";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getPartiesByYears } from "@/utils/data/get-parties-by-years";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import {
  formatCompactCountryCurrency,
  formatYearsRange,
} from "@/utils/formatter";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { hasYearSums } from "@/utils/party";
import { deserializeYears } from "@/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
  isValidMetadataLocale,
} from "@/utils/validate";

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
        <Article
          skipTitleOffset={true}
          title={t("years.no_data.title")}
          subtitle={
            <>
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
              {lastYearWithData ? (
                <FilteredYearsHeader
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
                </FilteredYearsHeader>
              ) : null}
            </>
          }
        />
      </div>
    );
  }

  const parties = getPartiesByYears(years, getPartiesSync(countryConfig.id));

  return (
    <Article fullWidth={true}>
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

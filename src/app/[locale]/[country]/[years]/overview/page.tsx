import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import type { Country } from "@/utils/countries";
import type { ConstLocale } from "@/utils/locales";

import { Article } from "@/components/layout/article";
import { YearsHeader } from "@/components/years/years-header";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getParties } from "@/utils/data/get-parties";
import { getPartiesSum } from "@/utils/data/get-parties-sum";
import {
  formatCompactCountryCurrency,
  formatYearsRange,
} from "@/utils/formatter";
import {
  getPartyYearsSums,
  hasYearSums,
} from "@/utils/loader/party-years-sums";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { deserializeYears } from "@/utils/serializers";
import { isValidCountry, isValidLocale } from "@/utils/validate";

import { YearsOverviewClientPage } from "./_components/years-overview-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/overview">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
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
  const parties = getParties(countryConfig, deserializedYears);
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
                <YearsHeader
                  className="card card--action mt-8"
                  country={countryConfig}
                  idPrefix="list-"
                  locale={locale}
                  years={[lastYearWithData[0]]}
                  partySums={partyYearSums}
                />
              ) : null}
            </>
          }
        />
      </div>
    );
  }

  const parties = getParties(countryConfig, years);

  return (
    <Article fullWidth={true}>
      <YearsOverviewClientPage
        country={countryConfig}
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

import type { Metadata } from "next";

import { getCountryName } from "@donationwatch/core/utils/countries";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
import { formatYearsRange } from "@donationwatch/core/utils/formatter";
import {
  canShowYearsTimeline,
  hasYearSums,
  yearPartiesHaveYearOnlyDonations,
} from "@donationwatch/core/utils/party";
import { deserializeYears } from "@donationwatch/core/utils/serializers";
import {
  isValidCountry,
  isValidLocale,
} from "@donationwatch/core/utils/validate";
import { getParties } from "@donationwatch/data/loader/parties";
import { getPartyYearsSums } from "@donationwatch/data/loader/party-years-sums";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { getPartiesByYears } from "@donationwatch/data/queries/get-parties-by-years";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound, redirect } from "next/navigation";

import { Article } from "@/components/layout/article";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { YearsTimelineClientPage } from "./_components/years-timeline-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const [t, tCountries, tPageTitle, countryConfig, partySums] =
    await Promise.all([
      getTranslations({ locale: params.locale }),
      getTranslations({ locale: params.locale, namespace: "countries" }),
      getTranslations({ locale: params.locale, namespace: "page_title" }),
      getCountryConfig(country),
      getPartyYearsSums(country),
    ]);
  const years = deserializeYears(params.years);

  if (!canShowYearsTimeline(countryConfig, partySums, years)) {
    return notFoundMetadata;
  }

  if (!hasYearSums(partySums, years)) {
    return redirect(
      `/${params.locale}/${params.country}/${params.years}/overview`,
    );
  }

  const yearsRange = formatYearsRange(years);
  const countryName = getCountryName(countryConfig, tCountries);
  const description = t("timeline.description", {
    years: yearsRange,
    country: countryName,
  });

  return {
    title: tPageTitle("years.timeline", {
      year: formatYearsRange(years),
      country: getCountryName(countryConfig, tCountries),
    }),
    description,
    alternates: generateAlternates(`${country}/${params.years}/timeline`),
    robots: {
      index: false,
      follow: true,
    },
  };
}
export default async function TimelinePage(
  props: PageProps<"/[locale]/[country]/[years]/timeline">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const years = deserializeYears(params.years);
  const [t, tCountries, countryConfig, partyYearSums, allParties] =
    await Promise.all([
      getTranslations({ locale: params.locale }),
      getTranslations({ locale: params.locale, namespace: "countries" }),
      getCountryConfig(params.country),
      getPartyYearsSums(params.country),
      getParties(params.country),
    ]);

  if (!canShowYearsTimeline(countryConfig, partyYearSums, years)) {
    return notFound();
  }

  const hasYearOnlyDonations = yearPartiesHaveYearOnlyDonations(
    partyYearSums,
    years,
  );

  const parties = getPartiesByYears(years, allParties);

  const resolution =
    !hasYearOnlyDonations && hasFeature(countryConfig, Features.Date)
      ? "month"
      : "year";
  const chartStrings =
    resolution === "month"
      ? {
          title: "per_month.title" as const,
          subtitle: "per_month.subtitle" as const,
          description: "per_month.description" as const,
        }
      : {
          title: "per_year.title" as const,
          subtitle: "per_year.subtitle" as const,
          description: "per_year.description" as const,
        };

  return (
    <Article>
      <YearsTimelineClientPage
        years={years}
        parties={parties}
        resolution={resolution}
        timelineTitle={t("timeline.detail.title")}
        timelineSummary={t("timeline.detail.summary")}
        sumChartTitle={t("years.title")}
        sumChartSubtitle={t("years.subtitle", {
          country: getCountryName(countryConfig, tCountries),
          years: formatYearsRange(years),
        })}
        perMonthTitle={t(chartStrings.title)}
        perMonthDescription={t(chartStrings.description)}
        perMonthSubtitle={t(chartStrings.subtitle, {
          country: getCountryName(countryConfig, tCountries),
          years: formatYearsRange(years),
        })}
        yearResolutionNote={t("timeline.year_resolution_note")}
      />
    </Article>
  );
}

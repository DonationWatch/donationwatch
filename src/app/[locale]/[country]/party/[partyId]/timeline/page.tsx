import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Article } from "@/components/layout/article";
import { PartyField } from "@/types/party";
import { getCountryName, getParty } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { formatYearsRange } from "@/utils/formatter";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale, isValidParty } from "@/utils/validate";

import { PartyTimelineClientPage } from "./_components/party-timeline-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [t, tCountries, tPageTitle, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getTranslations({ locale: params.locale, namespace: "page_title" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;
  const party = getParty(countryConfig, partyId);

  return {
    title: tPageTitle("party.timeline", {
      party: party[PartyField.Short],
      country: getCountryName(countryConfig, tCountries),
    }),
    description: t("party.timeline.detail.summary", {
      party: party[PartyField.Short],
    }),
    alternates: generateAlternates(`${country}/party/${partyId}/timeline`),
  };
}
export default async function TimelinePage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale, country, partyId } = params;

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);

  if (!party) {
    return notFound();
  }

  return (
    <Article fullWidth={true}>
      <PartyTimelineClientPage
        country={countryConfig}
        party={party}
        timelineTitle={t("party.timeline.detail.title", {
          party: party[PartyField.Short],
        })}
        timelineSummary={t("party.timeline.detail.summary", {
          party: party[PartyField.Short],
        })}
        chartTitle={t("party.timeline.chart_title", {
          party: party[PartyField.Short],
        })}
        chartSubtitle={t("party.timeline.subtitle", {
          party: party[PartyField.Short],
          country: getCountryName(countryConfig, tCountries),
        })}
        perYearTitle={t("per_year_party.title", {
          party: party[PartyField.Short],
        })}
        perYearSubtitle={t("per_year_party.subtitle", {
          country: getCountryName(countryConfig, tCountries),
          years: formatYearsRange(countryConfig.years),
          party: party[PartyField.Short],
        })}
      />
    </Article>
  );
}

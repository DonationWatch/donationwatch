import type { Metadata } from "next";

import { PartyField } from "@donationwatch/core/types/party";
import { getCountryName } from "@donationwatch/core/utils/countries";
import { formatYearsRange } from "@donationwatch/core/utils/formatter";
import { getPartyFullAndShortName } from "@donationwatch/core/utils/party";
import { getParty } from "@donationwatch/data/config/parties";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import {
  isValidCountry,
  isValidLocale,
  isValidParty,
} from "@donationwatch/data/queries/validate";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Article } from "@/components/layout/article";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { PartyTimelineClientPage } from "./_components/party-timeline-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [tCountries, tPageTitle, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getTranslations({ locale: params.locale, namespace: "page_title" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;
  const party = getParty(countryConfig.id, partyId);
  const partyDisplayName = getPartyFullAndShortName(party);

  const countryName = getCountryName(countryConfig, tCountries);

  return {
    title: tPageTitle("party.timeline", {
      party: partyDisplayName,
      country: countryName,
    }),
    description: tPageTitle("party.timeline_description", {
      party: partyDisplayName,
      country: countryName,
    }),
    alternates: generateAlternates(`${country}/party/${partyId}/timeline`),
    robots: {
      index: false,
      follow: true,
    },
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
  const party = getParty(countryConfig.id, partyId);

  if (!party) {
    return notFound();
  }

  return (
    <Article>
      <PartyTimelineClientPage
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

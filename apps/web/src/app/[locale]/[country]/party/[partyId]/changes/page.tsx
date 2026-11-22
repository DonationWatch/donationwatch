import type { Metadata } from "next";

import { PartyField } from "@donationwatch/core/types/party";
import { getCountryName } from "@donationwatch/core/utils/countries";
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

import { PartyChangesClientPage } from "./_components/party-changes-client-page";

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
    title: tPageTitle("party.changes", {
      party: partyDisplayName,
      country: countryName,
    }),
    description: tPageTitle("party.changes_description", {
      party: partyDisplayName,
      country: countryName,
    }),
    alternates: generateAlternates(`${country}/party/${partyId}/changes`),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ChangesPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [t, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();

  const party = getParty(countryConfig.id, partyId);

  return (
    <Article>
      <PartyChangesClientPage
        party={party}
        title={t("party.changes.detail.title", {
          party: party[PartyField.Short],
        })}
        summary={t("party.changes.detail.summary", {
          party: party[PartyField.Short],
        })}
      />
    </Article>
  );
}

import type { Metadata } from "next";

import { getCountryName } from "@donationwatch/core/utils/countries";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
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

import { notFoundMetadata } from "@/utils/not-found-metadata";

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]/origin">,
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
    title: tPageTitle("party.origin", {
      party: partyDisplayName,
      country: countryName,
    }),
    description: tPageTitle("party.origin_description", {
      party: partyDisplayName,
      country: countryName,
    }),
  };
}

export default async function OriginLayout(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]/origin">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country } = params;

  const { children } = props;

  const countryConfig = await getCountryConfig(country);

  if (!hasFeature(countryConfig, Features.Origin)) {
    return notFound();
  }

  return children;
}

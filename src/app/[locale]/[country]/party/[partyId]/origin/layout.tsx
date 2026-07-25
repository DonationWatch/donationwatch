import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { getParty } from "@/config/parties";
import { PartyField } from "@/types/party";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale, isValidParty } from "@/utils/validate";

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]/origin">,
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
  const party = getParty(countryConfig.id, partyId);

  return {
    title: tPageTitle("party.origin", {
      party: party[PartyField.Short],
      country: getCountryName(countryConfig, tCountries),
    }),
    description: t("origin.detail.description", {
      party: party[PartyField.Short],
      country: getCountryName(countryConfig, tCountries),
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

  const [countryConfig] = await Promise.all([getCountryConfig(country)]);

  if (!hasFeature(countryConfig, Features.Origin)) {
    return notFound();
  }

  return children;
}

"use server";

import { notFound, redirect } from "next/navigation";

import { getParty, getCountryName } from "../../../../../../utils/countries";
import { getCountryConfig } from "../../../../../../utils/data/get-country-config";
import { notFoundMetadata } from "../../../../../../utils/not-found-metadata";
import {
  isValidCountry,
  isValidLocale,
  isValidParty,
} from "../../../../../../utils/validate";
import { getTranslations, t } from "../../../../translations";

import type { Metadata } from "next";

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]/origin">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { locale, country, partyId } = params;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;
  const party = getParty(countryConfig, partyId);

  return {
    title: `${t(translations.page_title.party.origin, {
      party: party.short,
      country: getCountryName(countryConfig, translations),
    })}`,
    description: t(translations.origin.detail.description, {
      party: party.short,
      country: getCountryName(countryConfig, translations),
    }),
  };
}

export default async function OriginLayout(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]/origin">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();

  const { country } = params;

  const { children } = props;

  const [countryConfig] = await Promise.all([getCountryConfig(country)]);

  if (!countryConfig.hasOrigin) {
    return redirect("/not-found");
  }

  return children;
}

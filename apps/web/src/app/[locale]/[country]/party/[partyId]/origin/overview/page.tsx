import type { Metadata } from "next";

import { getParty } from "@donationwatch/data/config/parties";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import {
  isValidCountry,
  isValidLocale,
  isValidParty,
} from "@donationwatch/data/queries/validate";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { generateAlternates } from "@/utils/meta";

import { PartyOriginClientPage } from "./_components/party-origin-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/origin/overview">,
): Promise<Metadata> {
  const params = await props.params;

  const { country, partyId } = params;

  return {
    alternates: generateAlternates(
      `${country}/party/${partyId}/origin/overview`,
    ),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function OverviewPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/origin/overview">,
) {
  const params = await props.params;

  const { country, partyId } = params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(country)) return notFound();
  setRequestLocale(params.locale);

  const countryConfig = await getCountryConfig(country);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig.id, partyId);
  const years = countryConfig.years;

  if (!party) {
    return notFound();
  }

  return <PartyOriginClientPage party={party} years={years} />;
}

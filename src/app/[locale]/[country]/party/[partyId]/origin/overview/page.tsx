import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DonationPartyOrigin } from "@/components/donations/donation-origin";
import { getParty } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { generateAlternates } from "@/utils/meta";
import { isValidCountry, isValidLocale, isValidParty } from "@/utils/validate";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/origin/overview">,
): Promise<Metadata> {
  const params = await props.params;

  const { country, partyId } = params;

  return {
    alternates: generateAlternates(
      `${country}/party/${partyId}/origin/overview`,
    ),
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

  const [countryConfig] = await Promise.all([getCountryConfig(country)]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);
  const years = countryConfig.years;

  if (!party) {
    return notFound();
  }

  return (
    <DonationPartyOrigin country={countryConfig} party={party} years={years} />
  );
}

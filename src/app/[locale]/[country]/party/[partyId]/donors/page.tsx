import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Article } from "@/components/layout/article";
import { PartyField } from "@/types/party";
import { getCountryName, getParty } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { formatCompactCountryCurrency } from "@/utils/formatter";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import {
  isValidCountry,
  isValidLocale,
  isValidMetadataLocale,
  isValidParty,
} from "@/utils/validate";

import { PartyDonorsClientPage } from "./_components/party-donors-client-page";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/donors">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidMetadataLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country, partyId } = params;

  const [tCountries, tPageTitle, countryConfig, partySums] = await Promise.all([
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "page_title" }),
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;

  const party = getParty(countryConfig, partyId);

  let sum = 0;
  let count = 0;

  for (const partySum of Object.values(partySums)) {
    for (const [party, yearSum] of Object.entries(partySum)) {
      if (party !== partyId) continue;

      sum += yearSum.sum;
      count += yearSum.count;
    }
  }

  const description = tPageTitle("party.description", {
    year: countryConfig.minYear,
    party: party[PartyField.Short],
    count,
    minimumAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
    sum: formatCompactCountryCurrency(locale, sum, countryConfig),
    country: getCountryName(countryConfig, tCountries),
  });

  return {
    title: tPageTitle("party.donors", {
      party: party[PartyField.Short],
      country: getCountryName(countryConfig, tCountries),
    }),
    description,
    alternates: generateAlternates(`${country}/party/${partyId}/donors`),
  };
}

export default async function DonorPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/donors">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);

  return (
    <Article fullWidth={true}>
      <PartyDonorsClientPage
        country={countryConfig}
        party={party}
        treemapTitle={t("party.donors.title", {
          party: party[PartyField.Short],
        })}
        treemapSubtitle={t("party.donors.subtitle", {
          party: party[PartyField.Short],
          country: getCountryName(countryConfig, tCountries),
        })}
        donorTypesTitle={t("party.donor_types.title")}
        donorTypesTreemapTitle={t("party.donor_types.treemap.title", {
          party: party[PartyField.Short],
        })}
        donorTypesTreemapSubtitle={t("party.donor_types.treemap.description", {
          party: party[PartyField.Short],
          country: getCountryName(countryConfig, tCountries),
        })}
        listTitle={t("party.donor_list.title", {
          party: party[PartyField.Short],
        })}
        listP0={t("party.donor_list.p0", {
          party: party[PartyField.Short],
          country: getCountryName(countryConfig, tCountries),
        })}
      />
    </Article>
  );
}

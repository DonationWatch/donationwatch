import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Article } from "@/components/layout/article";
import { getParty } from "@/config/parties";
import { PartyField } from "@/types/party";
import { PartyStatField } from "@/types/party-stats";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getDonorName } from "@/utils/donor";
import { Features, hasFeature } from "@/utils/features";
import { formatCompactCountryCurrency } from "@/utils/formatter";
import { getPartyDonorStats } from "@/utils/loader/party-donor-stats";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { getPartyFullAndShortName } from "@/utils/party";
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

  const [
    t,
    tCommon,
    tCountries,
    tPageTitle,
    countryConfig,
    partySums,
    partyDonorStats,
  ] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "page_title" }),
    getCountryConfig(country),
    getPartyYearsSums(country),
    getPartyDonorStats(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;

  const party = getParty(countryConfig.id, partyId);
  const partyDisplayName = getPartyFullAndShortName(party);

  let sum = 0;
  let count = 0;

  for (const partySum of Object.values(partySums)) {
    for (const [party, yearSum] of Object.entries(partySum)) {
      if (party !== partyId) continue;

      sum += yearSum[PartyStatField.Sum];
      count += yearSum[PartyStatField.Count];
    }
  }

  const baseDescription = tPageTitle("party.description", {
    year: countryConfig.minYear,
    party: partyDisplayName,
    count,
    minimumAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
    sum: formatCompactCountryCurrency(locale, sum, countryConfig),
    country: getCountryName(countryConfig, tCountries),
  });

  const topDonors = hasFeature(countryConfig, Features.Donors)
    ? (partyDonorStats[partyId]?.topDonors.slice(0, 3) ?? [])
    : [];
  const topDonorsSentence =
    topDonors.length > 0
      ? ` ${t("party.qa.top_donors.a", {
          party: party[PartyField.Short],
          donors: topDonors
            .map(
              (d) =>
                `${getDonorName(d.name, tCommon)} (${formatCompactCountryCurrency(locale, d.sum, countryConfig)})`,
            )
            .join(", "),
        })}`
      : "";

  const description = `${baseDescription}${topDonorsSentence}`;

  return {
    title: tPageTitle("party.donors", {
      party: partyDisplayName,
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

  const [t, tCountries, countryConfig, partyDonorStats] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(country),
    getPartyDonorStats(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig.id, partyId);

  return (
    <Article fullWidth={true}>
      <PartyDonorsClientPage
        party={party}
        ssrStats={partyDonorStats[partyId] ?? null}
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
        donationTypesTitle={t("party.donation_types.title")}
        donationTypesTreemapTitle={t("party.donation_types.treemap.title", {
          party: party[PartyField.Short],
        })}
        donationTypesTreemapSubtitle={t(
          "party.donation_types.treemap.description",
          {
            party: party[PartyField.Short],
            country: getCountryName(countryConfig, tCountries),
          },
        )}
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

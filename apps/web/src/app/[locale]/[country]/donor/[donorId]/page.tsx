import type { ReceiverId } from "@donationwatch/core/utils/types";
import type { Metadata } from "next";

import { PartyField } from "@donationwatch/core/types/party";
import { BASE_URL, THUMBNAIL_PREFIX } from "@donationwatch/core/utils/config";
import { getCountryName } from "@donationwatch/core/utils/countries";
import { getDonationDonorName } from "@donationwatch/core/utils/donor";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
import { formatCompactCountryCurrency } from "@donationwatch/core/utils/formatter";
import { DonationField, DonorType } from "@donationwatch/core/utils/types";
import {
  isValidCountry,
  isValidLocale,
  isValidMetadataLocale,
} from "@donationwatch/core/utils/validate";
import { getParty } from "@donationwatch/data/config/parties";
import { getBiggestDonors } from "@donationwatch/data/loader/biggest-donors";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import {
  getDonationsByDonorId,
  getDonorMeta,
} from "@donationwatch/data/queries/server-loaders";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import { PageWithToc } from "@/components/layout/article";
import { DonorSchema } from "@/components/schema";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { baseOpenGraph, baseTwitter, generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";

import { DonorClientPage } from "./donor-client-page";
import { DonorPageHead } from "./donor-page-head";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/donor/[donorId]">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidMetadataLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const donorId = params.donorId;

  const [
    tCountries,
    tPageTitle,
    countryConfig,
    donations,
    biggestDonors,
    donorMeta,
    tCommon,
  ] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getTranslations({ locale: params.locale, namespace: "page_title" }),
    getCountryConfig(country),
    getDonationsByDonorId(country, donorId),
    getBiggestDonors(country),
    getDonorMeta(country, donorId),
    getTranslations({ locale: params.locale, namespace: "common" }),
  ]);

  if (!donations?.length) {
    return notFoundMetadata;
  }

  const donorType = donations[0][DonationField.DonorType];
  const donorName = getDonationDonorName(donations[0], tCommon);

  let count = 0;
  let sum = 0;
  const partySums: Record<string, number> = {};

  for (const donation of donations) {
    count++;
    sum += donation[DonationField.Amount];
    const receiver = donation[DonationField.Receiver];
    partySums[receiver] =
      (partySums[receiver] ?? 0) + donation[DonationField.Amount];
  }

  const sortedPartyEntries = (
    Object.entries(partySums) as [ReceiverId, number][]
  ).toSorted(([, a], [, b]) => b - a);
  const topRecipientsText = sortedPartyEntries
    .slice(0, 3)
    .map(([partyId, partySum]) => {
      const party = getParty(countryConfig.id, partyId);
      const shortName = party ? party[PartyField.Short] : partyId;
      return `${shortName} (${formatCompactCountryCurrency(locale, partySum, countryConfig)})`;
    })
    .join(", ");

  const baseDescription = tPageTitle("donor.description", {
    country: getCountryName(countryConfig, tCountries),
    donor: donorName,
    count,
    sum: formatCompactCountryCurrency(locale, sum, countryConfig),
    minYear: countryConfig.minYear,
    parties: sortedPartyEntries.length,
  });

  const description = topRecipientsText
    ? `${baseDescription} ${tCommon("donated_to", { recipient: topRecipientsText })}.`
    : baseDescription;

  const isBiggestDonor = biggestDonors.some((donor) => donor.id === donorId);
  const hasWiki = Boolean(donorMeta.wiki);
  const imageUrl = `${THUMBNAIL_PREFIX}/${locale}/${country}/donors/${donorId}.png`;

  const metadata: Metadata = {
    title: tPageTitle("donor.overview", {
      donor: donorName,
      country: getCountryName(countryConfig, tCountries),
    }),
    description,
    alternates: generateAlternates(`${country}/donor/${donorId}`),
  };

  if (
    (isBiggestDonor || hasWiki) &&
    // only add images if the country has no donors
    hasFeature(countryConfig, Features.Donors)
  ) {
    // add rich metadata for biggest donors and donors with wiki as these have pregenerated images
    metadata.openGraph = baseOpenGraph({
      locale,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    });
    metadata.twitter = baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    });
  }

  if (!isBiggestDonor && !hasWiki) {
    // donors that aren't part of the biggest donors and don't have a wiki page aren't indexed individually
    metadata.robots = {
      index: false,
    };
  }

  if (donorType === DonorType.AnonymizedDonor) {
    // anonymized donors are never indexed
    metadata.robots = {
      index: false,
    };
  }

  return metadata;
}

export default async function DonorPageLayout(
  props: PageProps<"/[locale]/[country]/donor/[donorId]">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const [donations, donorMeta, messages, tCommon] = await Promise.all([
    getDonationsByDonorId(params.country, params.donorId),
    getDonorMeta(params.country, params.donorId),
    getMessagesForLocale(params.locale),
    getTranslations({ locale: params.locale, namespace: "common" }),
  ]);

  if (!donations?.length) {
    return notFound();
  }

  const donorType = donations[0][DonationField.DonorType];
  const donorName = getDonationDonorName(donations[0], tCommon);
  const isPerson = donorType === DonorType.Individual;
  const canonicalUrl = `${BASE_URL}/${params.locale}/${params.country}/donor/${params.donorId}`;
  const sameAs = donorMeta.wiki
    ? [`https://en.wikipedia.org/wiki/Special:Redirect/page/${donorMeta.wiki}`]
    : undefined;

  const pageMessages = pick(messages, [
    "donor",
    "biggest_donations",
    "countries",
    "data",
    "chart",
    "sort",
    "common",
    "search",
    "donor_type",
    "years",
    "donation_type",
    "changes",
    "state",
    "related",
    "interests",
    "party",
  ]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
      {donorType !== DonorType.AnonymizedDonor && (
        <DonorSchema
          name={donorName}
          url={canonicalUrl}
          isPerson={isPerson}
          sameAs={sameAs}
        />
      )}
      <PageWithToc tocTitle={donorName}>
        <DonorPageHead
          donorId={params.donorId}
          country={params.country}
          donorMeta={donorMeta}
          initialDonations={donations}
        />
        <DonorClientPage
          donorId={params.donorId}
          initialDonations={donations}
        />
      </PageWithToc>
    </ScopedClientIntlProvider>
  );
}

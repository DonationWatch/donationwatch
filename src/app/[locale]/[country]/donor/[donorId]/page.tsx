import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import { THUMBNAIL_PREFIX } from "@/utils/config";
import { getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import {
  getDonationsByDonorId,
  getDonorMeta,
} from "@/utils/data/server-loaders";
import { getDonationDonorName } from "@/utils/donor";
import { Features, hasFeature } from "@/utils/features";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "@/utils/formatter";
import { getMessagesForLocale } from "@/utils/i18n-loader";
import { pick } from "@/utils/i18n-pick";
import { getBiggestDonors } from "@/utils/loader/biggest-donors";
import { baseOpenGraph, baseTwitter, generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { DonationField, DonorType } from "@/utils/types";
import {
  isValidCountry,
  isValidLocale,
  isValidMetadataLocale,
} from "@/utils/validate";

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
    tCommon,
  ] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getTranslations({ locale: params.locale, namespace: "page_title" }),
    getCountryConfig(country),
    getDonationsByDonorId(country, donorId),
    getBiggestDonors(country),
    getTranslations({ locale: params.locale, namespace: "common" }),
  ]);

  if (!donations?.length) {
    return notFoundMetadata;
  }

  const donorType = donations[0][DonationField.DonorType];
  const donorName = getDonationDonorName(donations[0], tCommon);

  let count = 0;
  let sum = 0;
  const parties = new Set<string>();

  for (const donation of donations) {
    count++;
    sum += donation[DonationField.Amount];
    parties.add(donation[DonationField.Receiver]);
  }

  const description = tPageTitle("donor.description", {
    country: getCountryName(countryConfig, tCountries),
    donor: donorName,
    count,
    sum: formatCountryCurrency(locale, sum, countryConfig),
    minYear: countryConfig.minYear,
    minAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
    parties: parties.size,
  });

  const isBiggestDonor = biggestDonors.some((donor) => donor.id === donorId);
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
    isBiggestDonor &&
    // only add images if the country has no donors
    hasFeature(countryConfig, Features.Donors)
  ) {
    // add rich metadata for biggest donors as these have pregenerated images
    metadata.openGraph = baseOpenGraph({
      locale,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    });
    metadata.twitter = baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    });
  } else {
    // donors that aren't part of the biggest donors aren't indexed individually
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

  const { country, donorId } = params;

  const [donorMeta, messages] = await Promise.all([
    getDonorMeta(country, donorId),
    getMessagesForLocale(params.locale),
  ]);

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
  ]);

  return (
    <ScopedClientIntlProvider messages={pageMessages}>
      <DonorPageHead
        donorId={donorId}
        country={country}
        donorMeta={donorMeta}
      />
      <DonorClientPage donorId={donorId} />
    </ScopedClientIntlProvider>
  );
}

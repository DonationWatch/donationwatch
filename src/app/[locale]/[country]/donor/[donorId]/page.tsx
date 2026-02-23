import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DonorClientPage } from "./donor-client-page";
import { DonorPageHead } from "./donor-page-head";
import { THUMBNAIL_PREFIX } from "../../../../../utils/config";
import { getCountryName } from "../../../../../utils/countries";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "../../../../../utils/formatter";
import { getBiggestDonors } from "../../../../../utils/loader/biggest-donors";
import {
  baseOpenGraph,
  baseTwitter,
  generateAlternates,
} from "../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { DonationField, DonorType } from "../../../../../utils/types";
import { isValidCountry, isValidLocale } from "../../../../../utils/validate";

import type { Metadata } from "next";

import {
  getDonationsByDonorId,
  getDonorMeta,
} from "@/utils/data/server-loaders";
import { getDonationDonorName } from "@/utils/donor";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/donor/[donorId]">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country } = params;
  const donorId = params.donorId;

  const [t, tCountries, countryConfig, donations, biggestDonors, tCommon] =
    await Promise.all([
      getTranslations({ locale: params.locale }),
      getTranslations({ locale: params.locale, namespace: "countries" }),
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

  const description = t("page_title.donor.description", {
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
    title: `${t("page_title.donor.overview", {
      donor: donorName,
      country: getCountryName(countryConfig, tCountries),
    })}`,
    description,
    alternates: generateAlternates(`${country}/donor/${donorId}`),
  };

  if (isBiggestDonor) {
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

  const [countryConfig, donorMeta] = await Promise.all([
    getCountryConfig(country),
    getDonorMeta(country, donorId),
  ]);

  return (
    <>
      <DonorPageHead
        donorId={donorId}
        country={country}
        countryConfig={countryConfig}
        donorMeta={donorMeta}
      />
      <DonorClientPage
        donorId={donorId}
        country={country}
        countryConfig={countryConfig}
      />
    </>
  );
}

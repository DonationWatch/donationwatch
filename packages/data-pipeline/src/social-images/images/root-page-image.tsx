"use client";

import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { Country } from "@donationwatch/core/utils/countries";
import type { ImageLocale } from "@donationwatch/core/utils/locales";
import type { PartyYearsSums } from "@donationwatch/data/loader/party-years-sums";

import { PartyStatField } from "@donationwatch/core/types/party-stats";
import { formatNumber } from "@donationwatch/core/utils/formatter";
import { getPartiesSync } from "@donationwatch/data/config/parties";
/* eslint-disable react/no-unknown-property */
import { PageLogo } from "@donationwatch/ui/components/page-logo";

import type { CreateTranslator } from "../utils";

import { ImageMetaCard } from "../components/image-meta-card";
import { ThumbnailWrapper } from "../components/utils";

export const RootPageImage = async (
  locale: ImageLocale,
  getTranslations: CreateTranslator,
  countryDatas: [Country, CountryConfig, PartyYearsSums][],
) => {
  const t = getTranslations();
  let trackedParties = 0;
  let trackedDonations = 0;

  countryDatas.forEach(([, countryConfig, partyYearsSums]) => {
    trackedParties += getPartiesSync(countryConfig.id).length;

    Object.values(partyYearsSums).forEach((partyYearSum) => {
      Object.values(partyYearSum).forEach((stats) => {
        trackedDonations += stats[PartyStatField.Count];
      });
    });
  });

  return (
    <ThumbnailWrapper>
      <div tw="flex flex-col grow w-full relative">
        <div tw="flex flex-col py-4 px-6 grow justify-start">
          <div tw="flex justify-between items-center">
            <div tw="flex flex-col">
              <div tw="text-5xl font-bold">DonationWatch</div>
              <div tw="text-3xl">{t("home.hero.subtitle_no_country")}</div>
            </div>
            <div tw="flex text-indigo-700">
              <PageLogo size={128} />
            </div>
          </div>
          <div tw="flex flex-col mt-4">
            <div tw="flex flex-col">
              <div tw="mb-4 flex">
                <ImageMetaCard
                  variant="large"
                  title={t("root.stats.countries")}
                  value={formatNumber(locale, countryDatas.length)}
                />
              </div>
              <div tw="mb-4 flex">
                <ImageMetaCard
                  variant="large"
                  title={t("root.stats.parties")}
                  value={formatNumber(locale, trackedParties)}
                />
              </div>
              <ImageMetaCard
                variant="large"
                title={t("root.stats.donations")}
                value={formatNumber(locale, trackedDonations)}
              />
            </div>
          </div>
        </div>
      </div>
    </ThumbnailWrapper>
  );
};

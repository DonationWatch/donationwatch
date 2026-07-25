/* eslint-disable react/no-unknown-property */
"use client";

import type { PropsWithChildren, ReactNode } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { PartySum } from "@/utils/data/get-parties-sum";
import type { BigDonor } from "@/utils/loader/biggest-donors";
import type { ImageLocale } from "@/utils/locales";
import type { Donation, ReceiverId } from "@/utils/types";

import { PageLogo } from "@/components/layout/page-logo";
import { getParty } from "@/config/parties";
import { PartyField } from "@/types/party";
import { getCountryName } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import {
  formatCountryCurrency,
  formatNumber,
  formatYearsRange,
} from "@/utils/formatter";
import { DonationField } from "@/utils/types";

import type { CreateTranslator } from "../utils";

import { ImageMetaCard } from "./image-meta-card";

export const ImageStackedPartyDonations = ({
  country,
  donations,
  years,
  donor,
}: {
  years: string[];
  donor?: string;
  locale: ImageLocale;
  country: CountryConfig;
  donations: Donation[];
}) => {
  const sums: Record<ReceiverId, number> = {};
  let sum = 0;

  const yearsSet = new Set(years);
  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (donor && donation[DonationField.DonorName] !== donor) return;

    const party = donation[DonationField.Receiver];

    sums[party] ??= 0;
    sum += donation[DonationField.Amount];
    sums[party] += donation[DonationField.Amount];
  });

  const sortedSums = (Object.entries(sums) as [ReceiverId, number][])
    .filter(([, data]) => data > 0)
    .toSorted(([, dataA], [, dataB]) => dataB - dataA);

  return (
    <section tw="flex h-[12px] w-full">
      {sortedSums.map(([party, data]) => (
        <div
          key={party}
          tw="h-full flex"
          style={{
            boxSizing: "border-box",
            border: "1px solid #fff",
            width: `${100 * (data / sum)}%`,
          }}
        >
          <div
            tw="h-full w-full"
            style={{
              borderRadius: "2px",
              display: "flex",
              backgroundColor: getParty(country.id, party)[PartyField.Color],
            }}
          ></div>
        </div>
      ))}
    </section>
  );
};

const ImageRankingItem = ({
  amount,
  party,
  locale,
  country,
}: {
  party: Party;
  amount: number;
  sum: number;
  locale: ImageLocale;
  country: CountryConfig;
}) => {
  return (
    <div tw="mb-2 text-2xl flex w-full overflow-hidden items-center font-semibold justify-between text-left">
      <div
        tw="flex items-center overflow-hidden"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {party[PartyField.Short]}
      </div>
      <div tw="shrink-0 pr-1 ml-2">
        {formatCountryCurrency(locale, amount, country)}
      </div>
    </div>
  );
};

export const ImagePageHeader = ({
  getTranslations,
  right,
  country,
  children,
}: PropsWithChildren<{
  getTranslations: CreateTranslator;
  locale: ImageLocale;
  right?: string | ReactNode;
  country: CountryConfig;
}>) => {
  const tCountries = getTranslations("countries");

  return (
    <header tw="border-b border-slate-200 h-[64px] leading-none shrink-0">
      <div tw="flex w-full justify-between items-center px-6">
        <div tw="flex items-center shrink-0">
          <div tw="flex text-indigo-700">
            <PageLogo size={32} />
          </div>
          <div tw="flex flex-col ml-4">
            <div tw="text-3xl font-semibold leading-none">
              {getCountryName(country, tCountries)}
            </div>
            <div tw="text-slate-600 font-semibold">DonationWatch</div>
          </div>
        </div>
        {children}
        {right ? (
          <div tw="flex text-3xl font-bold text-indigo-500 leading-none overflow-hidden">
            {right}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export const DonorHeader = ({
  getTranslations,
  country,
  locale,
  donor,
  donations,
}: {
  getTranslations: CreateTranslator;
  locale: ImageLocale;
  country: CountryConfig;
  donations: Donation[];
  donor: BigDonor;
}) => {
  const t = getTranslations();
  const tCommon = getTranslations("common");
  let sum = 0;
  let count = 0;

  const partyStats: Record<ReceiverId, { sum: number; count: number }> = {};

  donations.forEach((donation) => {
    sum += donation[DonationField.Amount];
    count += 1;

    const party = donation[DonationField.Receiver];

    partyStats[party] ??= { sum: 0, count: 0 };
    partyStats[party].sum += donation[DonationField.Amount];
    partyStats[party].count += 1;
  });

  const sums = (Object.entries(partyStats) as PartySum[]).toSorted(
    ([, dataA], [, dataB]) => dataB.sum - dataA.sum,
  );

  const firstYear = donationYear(donations[0]);
  const lastYear = donationYear(donations[donations.length - 1]);

  return (
    <div tw="flex flex-col grow w-full">
      <ImagePageHeader
        getTranslations={getTranslations}
        locale={locale}
        country={country}
      />
      <div tw="flex flex-col px-6 mt-4">
        <div tw="flex flex-col mb-4">
          <div
            tw="text-3xl mb-1 font-semibold"
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {getDonorName(donor.name, tCommon)}
          </div>
        </div>
        <div tw="flex flex-col mb-4">
          <div tw="flex">
            <div tw="flex mr-10">
              <ImageMetaCard
                title={t("donation_count")}
                value={formatNumber(locale, count)}
              />
            </div>
            <div tw="flex mr-10">
              <ImageMetaCard
                title={t("sum")}
                value={formatCountryCurrency(locale, sum, country)}
              />
            </div>
            <ImageMetaCard
              title={t("donor.active_period")}
              value={formatYearsRange([firstYear, lastYear])}
            />
          </div>
        </div>
        <div tw="flex mb-4">
          <ImageStackedPartyDonations
            country={country}
            donations={donations}
            years={country.years}
            locale={locale}
          />
        </div>
        <div tw="flex flex-col overflow-hidden">
          {sums.slice(0, 3).map(([party, data]) => (
            <ImageRankingItem
              key={party}
              party={getParty(country.id, party)}
              amount={data.sum}
              sum={sum}
              locale={locale}
              country={country}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

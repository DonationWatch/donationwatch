/* eslint-disable react/no-unknown-property */
import { ImageMetaCard } from "./image-meta-card";
import { PageLogo } from "../../../src/components/page-logo";
import { partyColor } from "../../../src/utils/color";
import {
  type CountryConfig,
  getCountryName,
  getParty,
} from "../../../src/utils/countries";
import { donationYear } from "../../../src/utils/date";
import {
  formatCountryCurrency,
  formatNumber,
  formatYearsRange,
} from "../../../src/utils/formatter";
import { DonationField } from "../../../src/utils/types";

import type { Translations } from "../../../src/messages/translations";
import type { PartySum } from "../../../src/utils/data/get-parties-sum";
import type { BigDonor } from "../../../src/utils/loader/biggest-donors";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation, Party, ReceiverId } from "../../../src/utils/types";
import type { FC, PropsWithChildren, ReactNode } from "react";

import { getDonorName } from "@/utils/donor";

export const ImageStackedPartyDonations: FC<{
  translations: Translations;
  years: string[];
  donor?: string;
  locale: ConstLocale;
  country: CountryConfig;
  donations: Donation[];
}> = ({ country, donations, years, donor }) => {
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
              backgroundColor: partyColor(party, country),
            }}
          ></div>
        </div>
      ))}
    </section>
  );
};

const ImageRankingItem: FC<{
  party: Party;
  amount: number;
  sum: number;
  locale: ConstLocale;
  country: CountryConfig;
}> = ({ amount, party, locale, country }) => {
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
        {party.short}
      </div>
      <div tw="shrink-0 pr-1 ml-2">
        {formatCountryCurrency(locale, amount, country)}
      </div>
    </div>
  );
};

export const ImagePageHeader: FC<
  PropsWithChildren & {
    translations: Translations;
    locale: ConstLocale;
    right?: string | ReactNode;
    country: CountryConfig;
  }
> = ({ translations, right, country, children }) => {
  return (
    <header tw="border-b border-slate-200 h-[64px] leading-none shrink-0">
      <div tw="flex w-full justify-between items-center px-6">
        <div tw="flex items-center shrink-0">
          <div tw="flex text-indigo-700">
            <PageLogo size={32} />
          </div>
          <div tw="flex flex-col ml-4">
            <div tw="text-3xl font-semibold leading-none">
              {getCountryName(country, translations)}
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

export const DonorHeader: FC<{
  translations: Translations;
  locale: ConstLocale;
  country: CountryConfig;
  donations: Donation[];
  donor: BigDonor;
}> = ({ country, translations, locale, donor, donations }) => {
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
        translations={translations}
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
            {getDonorName(donor.name, translations)}
          </div>
        </div>
        <div tw="flex flex-col mb-4">
          <div tw="flex">
            <div tw="flex mr-10">
              <ImageMetaCard
                title={translations.donation_count}
                value={formatNumber(locale, count)}
              />
            </div>
            <div tw="flex mr-10">
              <ImageMetaCard
                title={translations.sum}
                value={formatCountryCurrency(locale, sum, country)}
              />
            </div>
            <ImageMetaCard
              title={translations.donor.active_period}
              value={formatYearsRange([firstYear, lastYear])}
            />
          </div>
        </div>
        <div tw="flex mb-4">
          <ImageStackedPartyDonations
            country={country}
            donations={donations}
            years={country.years}
            translations={translations}
            locale={locale}
          />
        </div>
        <div tw="flex flex-col overflow-hidden">
          {sums.slice(0, 3).map(([party, data]) => (
            <ImageRankingItem
              key={party}
              party={getParty(country, party)}
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

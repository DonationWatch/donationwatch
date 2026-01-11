/* eslint-disable react/no-unknown-property */
import { ImageMetaCard } from "./image-meta-card";
import { ImagePageHeader } from "./image-years-header";
import { partyColor } from "../../../src/utils/color";
import {
  formatCountryCurrency,
  formatNumber,
} from "../../../src/utils/formatter";
import { DonationField } from "../../../src/utils/types";

import type { Translations } from "../../../src/messages/translations";
import type { CountryConfig } from "../../../src/utils/countries";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation, Party } from "../../../src/utils/types";
import type { FC } from "react";

import { getDonorName } from "@/utils/donor";

const RankingItem: FC<{
  name: string;
  amount: number;
  sum: number;
  locale: ConstLocale;
  country: CountryConfig;
}> = ({ amount, name, locale, country }) => {
  return (
    <section tw="mb-2 text-2xl flex w-full overflow-hidden items-center justify-between text-left font-semibold">
      <div
        tw="flex grow overflow-hidden items-center w-full space-x-2"
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {name}
      </div>
      <div tw="flex shrink-0 ml-2 pr-1">
        {formatCountryCurrency(locale, amount, country)}
      </div>
    </section>
  );
};

export const ImagePartyHeader: FC<{
  country: CountryConfig;
  translations: Translations;
  party: Party;
  locale: ConstLocale;
  donations: Donation[];
}> = ({ country, donations, translations, locale, party }) => {
  const partyDonations = donations.filter(
    (donation) => donation[DonationField.Receiver] === party.id,
  );

  const donorRegistry: Record<
    string,
    {
      sum: number;
      name: string;
      donations: { party: string; donation: Donation }[];
    }
  > = {};
  // group donations by donor
  partyDonations.forEach((donation) => {
    // normalize so the registry has an empty array for each donator
    donorRegistry[donation[DonationField.DonorName]] ??= {
      sum: 0,
      name: donation[DonationField.DonorName],
      donations: [],
    };

    donorRegistry[donation[DonationField.DonorName]].sum +=
      donation[DonationField.Amount];
    donorRegistry[donation[DonationField.DonorName]].donations.push({
      party: party.id,
      donation,
    });
  });

  const sortedDonors = Object.values(donorRegistry).toSorted(
    (a, b) => b.sum - a.sum,
  );

  return (
    <div tw="grow flex flex-col w-full">
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
            {party.short}
          </div>
          {party.name !== party.short ? (
            <div tw="text-base text-slate-600 text-lg font-semibold leading-none">
              {party.name}
            </div>
          ) : null}
        </div>
        <div tw="flex flex-col mb-4">
          <div tw="flex">
            <div tw="flex mr-10">
              <ImageMetaCard
                title={translations.donation_count}
                value={formatNumber(locale, partyDonations.length)}
              />
            </div>
            <ImageMetaCard
              title={translations.sum}
              value={formatCountryCurrency(locale, party.sum, country)}
            />
          </div>
        </div>
        <div tw="flex mb-4">
          <div
            tw="w-full h-[12px]"
            style={{
              border: "1px solid #fff",
              backgroundColor: partyColor(party.id, country),
            }}
          ></div>
        </div>
        <div tw="flex flex-col">
          {sortedDonors.slice(0, 3).map((entry) => (
            <RankingItem
              key={entry.name}
              name={getDonorName(entry.name, translations)}
              amount={entry.sum}
              sum={entry.sum}
              locale={locale}
              country={country}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

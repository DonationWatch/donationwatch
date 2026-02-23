"use client";

import { useTranslations } from "next-intl";

import { TopDonationsItemDetail } from "./loading-top-year-donations-item-detail";
import { CurrencyRankingItem } from "./ranking-item";
import { AddressField, DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation } from "../utils/types";

export const OriginDonationsItem = ({
  id,
  country,
  amount,
  rank,
  sum,
  donations,
  expanded,
  onToggleExpanded,
}: {
  id: string;
  amount: number;
  rank: number;
  sum: number;
  donations: Donation[];
  readonly?: boolean;
  country: CountryConfig;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
}) => {
  const t = useTranslations();
  const address = donations.at(0)?.[DonationField.Address];

  if (!address) return null;

  return (
    <li>
      <CurrencyRankingItem
        id={id}
        amount={amount}
        rank={rank}
        sum={sum}
        country={country}
        expanded={expanded}
        onToggleExpanded={onToggleExpanded}
        detail={
          <TopDonationsItemDetail
            showDonationParty={true}
            country={country}
            donations={donations}
          />
        }
      >
        {address[AddressField.State] &&
        address[AddressField.State] !== address[AddressField.Country]
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            t(`state.${country.id}.${address[AddressField.State]}`)
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            t(`countries.${address[AddressField.Country]}`)}
      </CurrencyRankingItem>
    </li>
  );
};

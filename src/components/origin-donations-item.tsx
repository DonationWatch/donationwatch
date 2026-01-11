import { TopDonationsItemDetail } from "./loading-top-year-donations-item-detail";
import { CurrencyRankingItem } from "./ranking-item";
import { AddressField, DonationField } from "../utils/types";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { Donation } from "../utils/types";
import type { FC } from "react";

export const OriginDonationsItem: FC<{
  id: string;
  translations: Translations;
  amount: number;
  rank: number;
  sum: number;
  donations: Donation[];
  readonly?: boolean;
  country: CountryConfig;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
}> = ({
  id,
  translations,
  country,
  amount,
  rank,
  sum,
  donations,
  expanded,
  onToggleExpanded,
}) => {
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
          ? (translations.state as Record<string, Record<string, string>>)[
              country.id
            ][address[AddressField.State]]
          : translations.countries[address[AddressField.Country]]}
      </CurrencyRankingItem>
    </li>
  );
};

import { ArrowRight } from "lucide-react";

import {
  LoadedTopDonationsItemDetail,
  LoadingTopYearDonationsItemDetail,
} from "./loading-top-year-donations-item-detail";
import { NonInteractableRankingItem } from "./noninteractable-ranking-item";
import { PartyDot } from "./party-dot";
import { PartyLink } from "./party-link";
import { CurrencyRankingItem } from "./ranking-item";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { ConstLocale } from "../utils/locales";
import type { Donation, ReceiverId } from "../utils/types";
import type { FC } from "react";

export const ReadonlyTopYearDonationsItem: FC<{
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  locale: ConstLocale;
  country: CountryConfig;
}> = ({ partyId, amount, rank, sum, locale, country }) => {
  return (
    <NonInteractableRankingItem
      amount={amount}
      rank={rank}
      sum={sum}
      locale={locale}
      country={country}
    >
      <PartyDot
        className="overflow-hidden"
        nameClassName="truncate"
        party={partyId}
        country={country}
      />
    </NonInteractableRankingItem>
  );
};

export const LoadingTopYearDonationsItem: FC<{
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  country: CountryConfig;
  years?: string[];
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  translations: Translations;
  locale: ConstLocale;
}> = ({
  partyId,
  amount,
  rank,
  sum,
  country,
  years = [],
  expanded,
  onToggleExpanded,
  translations,
  locale,
}) => {
  return (
    <CurrencyRankingItem
      amount={amount}
      rank={rank}
      sum={sum}
      country={country}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      openAction={
        <PartyLink
          className={
            "m-0.5 ml-2 shrink-0 cursor-pointer rounded-full p-1.5 hover:bg-stone-200 dark:hover:bg-neutral-50/10"
          }
          party={partyId}
          country={country}
          translations={translations}
          locale={locale}
        >
          <ArrowRight size={16} />
        </PartyLink>
      }
      detail={
        <LoadingTopYearDonationsItemDetail
          country={country}
          years={years}
          partyId={partyId}
        />
      }
    >
      <PartyDot party={partyId} country={country} />
    </CurrencyRankingItem>
  );
};

export const LoadedTopYearDonationsItem: FC<{
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  country: CountryConfig;
  years?: string[];
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  donations: Donation[];
}> = ({
  partyId,
  amount,
  rank,
  sum,
  country,
  expanded,
  onToggleExpanded,
  donations,
}) => {
  return (
    <CurrencyRankingItem
      amount={amount}
      rank={rank}
      sum={sum}
      country={country}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      detail={
        <LoadedTopDonationsItemDetail
          country={country}
          donations={donations}
          partyId={partyId}
        />
      }
    >
      <PartyDot party={partyId} country={country} />
    </CurrencyRankingItem>
  );
};

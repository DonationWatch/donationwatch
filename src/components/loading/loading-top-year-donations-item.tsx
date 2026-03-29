import { ArrowRight } from "lucide-react";

import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";
import type { Donation, ReceiverId } from "@/utils/types";

import { NonInteractableRankingItem } from "@/components/donations/noninteractable-ranking-item";
import { CurrencyRankingItem } from "@/components/donations/ranking-item";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";

import {
  LoadedTopDonationsItemDetail,
  LoadingTopYearDonationsItemDetail,
} from "./loading-top-year-donations-item-detail";

export const ReadonlyTopYearDonationsItem = ({
  partyId,
  amount,
  rank,
  sum,
  locale,
  country,
}: {
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  locale: ConstLocale;
  country: CountryConfig;
}) => {
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

export const LoadingTopYearDonationsItem = ({
  partyId,
  amount,
  rank,
  sum,
  country,
  years = [],
  expanded,
  onToggleExpanded,
  locale,
}: {
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  country: CountryConfig;
  years?: string[];
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  locale: ConstLocale;
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

export const LoadedTopYearDonationsItem = ({
  partyId,
  amount,
  rank,
  sum,
  country,
  expanded,
  onToggleExpanded,
  donations,
}: {
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  country: CountryConfig;
  years?: string[];
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  donations: Donation[];
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

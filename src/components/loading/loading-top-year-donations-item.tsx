"use client";

import { ArrowRight } from "lucide-react";

import type { ConstLocale } from "@/utils/locales";
import type { Donation, ReceiverId } from "@/utils/types";

import { NonInteractableRankingItem } from "@/components/donations/noninteractable-ranking-item";
import { CurrencyRankingItem } from "@/components/donations/ranking-item";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";

import { LoadedTopDonationsItemDetail } from "./loading-top-year-donations-item-detail";

export const ReadonlyTopYearDonationsItem = ({
  partyId,
  amount,
  rank,
  sum,
}: {
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
}) => {
  const country = useRequiredCountryConfig();
  const locale = useBrowserBasedLocale();

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
      />
    </NonInteractableRankingItem>
  );
};

export const LoadedTopYearDonationsItem = ({
  partyId,
  amount,
  rank,
  sum,
  expanded,
  onToggleExpanded,
  donations,
  locale,
}: {
  locale: ConstLocale;
  partyId: ReceiverId;
  amount: number;
  rank: number;
  sum: number;
  years?: string[];
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  donations: Donation[];
}) => {
  const country = useRequiredCountryConfig();
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
          locale={locale}
        >
          <ArrowRight size={16} />
        </PartyLink>
      }
      detail={
        <LoadedTopDonationsItemDetail donations={donations} partyId={partyId} />
      }
    >
      <PartyDot party={partyId} />
    </CurrencyRankingItem>
  );
};

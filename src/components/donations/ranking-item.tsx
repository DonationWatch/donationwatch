"use client";

import type { PropsWithChildren, ReactNode } from "react";

import { ChevronRight } from "lucide-react";
import { createContext, use } from "react";

import type { CountryConfig } from "@/types/country-config";

import { RankBadge } from "@/components/donations/rank-badge";
import { PercentageHint } from "@/components/percentage-hint";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { formatCountryCurrency } from "@/utils/formatter";

export { RankBadge };

export interface RankingItemState {
  id: string;
  rank: number;
  expanded: boolean;
}

export interface RankingItemActions {
  toggleExpanded: () => void;
}

export interface RankingItemContextValue {
  state: RankingItemState;
  actions: RankingItemActions;
}

const RankingItemContext = createContext<RankingItemContextValue | null>(null);

function useRankingItemContext(): RankingItemContextValue {
  const ctx = use(RankingItemContext);
  if (!ctx) {
    throw new Error(
      "RankingItem subcomponents must be used within RankingItem.Root",
    );
  }
  return ctx;
}

const RankingItemRoot = ({
  id = "n",
  rank,
  expanded,
  onToggleExpanded,
  children,
}: PropsWithChildren<{
  id?: string;
  rank: number;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
}>) => {
  return (
    <RankingItemContext
      value={{
        state: { id, rank, expanded },
        actions: { toggleExpanded: () => onToggleExpanded(!expanded) },
      }}
    >
      <section
        className="grow overflow-x-hidden"
        data-testid="ranking-item"
        aria-labelledby={`rank-head-${id}-${rank}`}
      >
        {children}
      </section>
    </RankingItemContext>
  );
};

const RankingItemHeader = ({ children }: PropsWithChildren) => {
  const {
    state: { expanded },
  } = useRankingItemContext();

  return (
    <div
      className={`flex items-center justify-between rounded text-left text-sm font-semibold ${
        expanded ? "bg-neutral-50/5" : ""
      }`}
    >
      {children}
    </div>
  );
};

const RankingItemTrigger = ({ children }: PropsWithChildren) => {
  const {
    state: { id, rank, expanded },
    actions: { toggleExpanded },
  } = useRankingItemContext();

  return (
    <div
      id={`rank-head-${id}-${rank}`}
      className="flex grow cursor-pointer items-center justify-between overflow-x-hidden"
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-controls={`rank-detail-${rank}`}
      onClick={toggleExpanded}
      onKeyDown={(ev) => {
        if (ev.key !== "Enter") return;

        // on enter trigger the click action
        ev.stopPropagation();
        toggleExpanded();
      }}
    >
      <div className="shrink-0 p-1">
        <ChevronRight size={16} className={expanded ? "rotate-90" : ""} />
      </div>
      {children}
    </div>
  );
};

const RankingItemRankedContent = ({ children }: PropsWithChildren) => {
  const {
    state: { rank },
  } = useRankingItemContext();

  return (
    <div className="flex min-w-0 grow items-center overflow-x-hidden py-1">
      <RankBadge rank={rank} />
      {children}
    </div>
  );
};

const RankingItemUnrankedContent = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-w-0 grow items-center overflow-x-hidden py-1.25">
      {children}
    </div>
  );
};

const RankingItemRight = ({ children }: PropsWithChildren) => {
  return <div className="ml-2 flex shrink-0 tabular-nums">{children}</div>;
};

const RankingItemCurrencyRight = ({
  amount,
  sum,
  country,
}: {
  amount: number;
  sum: number;
  country: CountryConfig;
}) => {
  const browserBasedLocale = useBrowserBasedLocale();

  return (
    <RankingItemRight>
      <span className="lg:mr-1">
        {formatCountryCurrency(browserBasedLocale, amount, country)}
      </span>
      <PercentageHint
        browserBasedLocale={browserBasedLocale}
        percentage={amount / sum}
      />
    </RankingItemRight>
  );
};

const RankingItemDetail = ({ children }: PropsWithChildren) => {
  const {
    state: { rank, expanded },
  } = useRankingItemContext();

  return (
    <div
      data-testid="ranking-item-detail"
      id={`rank-detail-${rank}`}
      className={`${expanded ? "" : "hidden"} py-2 text-sm lg:pr-3 lg:pl-9`}
    >
      {expanded ? children : null}
    </div>
  );
};

export const RankingItem = {
  Root: RankingItemRoot,
  Header: RankingItemHeader,
  Trigger: RankingItemTrigger,
  RankedContent: RankingItemRankedContent,
  UnrankedContent: RankingItemUnrankedContent,
  Right: RankingItemRight,
  CurrencyRight: RankingItemCurrencyRight,
  Detail: RankingItemDetail,
};

export const CurrencyRankingItem = ({
  id = "n",
  amount,
  country,
  rank,
  sum,
  children,
  detail,
  expanded,
  onToggleExpanded,
  openAction,
}: PropsWithChildren<{
  id?: string;
  amount: number;
  rank: number;
  sum: number;
  detail?: ReactNode;
  country: CountryConfig;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  openAction?: ReactNode;
}>) => {
  return (
    <RankingItem.Root
      id={id}
      rank={rank}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
    >
      <RankingItem.Header>
        <RankingItem.Trigger>
          <RankingItem.RankedContent>{children}</RankingItem.RankedContent>
          <RankingItem.CurrencyRight
            amount={amount}
            sum={sum}
            country={country}
          />
        </RankingItem.Trigger>
        {openAction ?? null}
      </RankingItem.Header>
      <RankingItem.Detail>{detail}</RankingItem.Detail>
    </RankingItem.Root>
  );
};

export const UnrankedRankingItem = ({
  id = "n",
  rank,
  children,
  detail,
  expanded,
  onToggleExpanded,
}: PropsWithChildren<{
  id?: string;
  rank: number;
  detail?: ReactNode;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
}>) => {
  return (
    <RankingItem.Root
      id={id}
      rank={rank}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
    >
      <RankingItem.Header>
        <RankingItem.Trigger>
          <RankingItem.UnrankedContent>{children}</RankingItem.UnrankedContent>
        </RankingItem.Trigger>
      </RankingItem.Header>
      <RankingItem.Detail>{detail}</RankingItem.Detail>
    </RankingItem.Root>
  );
};

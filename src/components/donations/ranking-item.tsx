import type { PropsWithChildren, ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import type { CountryConfig } from "@/types/country-config";

import { RankBadge } from "@/components/donations/rank-badge";
import { PercentageHint } from "@/components/percentage-hint";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { formatCountryCurrency } from "@/utils/formatter";

export { RankBadge };

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
  const browserBasedLocale = useBrowserBasedLocale();

  return (
    <RankingItem
      id={id}
      rank={rank}
      country={country}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      detail={detail}
      openAction={openAction}
      right={
        <>
          <span className="lg:mr-1">
            {formatCountryCurrency(browserBasedLocale, amount, country)}
          </span>
          <PercentageHint
            browserBasedLocale={browserBasedLocale}
            percentage={amount / sum}
          />
        </>
      }
    >
      {children}
    </RankingItem>
  );
};

export const RankingItem = ({
  id = "n",
  rank,
  children,
  detail,
  expanded,
  onToggleExpanded,
  right,
  showRank = true,
  openAction,
}: PropsWithChildren<{
  id?: string;
  rank: number;
  detail?: ReactNode;
  country: CountryConfig;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
  right?: ReactNode;
  showRank?: boolean;
  openAction?: ReactNode;
}>) => {
  return (
    <section
      className="grow overflow-x-hidden"
      data-testid="ranking-item"
      aria-labelledby={`rank-head-${id}-${rank}`}
    >
      <div
        className={`flex items-center justify-between rounded text-left text-sm font-semibold ${
          expanded ? "bg-neutral-50/5" : ""
        }`}
      >
        <div
          id={`rank-head-${id}-${rank}`}
          className="flex grow cursor-pointer items-center justify-between overflow-x-hidden"
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-controls={`rank-detail-${rank}`}
          onClick={() => onToggleExpanded(!expanded)}
          onKeyDown={(ev) => {
            if (ev.key !== "Enter") return;

            // on enter trigger the click action
            ev.stopPropagation();
            onToggleExpanded(!expanded);
          }}
        >
          <div className="shrink-0 p-1">
            <ChevronRight size={16} className={expanded ? "rotate-90" : ""} />
          </div>
          <div
            className={
              "flex min-w-0 grow items-center overflow-x-hidden " +
              (showRank ? "py-1" : "py-1.25")
            }
          >
            {showRank ? <RankBadge rank={rank} /> : null}
            {children}
          </div>
          {right ? (
            <div className="ml-2 flex shrink-0 tabular-nums">{right}</div>
          ) : null}
        </div>
        {openAction ?? null}
      </div>
      <div
        data-testid="ranking-item-detail"
        id={`rank-detail-${rank}`}
        className={`${expanded ? "" : "hidden"} py-2 text-sm lg:pr-3 lg:pl-9`}
      >
        {expanded ? detail : null}
      </div>
    </section>
  );
};

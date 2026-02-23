import { ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

import { PercentageHint } from "./percentage-hint";
import { formatCountryCurrency } from "../utils/formatter";

import type { CountryConfig } from "../utils/countries";
import type { PropsWithChildren, ReactNode } from "react";

const colorClasses: Record<number, string> = {
  1: "from-yellow-100 to-yellow-200 text-yellow-900",
  2: "from-gray-100 to-gray-200 text-gray-900",
  3: "from-amber-100 to-amber-200 text-amber-900",
};

export const RankBadge = ({ rank }: { rank: number }) => {
  return (
    <div
      aria-hidden={true}
      className={
        "mr-2 rounded-md bg-linear-to-r px-2 py-1 leading-none tabular-nums " +
        colorClasses[rank]
      }
    >
      #{rank}
    </div>
  );
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
  const locale = useLocale();

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
            {formatCountryCurrency(locale, amount, country)}
          </span>
          <PercentageHint locale={locale} percentage={amount / sum} />
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
          <div aria-hidden={true} className="shrink-0 p-1">
            <ChevronRight size={16} className={expanded ? "rotate-90" : ""} />
          </div>
          <div
            className={
              "flex grow items-center overflow-x-hidden " +
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

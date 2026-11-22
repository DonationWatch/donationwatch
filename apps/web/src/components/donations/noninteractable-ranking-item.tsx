import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { BrowserBasedLocale } from "@donationwatch/core/utils/locales";
import type { PropsWithChildren } from "react";

import { formatCountryCurrency } from "@donationwatch/core/utils/formatter";

import { RankBadge } from "@/components/donations/ranking-item";
import { PercentageHint } from "@/components/percentage-hint";

export const NonInteractableRankingItem = ({
  amount,
  country,
  rank,
  sum,
  children,
  locale,
}: PropsWithChildren<{
  amount: number;
  rank: number;
  sum: number;
  locale: BrowserBasedLocale;
  country: CountryConfig;
}>) => {
  return (
    <section
      data-testid="ranking-item"
      className={`flex w-full items-center justify-between space-x-2 rounded-sm py-1 text-left text-sm font-semibold select-none lg:px-4`}
    >
      <div className="flex items-center overflow-x-hidden">
        <RankBadge rank={rank} />
        {children}
      </div>
      <div className="flex tabular-nums">
        <span className="mr-1">
          {formatCountryCurrency(locale, amount, country)}
        </span>
        <PercentageHint browserBasedLocale={locale} percentage={amount / sum} />
      </div>
    </section>
  );
};

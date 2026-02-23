import { PercentageHint } from "./percentage-hint";
import { RankBadge } from "./ranking-item";
import { formatCountryCurrency } from "../utils/formatter";

import type { CountryConfig } from "../utils/countries";
import type { ConstLocale } from "../utils/locales";
import type { PropsWithChildren } from "react";

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
  locale: ConstLocale;
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
        <PercentageHint locale={locale} percentage={amount / sum} />
      </div>
    </section>
  );
};

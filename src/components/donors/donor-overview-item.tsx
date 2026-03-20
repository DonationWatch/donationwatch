import type { ReactNode } from "react";

import { ArrowRight } from "lucide-react";

import type { CountryConfig } from "@/utils/countries";

import { CurrencyRankingItem } from "@/components/donations/ranking-item";
import { DonorLink } from "@/components/donors/donor-link";
import { DonorName } from "@/components/donors/donor-name";

export const DonorOverviewItem = ({
  rank,
  country,
  name,
  amount,
  sum,
  detail,
  expanded,
  onToggleExpanded,
}: {
  name: string;
  amount: number;
  rank: number;
  sum: number;
  detail: ReactNode | undefined;
  country: CountryConfig;
  expanded: boolean;
  onToggleExpanded: (expanded: boolean) => void;
}) => {
  return (
    <CurrencyRankingItem
      amount={amount}
      rank={rank}
      sum={sum}
      detail={detail}
      country={country}
      expanded={expanded}
      onToggleExpanded={onToggleExpanded}
      openAction={
        <DonorLink
          className="m-0.5 ml-2 shrink-0 cursor-pointer rounded-full p-1.5 hover:bg-stone-200 dark:hover:bg-neutral-50/10"
          country={country}
          donor={name}
        >
          <ArrowRight size={16} />
        </DonorLink>
      }
    >
      <div className="truncate font-semibold">
        <DonorName donor={name} />
      </div>
    </CurrencyRankingItem>
  );
};

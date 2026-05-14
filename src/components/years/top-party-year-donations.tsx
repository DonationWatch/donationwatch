"use client";

import { useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { PartySum } from "@/utils/data/get-parties-sum";
import type { ConstLocale } from "@/utils/locales";
import type { Donation } from "@/utils/types";

import { LoadedTopYearDonationsItem } from "@/components/loading/loading-top-year-donations-item";

export const LoadedTopPartyDonations = ({
  locale,
  sum,
  sums,
  country,
  donations,
}: {
  locale: ConstLocale;
  donations: Donation[];
  sums: PartySum[];
  sum: number;
  country: CountryConfig;
}) => {
  const [expandedParties, setExpandedParties] = useState<string[]>([]);
  const onToggleExpanded = (state: string) => {
    setExpandedParties((prev) =>
      prev.includes(state)
        ? prev.filter((id) => id !== state)
        : [...prev, state],
    );
  };

  return (
    <div className="@container space-y-1">
      {sums.map(([party, data], idx) => (
        <LoadedTopYearDonationsItem
          locale={locale}
          rank={idx + 1}
          key={party}
          partyId={party}
          donations={donations}
          amount={data.sum}
          sum={sum}
          country={country}
          expanded={expandedParties.includes(party)}
          onToggleExpanded={() => onToggleExpanded(party)}
        />
      ))}
    </div>
  );
};

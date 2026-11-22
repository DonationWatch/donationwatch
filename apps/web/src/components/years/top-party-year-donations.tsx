"use client";

import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { Donation } from "@donationwatch/core/utils/types";
import type { PartySum } from "@donationwatch/data/queries/get-parties-sum";

import { useState } from "react";

import { LoadedTopYearDonationsItem } from "@/components/loading/loading-top-year-donations-item";

export const LoadedTopPartyDonations = ({
  locale,
  sum,
  sums,
  donations,
}: {
  locale: ConstLocale;
  donations: Donation[];
  sums: PartySum[];
  sum: number;
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
          expanded={expandedParties.includes(party)}
          onToggleExpanded={() => onToggleExpanded(party)}
        />
      ))}
    </div>
  );
};

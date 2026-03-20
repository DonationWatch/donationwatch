"use client";
import { useLocale } from "next-intl";
import { useState } from "react";

import type { CountryConfig } from "@/utils/countries";
import type { PartySum } from "@/utils/data/get-parties-sum";
import type { Donation } from "@/utils/types";

import {
  LoadedTopYearDonationsItem,
  LoadingTopYearDonationsItem,
} from "@/components/loading/loading-top-year-donations-item";

export const TopPartyYearDonations = ({
  sum,
  sums,
  country,
  years,
}: {
  sums: PartySum[];
  years: string[];
  sum: number;
  country: CountryConfig;
}) => {
  const locale = useLocale();
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
        <LoadingTopYearDonationsItem
          locale={locale}
          rank={idx + 1}
          key={party}
          partyId={party}
          years={years}
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

export const LoadedTopPartyDonations = ({
  sum,
  sums,
  country,
  donations,
}: {
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

"use client";

import { type FC, useState } from "react";

import {
  LoadedTopYearDonationsItem,
  LoadingTopYearDonationsItem,
} from "./loading-top-year-donations-item";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { PartySum } from "../utils/data/get-parties-sum";
import type { ConstLocale } from "../utils/locales";
import type { Donation } from "../utils/types";

export const TopPartyYearDonations: FC<{
  sums: PartySum[];
  years: string[];
  sum: number;
  country: CountryConfig;
  translations: Translations;
  locale: ConstLocale;
}> = ({ sum, sums, country, years, translations, locale }) => {
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
          translations={translations}
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

export const LoadedTopPartyDonations: FC<{
  donations: Donation[];
  sums: PartySum[];
  sum: number;
  country: CountryConfig;
}> = ({ sum, sums, country, donations }) => {
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

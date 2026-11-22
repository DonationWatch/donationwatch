"use client";

import type {
  DonorInterestMap,
  MacroDomainExposureStats,
  TagExposureStats,
} from "@donationwatch/core/types/interests";
import type { Party } from "@donationwatch/core/types/party";
import type { Donation } from "@donationwatch/core/utils/types";

import { ALL_POLICY_INTEREST_TAGS } from "@donationwatch/core/types/interests";
import {
  aggregateDonationInterests,
  aggregateInterestUnion,
  aggregateMacroDomainStats,
  buildDonorInterestLookup,
  getActiveMacroDomainStats,
  getActiveTagStats,
} from "@donationwatch/data/queries/aggregate-interests";
import { createContext, use, useMemo, useState } from "react";

export type ViewMode = "exposure" | "core";

export type InterestsScope =
  | { kind: "party"; party: Party }
  | { kind: "years"; years: string[] };

export interface InterestsContextValue {
  state: {
    viewMode: ViewMode;
    isGrouped: boolean;
    donations: readonly Donation[];
    totalPartyDonations: number;
    totalTrackedExposure: number;
    sortedTags: TagExposureStats[];
    sortedMacroDomains: MacroDomainExposureStats[];
  };
  actions: {
    setViewMode: (mode: ViewMode) => void;
    setIsGrouped: (grouped: boolean) => void;
  };
  meta: {
    scope: InterestsScope;
    interestMap: DonorInterestMap;
  };
}

export const InterestsContext = createContext<InterestsContextValue | null>(
  null,
);

/** Reads shared interests state, actions, and scope metadata from InterestsProvider. */
export function useInterestsContext(): InterestsContextValue {
  const ctx = use(InterestsContext);
  if (!ctx) {
    throw new Error(
      "useInterestsContext must be used within an InterestsProvider",
    );
  }
  return ctx;
}

interface InterestsProviderProps {
  scope: InterestsScope;
  donations: readonly Donation[];
  donorInterests: DonorInterestMap;
  children: React.ReactNode;
}

/** Provides aggregated industry/lobby-group state and display controls for a party or year-range scope. */
export const InterestsProvider = ({
  scope,
  donations,
  donorInterests,
  children,
}: InterestsProviderProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("exposure");
  const [isGrouped, setIsGrouped] = useState(true);

  const interestMap = useMemo(
    () => buildDonorInterestLookup(donorInterests),
    [donorInterests],
  );

  const { totalPartyDonations, tagStats } = useMemo(() => {
    return aggregateDonationInterests(donations, interestMap);
  }, [donations, interestMap]);

  const macroDomainStats = useMemo(() => {
    return aggregateMacroDomainStats(
      donations,
      interestMap,
      totalPartyDonations,
    );
  }, [donations, interestMap, totalPartyDonations]);

  // Overall deduplicated footprint across all tracked tags
  const totalTrackedExposure = useMemo(() => {
    const allUnion = aggregateInterestUnion(
      ALL_POLICY_INTEREST_TAGS,
      donations,
      interestMap,
      totalPartyDonations,
    );
    return viewMode === "exposure"
      ? allUnion.totalExposureAmount
      : allUnion.coreAmount;
  }, [donations, interestMap, totalPartyDonations, viewMode]);

  const sortedTags = useMemo(() => {
    return getActiveTagStats(tagStats, viewMode);
  }, [tagStats, viewMode]);

  const sortedMacroDomains = useMemo(() => {
    return getActiveMacroDomainStats(macroDomainStats, viewMode);
  }, [macroDomainStats, viewMode]);

  const value = useMemo<InterestsContextValue>(
    () => ({
      state: {
        viewMode,
        isGrouped,
        donations,
        totalPartyDonations,
        totalTrackedExposure,
        sortedTags,
        sortedMacroDomains,
      },
      actions: {
        setViewMode,
        setIsGrouped,
      },
      meta: {
        scope,
        interestMap,
      },
    }),
    [
      viewMode,
      isGrouped,
      donations,
      totalPartyDonations,
      totalTrackedExposure,
      sortedTags,
      sortedMacroDomains,
      scope,
      interestMap,
    ],
  );

  return <InterestsContext value={value}>{children}</InterestsContext>;
};

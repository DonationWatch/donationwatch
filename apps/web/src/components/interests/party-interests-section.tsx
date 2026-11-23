"use client";

import type { DonorInterestMap } from "@donationwatch/core/types/interests";
import type { Party } from "@donationwatch/core/types/party";
import type { Donation } from "@donationwatch/core/utils/types";

import { useMemo } from "react";

import {
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

import type { InterestsScope } from "./interests-context";

import { InterestsProvider } from "./interests-context";
import { PartyInterestsChart } from "./party-interests-chart";
import { PartyInterestsText } from "./party-interests-text";

interface InterestsSectionLayoutProps {
  chart: React.ReactNode;
}

const InterestsSectionLayout = ({ chart }: InterestsSectionLayoutProps) => {
  const t = useTranslations("party.interests");

  return (
    <ArticleSectionOneColumns>
      <ArticleSectionColumn>
        <ArticleSectionTitle id={"sec-party-interests"} title={t("title")} />
        <PartyInterestsText chart={chart} />
      </ArticleSectionColumn>
    </ArticleSectionOneColumns>
  );
};

interface PartyInterestsSectionProps {
  party: Party;
  donations: readonly Donation[];
  donorInterests: DonorInterestMap;
  isPendingClientDonations?: boolean;
}

/** Displays the Industries & Lobby Groups breakdown scoped to a single political party. */
export const PartyInterestsSection = ({
  party,
  donations,
  donorInterests,
  isPendingClientDonations = false,
}: PartyInterestsSectionProps) => {
  const scope = useMemo<InterestsScope>(
    () => ({ kind: "party", party }),
    [party],
  );

  return (
    <InterestsProvider
      scope={scope}
      donations={donations}
      donorInterests={donorInterests}
    >
      <InterestsSectionLayout
        chart={isPendingClientDonations ? <Loading /> : <PartyInterestsChart />}
      />
    </InterestsProvider>
  );
};

interface YearsInterestsSectionProps {
  years: string[];
  donations: readonly Donation[];
  donorInterests: DonorInterestMap;
}

/** Displays the Industries & Lobby Groups breakdown across all parties for a selected year range. */
export const YearsInterestsSection = ({
  years,
  donations,
  donorInterests,
}: YearsInterestsSectionProps) => {
  const scope = useMemo<InterestsScope>(
    () => ({ kind: "years", years }),
    [years],
  );

  return (
    <InterestsProvider
      scope={scope}
      donations={donations}
      donorInterests={donorInterests}
    >
      <InterestsSectionLayout chart={<PartyInterestsChart />} />
    </InterestsProvider>
  );
};

export const InterestsSection = {
  Provider: InterestsProvider,
  Layout: InterestsSectionLayout,
  Text: PartyInterestsText,
  Chart: PartyInterestsChart,
};

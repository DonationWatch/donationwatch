"use client";

import type { DonorInterestMap } from "@/types/interests";
import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import {
  ArticleSectionColumn,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

import { InterestsProvider } from "./interests-context";
import { PartyInterestsChart } from "./party-interests-chart";
import { PartyInterestsText } from "./party-interests-text";

interface InterestsSectionLayoutProps {
  chart: React.ReactNode;
}

const InterestsSectionLayout = ({ chart }: InterestsSectionLayoutProps) => {
  const t = useTranslations("party.interests");

  return (
    <ArticleSectionTwoColumns className="items-start">
      <ArticleSectionColumn>
        <ArticleSectionTitle id={"sec-party-interests"} title={t("title")} />
        <PartyInterestsText />
      </ArticleSectionColumn>
      <ArticleSectionColumn className="self-start">
        {chart}
      </ArticleSectionColumn>
    </ArticleSectionTwoColumns>
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
  return (
    <InterestsProvider
      scope={{ kind: "party", party }}
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
  return (
    <InterestsProvider
      scope={{ kind: "years", years }}
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

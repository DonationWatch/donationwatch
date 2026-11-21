"use client";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { DonationHistoryTable } from "@/components/table/donation-history-table";
import { PartyField } from "@/types/party";

interface TableHeadingProps {
  title?: string;
  description?: string;
  titleId?: string;
  titleAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const PartyDonationHistory = ({
  party,
  donations,
  title,
  description,
  titleId,
  titleAs,
}: TableHeadingProps & {
  party: Party;
  donations: Donation[];
}) => {
  return (
    <DonationHistoryTable
      donations={donations}
      partiesIds={[party[PartyField.Id]]}
      title={title}
      description={description}
      titleId={titleId}
      titleAs={titleAs}
    />
  );
};

export const YearDonationHistory = ({
  years,
  donations,
  title,
  description,
  titleId,
  titleAs,
}: TableHeadingProps & {
  years: string[];
  donations: Donation[];
}) => {
  return (
    <DonationHistoryTable
      donations={donations}
      years={years}
      partiesIds={[]}
      title={title}
      description={description}
      titleId={titleId}
      titleAs={titleAs}
    />
  );
};

"use client";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { DonationHistoryTable } from "@/components/table/donation-history-table";
import { PartyField } from "@/types/party";

export const PartyDonationHistory = ({
  party,
  donations,
}: {
  party: Party;
  donations: Donation[];
}) => {
  return (
    <DonationHistoryTable
      donations={donations}
      partiesIds={[party[PartyField.Id]]}
    />
  );
};

export const YearDonationHistory = ({
  years,
  donations,
}: {
  years: string[];
  donations: Donation[];
}) => {
  return (
    <DonationHistoryTable donations={donations} years={years} partiesIds={[]} />
  );
};

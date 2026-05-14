"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { DonationHistoryTable } from "@/components/table/donation-history-table";
import { PartyField } from "@/types/party";

export const PartyDonationHistory = ({
  country,
  party,
  donations,
}: {
  country: CountryConfig;
  party: Party;
  donations: Donation[];
}) => {
  return (
    <DonationHistoryTable
      donations={donations}
      country={country}
      partiesIds={[party[PartyField.Id]]}
    />
  );
};

export const YearDonationHistory = ({
  country,
  years,
  donations,
}: {
  country: CountryConfig;
  years: string[];
  donations: Donation[];
}) => {
  return (
    <DonationHistoryTable
      donations={donations}
      country={country}
      years={years}
      partiesIds={[]}
    />
  );
};

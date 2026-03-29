import type { CountryConfig } from "@/types/country-config";

import { donationYear } from "../date";
import { Donation, DonationField, ReceiverId } from "../types";

export interface HistoryEntry {
  donor: string;
  amount: number;
  date: string;
  party: ReceiverId;
  id: string;
}

export const getHistory = (
  country: CountryConfig,
  donations: Donation[],
  years?: string[],
): HistoryEntry[] => {
  const history: HistoryEntry[] = [];
  years ??= country.years;

  const yearsSet = new Set(years);
  donations.forEach((donation) => {
    const year = donationYear(donation);
    if (!yearsSet.has(year)) return;

    history.push({
      id: donation[DonationField.Id],
      donor: donation[DonationField.DonorName],
      amount: donation[DonationField.Amount],
      date: donation[DonationField.Date],
      party: donation[DonationField.Receiver],
    });
  });

  return history.toReversed();
};

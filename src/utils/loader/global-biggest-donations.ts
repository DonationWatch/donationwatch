import type { Country, Currency } from "../countries";
import type { DonorType, ReceiverId } from "../types";

export interface GlobalBiggestDonation {
  id: string;
  donor: string;
  donorId: string;
  country: Country;
  party: ReceiverId;
  amount: number;
  currency: Currency;
  amountInEur: number;
  date: string;
  donorType?: DonorType;
}

export interface GlobalBiggestDonor {
  donor: string;
  donorId: string;
  country: Country;
  sum: number;
  currency: Currency;
  sumInEur: number;
  donationCount: number;
}

export const getGlobalBiggestDonations = async (): Promise<
  GlobalBiggestDonation[]
> => {
  const dataModule = await import("../../data/global/biggest-donations");
  return dataModule.default;
};

export const getGlobalBiggestDonors = async (): Promise<
  GlobalBiggestDonor[]
> => {
  const dataModule = await import("../../data/global/biggest-donors");
  return dataModule.default;
};

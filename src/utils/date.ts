import { DonationField } from "./types";

import type { Donation, IsoDate } from "./types";

export const dateDiffInDays = (a: Date, b: Date): number => {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

export const donationYear = (
  donation: Pick<Donation, DonationField.Date>,
): string => donation[DonationField.Date].substring(0, 4);

export const adjustDays = (isoDate: IsoDate, deltaInDays: number): IsoDate => {
  const date = new Date(isoDate + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + deltaInDays);
  return date.toISOString().split("T")[0] as IsoDate;
};

export const fillYears = (from: string, to: string): string[] => {
  const filled: string[] = [];
  const fromYear = Number(from);
  const toYear = Number(to);

  for (let year = fromYear; year <= toYear; year++) {
    filled.push(String(year));
  }
  return filled;
};

import { DonationField } from "./types";

export const donationDateSorter = (
  a: {
    idx: string;
    [DonationField.Date]: `${string}` | `${string}-${string}-${string}`;
    [DonationField.Id]?: string;
  },
  b: {
    idx: string;
    [DonationField.Date]: `${string}` | `${string}-${string}-${string}`;
    [DonationField.Id]?: string;
  },
) => {
  if (!a[DonationField.Date] && b[DonationField.Date]) return 1;
  if (a[DonationField.Date] && !b[DonationField.Date]) return -1;
  if (!a[DonationField.Date] && !b[DonationField.Date]) return 0;

  if (a[DonationField.Date] === b[DonationField.Date]) {
    if (a[DonationField.Id] && b[DonationField.Id])
      return a[DonationField.Id].localeCompare(b[DonationField.Id]);

    return `${b.idx ?? 0}`.localeCompare(`${a.idx ?? 0}`);
  }

  return b[DonationField.Date]! > a[DonationField.Date]! ? -1 : 1;
};

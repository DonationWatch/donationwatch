export const enum PartyStatField {
  Sum,
  Count,
  LastDonation,
  HasYearOnlyDonations,
}

export interface PartyStats {
  [PartyStatField.Sum]: number;
  [PartyStatField.Count]: number;
  [PartyStatField.LastDonation]: string;
  [PartyStatField.HasYearOnlyDonations]?: boolean;
}

import type { ReceiverId } from "@/utils/types";

export const enum PartyField {
  Id,
  Name,
  Short,
  Sum,
  Color,
  Years,
  Wiki,
}

export interface Party {
  [PartyField.Id]: ReceiverId;
  [PartyField.Name]: string;
  [PartyField.Short]: string;
  [PartyField.Sum]: number;
  [PartyField.Color]: string;
  [PartyField.Years]: [from: string, to: string];
  [PartyField.Wiki]?: number;
}

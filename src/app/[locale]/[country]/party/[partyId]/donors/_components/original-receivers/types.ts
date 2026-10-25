import type { Party } from "@/types/party";

export interface PartyViaItem {
  name: string;
  sum: number;
  count: number;
  pctOfParty: number;
  pctOfVia: number;
  years: string;
  topDonors: { name: string; sum: number }[];
}

export interface PartyViaSummary {
  party: Party;
  totalPartySum: number;
  viaSum: number;
  directSum: number;
  pctVia: number;
  pctDirect: number;
  committeeCount: number;
  items: PartyViaItem[];
  hasViaData: boolean;
}

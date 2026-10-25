import type { Donation, ReceiverId } from "@/utils/types";

export interface ConduitDestination {
  receiver: ReceiverId;
  sum: number;
  count: number;
  pct: number;
}

export interface ViaStat {
  name: string;
  sum: number;
  count: number;
  avg: number;
  parties: Record<ReceiverId, number>;
  primaryParty: ReceiverId;
  firstDate: string;
  lastDate: string;
  years: number[];
  pctOfVia: number;
  pctOfDonor: number;
  destinations: ConduitDestination[];
}

export interface ViaSummary {
  donorName: string;
  donationsWithVia: Donation[];
  totalDonorSum: number;
  totalViaSum: number;
  directSum: number;
  pctOfDonorTotal: number;
  viaList: ViaStat[];
  partyDistribution: Array<{
    party: ReceiverId;
    sum: number;
    pct: number;
  }>;
  earliestYear: string;
  latestYear: string;
  biggestConduitDonation: {
    name: string;
    amount: number;
    party: ReceiverId;
    date: string;
  } | null;
}

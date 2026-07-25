import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { PartyField } from "@/types/party";
import { PartyStatField, PartyStats } from "@/types/party-stats";

import type { PartyYearsSums } from "../loader/party-years-sums";
import type { ReceiverId } from "../types";

import { numbersSum } from "../math";

export const getPartiesSum = (
  country: CountryConfig,
  partyYearSums: PartyYearsSums,
  parties: Party[],
  years: string[],
): {
  count: number;
  sums: PartySum[];
  sum: number;
  sumNumbers: number[];
} => {
  const sums: Record<ReceiverId, { sum: number; count: number }> =
    Object.fromEntries(
      parties.map((party) => [party[PartyField.Id], { sum: 0, count: 0 }]),
    );
  const sum: number[] = [];
  const yearsSet = new Set(years);
  const partiesSet = new Set(parties.map((p) => p[PartyField.Id]));

  let donationsCount = 0;

  Object.entries(partyYearSums).forEach(([year, partySums]) => {
    if (!yearsSet.has(year)) return;

    (Object.entries(partySums) as [ReceiverId, PartyStats][]).forEach(
      ([party, stats]) => {
        if (!partiesSet.has(party)) return;

        donationsCount += stats[PartyStatField.Count];
        sum.push(stats[PartyStatField.Sum]);
        sums[party].sum += stats[PartyStatField.Sum];
        sums[party].count += stats[PartyStatField.Count];
      },
    );
  });

  const sortedSums = (Object.entries(sums) as PartySum[]).toSorted(
    ([, dataA], [, dataB]) => dataB.sum - dataA.sum,
  );

  return {
    count: donationsCount,
    sums: sortedSums,
    sumNumbers: sum,
    sum: numbersSum(sum),
  };
};

export const getSinglePartyYearsSums = (
  partyYearSums: PartyYearsSums,
  partyId: ReceiverId,
): Record<string, PartyStats> => {
  const result: Record<string, PartyStats> = {};
  for (const [year, partySums] of Object.entries(partyYearSums)) {
    if (partySums[partyId]) {
      result[year] = partySums[partyId];
    }
  }
  return result;
};

export type PartySum = [
  ReceiverId,
  {
    sum: number;
    count: number;
  },
];

import type { CountryConfig } from "@/types/country-config";

import type { PartyStats, PartyYearsSums } from "../loader/party-years-sums";
import type { Party, ReceiverId } from "../types";

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
      parties.map((party) => [party.id, { sum: 0, count: 0 }]),
    );
  const sum: number[] = [];
  const yearsSet = new Set(years);
  const partiesSet = new Set(parties.map((p) => p.id));

  let donationsCount = 0;

  Object.entries(partyYearSums).forEach(([year, partySums]) => {
    if (!yearsSet.has(year)) return;

    (Object.entries(partySums) as [ReceiverId, PartyStats][]).forEach(
      ([party, stats]) => {
        if (!partiesSet.has(party)) return;

        donationsCount += stats.count;
        sum.push(stats.sum);
        sums[party].sum += stats.sum;
        sums[party].count += stats.count;
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

export type PartySum = [
  ReceiverId,
  {
    sum: number;
    count: number;
  },
];

import type { PartyStats } from "@/types/party-stats";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ReceiverId } from "@/utils/types";

import { PartyStatField } from "@/types/party-stats";

export interface StackedPartiesConfig {
  sum: number;
  sums: [ReceiverId, number][];
}

export const partyYearsSumsToStackedConfig = (
  years: string[],
  partyYearsSums: PartyYearsSums,
): StackedPartiesConfig => {
  const sums: Record<ReceiverId, number> = {};
  let sum = 0;

  const yearsSet = new Set(years);

  Object.entries(partyYearsSums).forEach(([year, yearSums]) => {
    if (!yearsSet.has(year)) return;

    (Object.entries(yearSums) as [ReceiverId, PartyStats][]).forEach(
      ([party, partySum]) => {
        sums[party] ??= 0;
        sum += partySum[PartyStatField.Sum];
        sums[party] += partySum[PartyStatField.Sum];
      },
    );
  });

  const sortedSums = (Object.entries(sums) as [ReceiverId, number][])
    .filter(([, data]) => data > 0)
    .toSorted(([, dataA], [, dataB]) => dataB - dataA);

  return {
    sum,
    sums: sortedSums,
  };
};

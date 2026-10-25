import { useMemo } from "react";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { donationYear } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import { DonationField } from "@/utils/types";

import type { PartyViaItem, PartyViaSummary } from "./types";

export const usePartyViaSummary = (
  party: Party,
  donations: Donation[],
): PartyViaSummary => {
  return useMemo(() => {
    let totalPartySum = 0;
    let viaSum = 0;

    const map = new Map<
      string,
      {
        name: string;
        sum: number;
        count: number;
        yearsSet: Set<number>;
        donorsMap: Map<string, number>;
      }
    >();

    for (const d of donations) {
      const amt = d[DonationField.Amount];
      totalPartySum += amt;

      const via = d[DonationField.OriginalReceiver]?.trim();
      if (!via) continue;

      viaSum += amt;

      let entry = map.get(via);
      if (!entry) {
        entry = {
          name: via,
          sum: 0,
          count: 0,
          yearsSet: new Set<number>(),
          donorsMap: new Map<string, number>(),
        };
        map.set(via, entry);
      }

      entry.sum += amt;
      entry.count += 1;

      const y = parseInt(donationYear(d), 10);
      if (!isNaN(y)) {
        entry.yearsSet.add(y);
      }

      const rawDonor = d[DonationField.DonorName];
      if (rawDonor) {
        const donorName = getDonorName(rawDonor, (k) => k);
        entry.donorsMap.set(
          donorName,
          (entry.donorsMap.get(donorName) || 0) + amt,
        );
      }
    }

    const items: PartyViaItem[] = Array.from(map.values())
      .map((entry) => {
        const yearsArray = Array.from(entry.yearsSet).sort((a, b) => a - b);
        let years = "";
        if (yearsArray.length === 1) {
          years = `${yearsArray[0]}`;
        } else if (yearsArray.length > 1) {
          years = `${yearsArray[0]} – ${yearsArray[yearsArray.length - 1]}`;
        }

        const topDonors = Array.from(entry.donorsMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, sum]) => ({ name, sum }));

        return {
          name: entry.name,
          sum: entry.sum,
          count: entry.count,
          pctOfParty: totalPartySum > 0 ? entry.sum / totalPartySum : 0,
          pctOfVia: viaSum > 0 ? entry.sum / viaSum : 0,
          years,
          topDonors,
        };
      })
      .sort((a, b) => b.sum - a.sum);

    const directSum = Math.max(0, totalPartySum - viaSum);
    const pctVia = totalPartySum > 0 ? viaSum / totalPartySum : 0;
    const pctDirect = totalPartySum > 0 ? directSum / totalPartySum : 0;

    return {
      party,
      totalPartySum,
      viaSum,
      directSum,
      pctVia,
      pctDirect,
      committeeCount: items.length,
      items,
      hasViaData: viaSum > 0 && items.length > 0,
    };
  }, [donations, party]);
};

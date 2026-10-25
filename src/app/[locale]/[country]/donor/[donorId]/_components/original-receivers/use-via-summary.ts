import { useMemo } from "react";

import type { Donation, ReceiverId } from "@/utils/types";

import { donationYear } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import { DonationField } from "@/utils/types";

import type { ViaStat, ViaSummary } from "./types";

export const useViaSummary = (donations: Donation[]): ViaSummary => {
  return useMemo(() => {
    let donorSum = 0;
    let viaSum = 0;
    const withVia: Donation[] = [];
    const map = new Map<
      string,
      {
        name: string;
        sum: number;
        count: number;
        parties: Record<ReceiverId, number>;
        dates: string[];
        yearsSet: Set<number>;
        destinationsMap: Map<ReceiverId, { sum: number; count: number }>;
      }
    >();
    const partySums: Partial<Record<ReceiverId, number>> = {};

    let biggestConduitDonation: {
      name: string;
      amount: number;
      party: ReceiverId;
      date: string;
    } | null = null;

    const donorName = getDonorName(
      donations.at(0)?.[DonationField.DonorName] ?? "",
      (k) => k,
    );

    for (const d of donations) {
      const amt = d[DonationField.Amount];
      donorSum += amt;

      const via = d[DonationField.OriginalReceiver];
      if (!via) continue;

      withVia.push(d);
      viaSum += amt;

      const party = d[DonationField.Receiver];
      partySums[party] = (partySums[party] || 0) + amt;

      if (!biggestConduitDonation || amt > biggestConduitDonation.amount) {
        biggestConduitDonation = {
          name: via,
          amount: amt,
          party,
          date: d[DonationField.Date],
        };
      }

      let entry = map.get(via);
      if (!entry) {
        entry = {
          name: via,
          sum: 0,
          count: 0,
          parties: {} as Record<ReceiverId, number>,
          dates: [],
          yearsSet: new Set<number>(),
          destinationsMap: new Map(),
        };
        map.set(via, entry);
      }

      entry.sum += amt;
      entry.count += 1;
      entry.parties[party] = (entry.parties[party] || 0) + amt;

      const dest = entry.destinationsMap.get(party) || { sum: 0, count: 0 };
      dest.sum += amt;
      dest.count += 1;
      entry.destinationsMap.set(party, dest);

      const dateStr = d[DonationField.Date];
      if (dateStr) {
        entry.dates.push(dateStr);
      }
      const y = parseInt(donationYear(d), 10);
      if (!isNaN(y)) {
        entry.yearsSet.add(y);
      }
    }

    const list: ViaStat[] = Array.from(map.values())
      .map((item) => {
        const sortedParties = Object.entries(item.parties).sort(
          (a, b) => b[1] - a[1],
        );
        const primaryParty = (sortedParties[0]?.[0] || "") as ReceiverId;

        item.dates.sort();
        const firstDate = item.dates[0] || "";
        const lastDate = item.dates[item.dates.length - 1] || "";
        const years = Array.from(item.yearsSet).sort((a, b) => a - b);

        const destinations = Array.from(item.destinationsMap.entries())
          .map(([receiver, stat]) => ({
            receiver,
            sum: stat.sum,
            count: stat.count,
            pct: item.sum > 0 ? stat.sum / item.sum : 0,
          }))
          .sort((a, b) => b.sum - a.sum);

        return {
          name: item.name,
          sum: item.sum,
          count: item.count,
          avg: item.count > 0 ? item.sum / item.count : 0,
          parties: item.parties,
          primaryParty,
          firstDate,
          lastDate,
          years,
          pctOfVia: viaSum > 0 ? item.sum / viaSum : 0,
          pctOfDonor: donorSum > 0 ? item.sum / donorSum : 0,
          destinations,
        };
      })
      .sort((a, b) => b.sum - a.sum);

    const partyDistribution = Object.entries(partySums)
      .map(([party, sum]) => ({
        party: party as ReceiverId,
        sum: sum || 0,
        pct: viaSum > 0 ? (sum || 0) / viaSum : 0,
      }))
      .sort((a, b) => b.sum - a.sum);

    const allYears = Array.from(new Set(list.flatMap((c) => c.years))).sort(
      (a, b) => a - b,
    );
    const earliestYear = allYears[0] ? String(allYears[0]) : "";
    const latestYear = allYears[allYears.length - 1]
      ? String(allYears[allYears.length - 1])
      : "";

    return {
      donorName,
      donationsWithVia: withVia,
      totalDonorSum: donorSum,
      totalViaSum: viaSum,
      directSum: Math.max(0, donorSum - viaSum),
      pctOfDonorTotal: donorSum > 0 ? viaSum / donorSum : 0,
      viaList: list,
      partyDistribution,
      earliestYear,
      latestYear,
      biggestConduitDonation,
    };
  }, [donations]);
};

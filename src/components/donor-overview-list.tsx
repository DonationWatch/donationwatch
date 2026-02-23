"use client";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { DonorOverviewItem } from "./donor-overview-item";
import { DynamicDonorDonationsDetail } from "./dynamic-donor-donations-detail";
import Loading from "./loading";
import { useDonationsByParty } from "../hooks/use-api";
import { donationYear } from "../utils/date";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, Party, ReceiverId } from "../utils/types";

const DonorOverviewListContent = ({
  donors,
  countryConfig,
  sum,
}: {
  countryConfig: CountryConfig;
  sum: number;
  donors: {
    sum: number;
    name: string;
    donations: { party: ReceiverId; donation: Donation }[];
  }[];
}) => {
  const [expandedDonors, setExpandedDonors] = useState<string[]>([]);

  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const rowVirtualizer = useWindowVirtualizer({
    count: donors.length,
    estimateSize: () => 32,
    overscan: 5,
    scrollMargin:
      (listRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY,
  });

  const onVisibleChanged = useCallback(
    (index: number) => {
      const element = listRef.current?.querySelector(`[data-index="${index}"]`);
      if (!element) return;
      rowVirtualizer.measureElement(element);
    },
    [rowVirtualizer, listRef],
  );

  return (
    <div className="@container mb-8" ref={parentRef}>
      <ul
        className="relative w-full"
        ref={listRef}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const entry = donors[virtualItem.index];
          return (
            <li
              data-index={virtualItem.index}
              key={virtualItem.key}
              className="absolute top-0 left-0 flex w-full justify-between space-x-2 overflow-x-hidden"
              style={{
                transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`,
              }}
            >
              <DonorOverviewItem
                name={entry.name}
                country={countryConfig}
                amount={entry.sum}
                rank={virtualItem.index + 1}
                sum={sum}
                expanded={expandedDonors.includes(entry.name)}
                onToggleExpanded={(expanded) => {
                  setExpandedDonors((prev) => {
                    onVisibleChanged(virtualItem.index);

                    if (expanded) return [...prev, entry.name];
                    return prev.filter((id) => id !== entry.name);
                  });
                }}
                detail={
                  <DynamicDonorDonationsDetail
                    donor={entry}
                    country={countryConfig}
                  />
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const DonorOverviewList = ({
  countryConfig,
  party,
}: {
  countryConfig: CountryConfig;
  party: Party;
}) => {
  const tData = useTranslations("data");
  const { data, error, isLoading } = useDonationsByParty(countryConfig, party);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{tData("error")}</div>;

  const donations = data;

  let sum = 0;
  const yearDonations: Record<string, number[]> = {};
  const donorDonations: Record<string, number> = {};
  const donorNames: Record<string, string> = {};

  const partyDonations: Donation[] = [];
  donations.map((donation) => {
    if (donation[DonationField.Receiver] !== party.id) return;

    const year = donationYear(donation);

    yearDonations[year] ??= [];
    yearDonations[year].push(donation[DonationField.Amount]);

    const donor = donation[DonationField.DonorName];
    donorNames[donor] = donor;
    donorDonations[donor] ??= 0;
    donorDonations[donor] += donation[DonationField.Amount];

    partyDonations.push(donation);
  });

  const donorRegistry: Record<
    string,
    {
      sum: number;
      name: string;
      donations: { party: ReceiverId; donation: Donation }[];
    }
  > = {};

  // group donations by donor
  partyDonations.forEach((donation) => {
    const donor = donation[DonationField.DonorName];
    // normalize so the registry has an empty array for each donator
    donorRegistry[donor] ??= {
      sum: 0,
      name: donor,
      donations: [],
    };

    donorRegistry[donor].sum += donation[DonationField.Amount];
    donorRegistry[donor].donations.push({
      party: party.id,
      donation,
    });
  });

  partyDonations.forEach((donation) => {
    sum += donation[DonationField.Amount];
  });

  const sortedDonors = Object.values(donorRegistry).toSorted(
    (a, b) => b.sum - a.sum,
  );

  return (
    <DonorOverviewListContent
      donors={sortedDonors}
      sum={sum}
      countryConfig={countryConfig}
    />
  );
};

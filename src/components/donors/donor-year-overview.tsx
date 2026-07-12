"use client";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Donation, ReceiverId } from "@/utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { donationYear } from "@/utils/date";
import { DonationField } from "@/utils/types";

import { DonorOverviewItem } from "./donor-overview-item";
import { DynamicDonorDonationsDetail } from "./dynamic-donor-donations-detail";

const DonorYearOverviewContent = ({
  donations,
  years,
  country,
}: {
  donations: Donation[];
  years: string[];
  country: CountryConfig;
}) => {
  // useWindowVirtualizer doesn't support directDomUpdates yet, so we opt out of React Compiler
  // see https://github.com/TanStack/virtual/issues/736
  "use no memo";
  const donorRegistry: Record<
    string,
    {
      sum: number;
      name: string;
      donations: { party: ReceiverId; donation: Donation }[];
    }
  > = {};

  const [expandedDonors, setExpandedDonors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tSearch = useTranslations("search");

  let sum = 0;

  donations.forEach((donation) => {
    // skip not selected year
    if (!years.includes(donationYear(donation))) return;
    const party = donation[DonationField.Receiver];

    const donor = donation[DonationField.DonorName];
    // normalize so the registry has an empty array for each donator
    donorRegistry[donor] ??= {
      sum: 0,
      name: donor,
      donations: [],
    };
    donorRegistry[donor].sum += donation[DonationField.Amount];
    sum += donation[DonationField.Amount];
    donorRegistry[donor].donations.push({ party, donation });
  });

  // transform the registry to a sorted list by sum
  const sortedDonors = Object.values(donorRegistry).toSorted(
    (a, b) => b.sum - a.sum,
  );

  const donorsWithRank = useMemo(() => {
    return sortedDonors.map((d, index) => ({ ...d, originalRank: index + 1 }));
  }, [sortedDonors]);

  const filteredDonors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return donorsWithRank;
    return donorsWithRank.filter((d) => d.name.toLowerCase().includes(q));
  }, [donorsWithRank, searchQuery]);

  // The scrollable element for your list
  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: filteredDonors.length,
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
    <div className="flex flex-col gap-4" ref={parentRef}>
      <div className="relative w-full md:max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          name="donor-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={tSearch("filter")}
          aria-label={tSearch("filter")}
          className="w-full rounded-md border border-slate-200 bg-white py-1.5 pr-3 pl-8 text-sm outline-none placeholder:text-slate-500 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:focus:border-slate-500"
        />
      </div>

      {filteredDonors.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          {tSearch("empty")}
        </div>
      ) : (
        <div className="@container">
          <ul
            className="relative w-full"
            ref={listRef}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const donor = filteredDonors[virtualItem.index];
              return (
                <li
                  data-index={virtualItem.index}
                  key={virtualItem.key}
                  className="border-border hover:bg-muted/50 absolute top-0 left-0 flex w-full justify-between space-x-2 border-b"
                  style={{
                    transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`,
                  }}
                >
                  <DonorOverviewItem
                    name={donor.name}
                    amount={donor.sum}
                    rank={donor.originalRank}
                    sum={sum}
                    country={country}
                    expanded={expandedDonors.includes(donor.name)}
                    onToggleExpanded={(expanded) => {
                      setExpandedDonors((prev) => {
                        onVisibleChanged(virtualItem.index);

                        if (expanded) return [...prev, donor.name];
                        return prev.filter((id) => id !== donor.name);
                      });
                    }}
                    detail={
                      <DynamicDonorDonationsDetail
                        donor={donor}
                        country={country}
                      />
                    }
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export const DonorYearOverview = ({
  country,
  years,
  donations,
}: {
  years: string[];
  country: CountryConfig;
  donations: Donation[];
}) => {
  return (
    <DonorYearOverviewContent
      donations={donations}
      years={years}
      country={country}
    />
  );
};

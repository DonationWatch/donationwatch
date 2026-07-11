import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { Search } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Donation, ReceiverId } from "@/utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { type Party, PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { DonationField } from "@/utils/types";

import { DonorOverviewItem } from "./donor-overview-item";
import { DynamicDonorDonationsDetail } from "./dynamic-donor-donations-detail";

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
  // useWindowVirtualizer doesn't support directDomUpdates yet, so we opt out of React Compiler
  // see https://github.com/TanStack/virtual/issues/736
  "use no memo";
  const [expandedDonors, setExpandedDonors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const tSearch = useTranslations("search");

  const donorsWithRank = useMemo(() => {
    return donors.map((d, index) => ({ ...d, originalRank: index + 1 }));
  }, [donors]);

  const filteredDonors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return donorsWithRank;
    return donorsWithRank.filter((d) => d.name.toLowerCase().includes(q));
  }, [donorsWithRank, searchQuery]);

  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

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
    <div className="mb-8 flex flex-col gap-4" ref={parentRef}>
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
              const entry = filteredDonors[virtualItem.index];
              return (
                <li
                  data-index={virtualItem.index}
                  key={virtualItem.key}
                  className="border-border hover:bg-muted/50 absolute top-0 left-0 flex w-full justify-between space-x-2 overflow-x-hidden border-b"
                  style={{
                    transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`,
                  }}
                >
                  <DonorOverviewItem
                    name={entry.name}
                    country={countryConfig}
                    amount={entry.sum}
                    rank={entry.originalRank}
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
      )}
    </div>
  );
};

export const DonorOverviewList = ({
  countryConfig,
  party,
  donations: data,
}: {
  countryConfig: CountryConfig;
  party: Party;
  donations: Donation[];
}) => {
  const donations = data;

  let sum = 0;
  const yearDonations: Record<string, number[]> = {};
  const donorDonations: Record<string, number> = {};
  const donorNames: Record<string, string> = {};

  const partyDonations: Donation[] = [];
  donations.map((donation) => {
    if (donation[DonationField.Receiver] !== party[PartyField.Id]) return;

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
      party: party[PartyField.Id],
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

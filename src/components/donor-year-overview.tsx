"use client";

import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { type FC, useCallback, useRef, useState } from "react";

import { DonorOverviewItem } from "./donor-overview-item";
import { DynamicDonorDonationsDetail } from "./dynamic-donor-donations-detail";
import Loading from "./loading";
import { useDonationsByYears } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";
import { isNotNullandNotUndefined } from "../utils/array";
import { donationYear } from "../utils/date";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, ReceiverId } from "../utils/types";
import type { Translations } from "@/messages/translations";

const DonorYearOverviewContent: FC<{
  donations: Donation[];
  years: string[];
  country: CountryConfig;
  translations: Translations;
}> = ({ donations, years, country, translations }) => {
  const donorRegistry: Record<
    string,
    {
      sum: number;
      name: string;
      donations: { party: ReceiverId; donation: Donation }[];
    }
  > = {};

  const [expandedDonors, setExpandedDonors] = useState<string[]>([]);

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

  // The scrollable element for your list
  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // The virtualizer
  const rowVirtualizer = useWindowVirtualizer({
    count: sortedDonors.length,
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
    <div className="@container" ref={parentRef}>
      <ul
        className="relative w-full"
        ref={listRef}
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const donor = sortedDonors[virtualItem.index];
          return (
            <li
              data-index={virtualItem.index}
              key={virtualItem.key}
              className="absolute top-0 left-0 flex w-full justify-between space-x-2"
              style={{
                transform: `translateY(${virtualItem.start - rowVirtualizer.options.scrollMargin}px)`,
              }}
            >
              <DonorOverviewItem
                translations={translations}
                name={donor.name}
                amount={donor.sum}
                rank={virtualItem.index + 1}
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
  );
};

export const DonorYearOverview: FC<{
  years: string[];
  country: CountryConfig;
}> = ({ country, years }) => {
  const { translations } = useTranslations();
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{translations.data_error}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <DonorYearOverviewContent
      translations={translations}
      donations={donations}
      years={years}
      country={country}
    />
  );
};

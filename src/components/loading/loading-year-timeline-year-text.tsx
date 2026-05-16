"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const YearTimelineYearText = ({
  parties,
  years,
  country,
  donations,
}: {
  country: CountryConfig;
  parties: Party[];
  years: string[];
  donations: Donation[];
}) => {
  const browserBasedLocale = useBrowserBasedLocale();

  const partiesSet = new Set<string>(parties.map((p) => p[PartyField.Id]));

  let total = 0;
  const perYearSums: Record<string, number> = {};

  donations.forEach((donation) => {
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    const year = donationYear(donation);
    if (!years.includes(year)) return;

    total += donation[DonationField.Amount];
    perYearSums[year] ??= 0;
    perYearSums[year] += donation[DonationField.Amount];
  });

  const sortedEntries = Object.entries(perYearSums).toSorted(([a], [b]) =>
    a.localeCompare(b),
  );

  if (sortedEntries.length === 0) return null;

  return (
    <ul className="mx-2 py-2 text-sm *:py-1">
      {sortedEntries.map(([year, yearSum]) => (
        <li
          key={year}
          className="flex w-full items-center justify-between text-sm font-semibold"
        >
          <span>{year}</span>
          <span className="tabular-nums">
            <span>
              {formatCountryCurrency(browserBasedLocale, yearSum, country)}
            </span>{" "}
            <span
              className={
                "hidden w-14 text-right text-gray-500 lg:inline-block dark:text-gray-400"
              }
            >
              ({formatPercentFormat(browserBasedLocale, yearSum / total)})
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

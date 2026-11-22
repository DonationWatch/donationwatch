"use client";

import type { Party } from "@donationwatch/core/types/party";
import type { Donation } from "@donationwatch/core/utils/types";
import type { ReactNode } from "react";

import { PartyField } from "@donationwatch/core/types/party";
import { donationYear } from "@donationwatch/core/utils/date";
import {
  formatCountryCurrency,
  formatPercentFormat,
} from "@donationwatch/core/utils/formatter";
import { DonationField } from "@donationwatch/core/utils/types";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const PartyTimelineText = ({
  party,
  donations,
  chart,
}: {
  party: Party;
  donations: Donation[];
  chart?: ReactNode;
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const browserBasedLocale = useBrowserBasedLocale();

  let sum = 0;
  const perYearSums: Record<string, number> = {};

  donations.forEach((donation) => {
    if (donation[DonationField.Receiver] !== party[PartyField.Id]) return;

    const year = donationYear(donation);
    sum += donation[DonationField.Amount];
    perYearSums[year] ??= 0;
    perYearSums[year] += donation[DonationField.Amount];
  });

  return (
    <>
      <p className="mb-6">
        {t("party.timeline.detail.per_year", {
          party: party[PartyField.Short],
        })}
      </p>
      {chart ? <div className="mb-6">{chart}</div> : null}
      <ul className="mx-2 py-2 text-sm *:py-1">
        {Object.entries(perYearSums).map(([year, yearSum]) => {
          return (
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
                  ({formatPercentFormat(browserBasedLocale, yearSum / sum)})
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

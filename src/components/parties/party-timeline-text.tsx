"use client";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const PartyTimelineText = ({
  party,
  donations,
}: {
  party: Party;
  donations: Donation[];
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

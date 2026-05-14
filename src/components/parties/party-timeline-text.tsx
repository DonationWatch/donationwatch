"use client";
import { useLocale } from "next-intl";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const PartyTimelineText = ({
  party,
  country,
  donations,
}: {
  country: CountryConfig;
  party: Party;
  donations: Donation[];
}) => {
  const t = useTranslations();
  const locale = useLocale();

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
                <span>{formatCountryCurrency(locale, yearSum, country)}</span>{" "}
                <span
                  className={
                    "hidden w-14 text-right text-gray-500 lg:inline-block dark:text-gray-400"
                  }
                >
                  ({formatPercentFormat(locale, yearSum / sum)})
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

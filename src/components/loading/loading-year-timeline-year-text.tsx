"use client";
import { useLocale } from "next-intl";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { isNotNullandNotUndefined } from "@/utils/array";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const LoadingYearTimelineYearText = ({
  parties,
  years,
  country,
}: {
  country: CountryConfig;
  parties: Party[];
  years: string[];
}) => {
  const tData = useTranslations("data");
  const locale = useLocale();
  const results = useDonationsByYears(country, years);

  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  const partiesSet = new Set<string>(parties.map((p) => p[PartyField.Id]));
  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

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
            <span>{formatCountryCurrency(locale, yearSum, country)}</span>{" "}
            <span
              className={
                "hidden w-14 text-right text-gray-500 lg:inline-block dark:text-gray-400"
              }
            >
              ({formatPercentFormat(locale, yearSum / total)})
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
};

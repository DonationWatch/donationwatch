"use client";
import { useTranslations, useLocale } from "next-intl";

import type { CountryConfig } from "@/utils/countries";
import type { Party } from "@/utils/types";

import Loading from "@/components/loading";
import { useDonationsByParty } from "@/hooks/use-api";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatPercentFormat } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const PartyTimelineText = ({
  party,
  country,
}: {
  country: CountryConfig;
  party: Party;
}) => {
  const t = useTranslations();
  const tData = useTranslations("data");
  const locale = useLocale();
  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{tData("error")}</div>;

  let sum = 0;
  const donations = data;
  const perYearSums: Record<string, number> = {};

  donations.forEach((donation) => {
    if (donation[DonationField.Receiver] !== party.id) return;

    const year = donationYear(donation);
    sum += donation[DonationField.Amount];
    perYearSums[year] ??= 0;
    perYearSums[year] += donation[DonationField.Amount];
  });

  return (
    <>
      <p className="mb-6">
        {t("party.timeline.detail.per_year", { party: party.short })}
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

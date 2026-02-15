"use client";

import Loading from "./loading";
import { useDonationsByParty, useDonationsByYears } from "../hooks/use-api";
import { isNotNullandNotUndefined } from "../utils/array";
import { DonationHistoryTable } from "./table/donation-history-table";
import { useTranslations } from "../hooks/use-translations";

import type { CountryConfig } from "../utils/countries";
import type { Party } from "../utils/types";

export const PartyDonationHistory = ({
  country,
  party,
}: {
  country: CountryConfig;
  party: Party;
}) => {
  const { translations } = useTranslations();
  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading)
    return (
      <div
        className="cursor-wait space-y-2"
        aria-label={translations.loading}
        title={translations.loading}
      >
        <Loading />
      </div>
    );

  if (error || !data) return <div>{translations.data_error}</div>;

  return (
    <DonationHistoryTable
      donations={data}
      country={country}
      partiesIds={[party.id]}
    />
  );
};

export const YearDonationHistory = ({
  country,
  years,
}: {
  country: CountryConfig;
  years: string[];
}) => {
  const { translations } = useTranslations();
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading)
    return (
      <div
        className="cursor-wait space-y-2"
        aria-label={translations.loading}
        title={translations.loading}
      >
        <Loading />
      </div>
    );

  if (error) return <div>{translations.data_error}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <DonationHistoryTable
      donations={donations}
      country={country}
      years={years}
      partiesIds={[]}
    />
  );
};

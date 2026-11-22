"use client";

import type { Party } from "@donationwatch/core/types/party";
import type { PartyStats } from "@donationwatch/core/types/party-stats";

import { PartyField } from "@donationwatch/core/types/party";
import { PartyStatField } from "@donationwatch/core/types/party-stats";
import { Features, hasFeature } from "@donationwatch/core/utils/features";
import {
  formatCountryCurrency,
  formatNumber,
} from "@donationwatch/core/utils/formatter";
import { getLongName } from "@donationwatch/core/utils/party";
import { useEffect, useMemo } from "react";

import { MetaCard } from "@/components/meta-card";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";

export const PartyClientPageHead = ({
  party,
  partyYearsSums,
}: {
  party: Party;
  partyYearsSums: Record<string, PartyStats>;
}) => {
  const countryConfig = useRequiredCountryConfig();
  const locale = useBrowserBasedLocale();
  const t = useTranslations();
  const {
    state: { isFiltered, filteredYears, filteredDonations, stats },
    actions: { setYearStats, setAvailableRange },
  } = useFilterEngine();

  useEffect(() => {
    const sumsByYear: Record<number, number> = {};

    Object.entries(partyYearsSums).forEach(([yearStr, pSum]) => {
      sumsByYear[parseInt(yearStr, 10)] = pSum[PartyStatField.Sum];
    });

    const activeYears = Object.keys(sumsByYear)
      .map((y) => parseInt(y, 10))
      .toSorted((a, b) => a - b);
    if (activeYears.length > 0) {
      setAvailableRange([activeYears[0], activeYears[activeYears.length - 1]]);
    } else {
      setAvailableRange(null);
    }

    setYearStats(sumsByYear);
    return () => {
      setYearStats(null);
      setAvailableRange(null);
    };
  }, [partyYearsSums, party, setYearStats, setAvailableRange]);

  const { donationCount, donationSum } = useMemo(() => {
    if (filteredDonations && (filteredDonations.length > 0 || isFiltered)) {
      return {
        donationCount: stats.donationCount,
        donationSum: stats.totalAmount,
      };
    }

    let count = 0;
    let sum = 0;
    const filteredYearsSet = new Set(filteredYears);

    Object.entries(partyYearsSums).forEach(([yearStr, sumsObj]) => {
      if (isFiltered && !filteredYearsSet.has(yearStr)) return;

      count += sumsObj[PartyStatField.Count];
      sum += sumsObj[PartyStatField.Sum];
    });

    return { donationCount: count, donationSum: sum };
  }, [
    filteredDonations,
    isFiltered,
    stats,
    partyYearsSums,
    party,
    filteredYears,
  ]);

  const longName = getLongName(party);
  return (
    <>
      <div
        className="mb-4"
        data-toc-header=""
        data-toc-header-label={t("years.title")}
        data-toc-header-title={party[PartyField.Short]}
        data-toc-header-color={party[PartyField.Color]}
        data-toc-header-subtitle={
          party[PartyField.Short] !== longName ? longName : undefined
        }
      >
        <h2 className="mb-2 text-zinc-500 dark:text-zinc-300">
          {t("years.title")}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-3xl font-semibold sm:text-4xl" id="hero-label">
            {party[PartyField.Short]}
          </h3>
          {party[PartyField.Abbr] &&
          party[PartyField.Abbr] !== party[PartyField.Short] ? (
            <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-0.5 align-middle text-base font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {party[PartyField.Abbr]}
            </span>
          ) : null}
        </div>
        {party[PartyField.Short] !== getLongName(party) ? (
          <h4 className="mt-1 text-lg">{getLongName(party)}</h4>
        ) : null}
      </div>
      <div className="mb-3">
        <div className="flex-row space-y-2 sm:flex sm:space-y-0 sm:space-x-10">
          {hasFeature(countryConfig, Features.Donors) ? (
            <MetaCard
              title={t("donation_count")}
              value={formatNumber(locale, donationCount)}
            />
          ) : null}
          <MetaCard
            title={t("sum")}
            value={formatCountryCurrency(locale, donationSum, countryConfig)}
          />
          {hasFeature(countryConfig, Features.Donors) && donationCount > 1 && (
            <MetaCard
              title={t("average")}
              value={formatCountryCurrency(
                locale,
                donationSum / donationCount,
                countryConfig,
              )}
            />
          )}
        </div>
      </div>
    </>
  );
};

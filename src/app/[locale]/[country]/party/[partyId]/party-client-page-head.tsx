"use client";

import { useEffect, useMemo } from "react";

import type { Party } from "@/types/party";
import type { PartyStats } from "@/types/party-stats";

import { MetaCard } from "@/components/meta-card";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { PartyField } from "@/types/party";
import { PartyStatField } from "@/types/party-stats";
import { Features, hasFeature } from "@/utils/features";
import { formatCountryCurrency, formatNumber } from "@/utils/formatter";
import { getLongName } from "@/utils/party";

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
    isFiltered,
    filteredYears,
    setYearStats,
    setAvailableRange,
    filteredDonations,
    stats,
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

  const showExtendedMeta = true;

  return (
    <>
      <div className="mb-4">
        <h2 className="mb-2 text-zinc-500 dark:text-zinc-300">
          {t("years.title")}
        </h2>
        <h3 className="text-3xl font-semibold sm:text-4xl" id="hero-label">
          {party[PartyField.Short]}
        </h3>
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
          {hasFeature(countryConfig, Features.Donors) &&
            showExtendedMeta &&
            donationCount > 1 && (
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

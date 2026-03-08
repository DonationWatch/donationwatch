"use client";

import { useQueries } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { useLocale } from "next-intl";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import { DonorLink } from "./donor-link";
import { ArticleSection } from "./layout/article";
import Loading from "./loading";
import { PartyDot } from "./party-dot";
import { Button } from "./ui/button";
import { YearRangeSelector } from "./year-range-selector";
import { firstItem, lastItem } from "../utils/array";
import { QUERY_PARAM_BUILD_TS } from "../utils/config";
import { donationYear } from "../utils/date";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatNumber,
  formatPercentFormat,
  formatYearsRange,
} from "../utils/formatter";
import { getBuild } from "../utils/loader/build";
import { DonationField, DonorType } from "../utils/types";

import type { NonEmptyArray } from "../utils/array";
import type { CountryConfig } from "../utils/countries";
import type { Donation, Party, ReceiverId } from "../utils/types";
import type { DonationsDocumentWithoutDonorIds } from "@/lib/api/donations-document";
import type { RootTranslator } from "@/utils/translator";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { donationDocumentToDonations } from "@/lib/api/donations-document";
import { partyColor } from "@/utils/color";

const MAX_PARTY_SELECTION = 4;
const OVERLAP_MAX = 25;
const NO_DATA_TEXT = "-";

interface PartyStats {
  party: Party;
  donations: Donation[];
  totalSum: number;
  count: number;
  average: number;
  median: number;
  uniqueDonors: Set<string>;
  largestDonation: Donation | undefined;
  topDonor: { name: string; sum: number } | undefined;
  mostFrequentDonor: { name: string; count: number } | undefined;
  firstYear: string;
  lastYear: string;
  mostActiveYear: { year: string; sum: number } | undefined;
  yearWithMostDonations: { year: string; count: number } | undefined;
  topDonors: { name: string; sum: number }[];
  donorTypeBreakdown: {
    type: DonorType;
    label: string;
    sum: number;
    count: number;
    percentage: number;
  }[];
}

function computePartyStats(
  party: Party,
  donations: Donation[],
  t: RootTranslator,
): PartyStats {
  const partyDonations = donations.filter(
    (d) => d[DonationField.Receiver] === party.id,
  );

  let totalSum = 0;
  const donorSums: Record<string, number> = {};
  const donorCounts: Record<string, number> = {};
  const yearSums: Record<string, number> = {};
  const yearCounts: Record<string, number> = {};
  const uniqueDonors = new Set<string>();
  let amounts: number[] = [];

  let largestDonation: Donation | undefined;

  for (const donation of partyDonations) {
    const amount = donation[DonationField.Amount];
    const donor = donation[DonationField.DonorName];
    const year = donationYear(donation);

    totalSum += amount;
    amounts.push(amount);
    uniqueDonors.add(donor);

    donorSums[donor] = (donorSums[donor] ?? 0) + amount;
    donorCounts[donor] = (donorCounts[donor] ?? 0) + 1;
    yearSums[year] = (yearSums[year] ?? 0) + amount;
    yearCounts[year] = (yearCounts[year] ?? 0) + 1;

    if (!largestDonation || amount > largestDonation[DonationField.Amount]) {
      largestDonation = donation;
    }
  }

  // Median
  amounts = amounts.toSorted((a, b) => a - b);

  const median =
    amounts.length === 0
      ? 0
      : amounts.length % 2 === 1
        ? amounts[Math.floor(amounts.length / 2)]
        : (amounts[Math.floor(amounts.length / 2) - 1] +
            amounts[Math.floor(amounts.length / 2)]) /
          2;

  // Top donor by sum
  const topDonorEntry = Object.entries(donorSums).toSorted(
    (a, b) => b[1] - a[1],
  )[0];
  const topDonor = topDonorEntry
    ? { name: topDonorEntry[0], sum: topDonorEntry[1] }
    : undefined;

  // Top 3 donors
  const topDonors = Object.entries(donorSums)
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, sum]) => ({ name, sum }));

  // Most frequent donor
  const maxCount = Math.max(0, ...Object.values(donorCounts));
  const frequentDonors = Object.entries(donorCounts).filter(
    ([, c]) => c === maxCount,
  );
  const mostFrequentDonor =
    frequentDonors.length === 1
      ? { name: frequentDonors[0][0], count: frequentDonors[0][1] }
      : undefined;

  // Year stats
  const years = Object.keys(yearSums).toSorted();
  const firstYear = years[0] ?? "";
  const lastYear = years.at(-1) ?? "";

  const mostActiveYearEntry = Object.entries(yearSums).toSorted(
    (a, b) => b[1] - a[1],
  )[0];
  const mostActiveYear = mostActiveYearEntry
    ? { year: mostActiveYearEntry[0], sum: mostActiveYearEntry[1] }
    : undefined;

  const yearWithMostDonationsEntry = Object.entries(yearCounts).toSorted(
    (a, b) => b[1] - a[1],
  )[0];
  const yearWithMostDonations = yearWithMostDonationsEntry
    ? {
        year: yearWithMostDonationsEntry[0],
        count: yearWithMostDonationsEntry[1],
      }
    : undefined;

  // Donor type breakdown
  const typeSums: Partial<Record<DonorType, { sum: number; count: number }>> =
    {};
  for (const donation of partyDonations) {
    const dt = donation[DonationField.DonorType] ?? DonorType.Other;
    typeSums[dt] ??= { sum: 0, count: 0 };
    typeSums[dt]!.sum += donation[DonationField.Amount];
    typeSums[dt]!.count++;
  }
  const donorTypeBreakdown = Object.entries(typeSums)
    .map(([type, stats]) => ({
      type: Number(type) as DonorType,
      label: t(`donor_type.${Number(type) as DonorType}`),
      sum: stats.sum,
      count: stats.count,
      percentage: totalSum > 0 ? stats.sum / totalSum : 0,
    }))
    .toSorted((a, b) => b.sum - a.sum);

  return {
    party,
    donations: partyDonations,
    totalSum,
    count: partyDonations.length,
    average: partyDonations.length > 0 ? totalSum / partyDonations.length : 0,
    median,
    uniqueDonors,
    largestDonation,
    topDonor,
    mostFrequentDonor,
    firstYear,
    lastYear,
    mostActiveYear,
    yearWithMostDonations,
    topDonors,
    donorTypeBreakdown,
  };
}

interface OverlappingDonor {
  name: string;
  /** Per-party stats for this donor, keyed by ReceiverId */
  perParty: Record<ReceiverId, { sum: number; count: number }>;
  partyCount: number;
  totalSum: number;
}

function computeOverlappingDonors(
  statsArray: PartyStats[],
): OverlappingDonor[] {
  const donorData: Record<
    string,
    Record<ReceiverId, { sum: number; count: number }>
  > = {};

  for (const stats of statsArray) {
    for (const donation of stats.donations) {
      const donor = donation[DonationField.DonorName];
      const amount = donation[DonationField.Amount];
      donorData[donor] ??= {};
      donorData[donor][stats.party.id] ??= { sum: 0, count: 0 };
      donorData[donor][stats.party.id].sum += amount;
      donorData[donor][stats.party.id].count += 1;
    }
  }

  return Object.entries(donorData)
    .filter(([, perParty]) => Object.keys(perParty).length >= 2)
    .map(([name, perParty]) => {
      const totalSum = Object.values(perParty).reduce(
        (acc, d) => acc + d.sum,
        0,
      );
      return {
        name,
        perParty,
        partyCount: Object.keys(perParty).length,
        totalSum,
      };
    })
    .toSorted((a, b) => b.totalSum - a.totalSum);
}

/**
 * Finds the party with the highest value for a given numeric extractor.
 * Returns the ReceiverId of the winner, or undefined if tied / no data.
 */
function findWinner(
  allStats: PartyStats[],
  extractor: (s: PartyStats) => number,
): ReceiverId | undefined {
  if (allStats.length < 2) return undefined;
  let best: PartyStats | undefined;
  let bestValue = -Infinity;
  let tied = false;

  for (const stats of allStats) {
    const value = extractor(stats);
    if (value > bestValue) {
      best = stats;
      bestValue = value;
      tied = false;
    } else if (value === bestValue) {
      tied = true;
    }
  }

  if (tied || !best) return undefined;
  return best.party.id;
}

const jsonFetcher = <T = unknown,>(input: RequestInfo): Promise<T> =>
  fetch(input).then((res) => {
    if (!res.ok) throw new Error(`Network response was not ok: ${res.status}`);
    return res.json();
  });

/** A single row definition for the comparison table */
interface ComparisonRow {
  label: string;
  values: (stats: PartyStats) => React.ReactNode;
  winner?: ReceiverId;
}

export const PartyComparison = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
  const t = useTranslations();
  const tCompareParties = useTranslations("compare_parties");
  const tData = useTranslations("data");
  const locale = useLocale();
  const [partiesParam, setPartiesParam] = useQueryState(
    "parties",
    parseAsArrayOf(parseAsString).withDefault([]),
  );
  const selectedPartyIds = new Set(partiesParam as ReceiverId[]);

  // Year filter state
  const lastLegislativeYear = countryConfig.legislativeYears
    ? lastItem(countryConfig.legislativeYears)
    : ([countryConfig.years.at(0)!] as NonEmptyArray<string>);
  const [fromYear, setFromYear] = useQueryState(
    "from",
    parseAsString.withDefault(firstItem(lastLegislativeYear)),
  );
  const [toYear, setToYear] = useQueryState(
    "to",
    parseAsString.withDefault(lastItem(lastLegislativeYear)),
  );
  const isAllYears =
    fromYear === countryConfig.years[0] &&
    toYear === countryConfig.years[countryConfig.years.length - 1];

  const build = getBuild(countryConfig.id).t;

  const selectedParties = countryConfig.parties.filter((p) =>
    selectedPartyIds.has(p.id),
  );

  const results = useQueries<UseQueryOptions<Donation[]>[]>({
    queries: selectedParties.map((party) => ({
      queryKey: [countryConfig.id, "donations", "by-party", party.id],
      queryFn: () =>
        jsonFetcher<DonationsDocumentWithoutDonorIds>(
          `/data/${countryConfig.id}/donations/by-party/${party.id}.json?${QUERY_PARAM_BUILD_TS}=${build}`,
        ).then((doc) => donationDocumentToDonations(doc)),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const hasError = results.some((r) => r.error);

  const toggleParty = (partyId: ReceiverId) => {
    setPartiesParam((prev) => {
      const next = new Set(prev);
      if (next.has(partyId)) {
        next.delete(partyId);
      } else {
        if (next.size >= MAX_PARTY_SELECTION) return Array.from(next);
        next.add(partyId);
      }
      return Array.from(next);
    });
  };

  // Filter donations by selected year range
  const filterDonationsByYear = useMemo(() => {
    if (isAllYears) return (donations: Donation[]) => donations;
    return (donations: Donation[]) =>
      donations.filter((d) => {
        const year = donationYear(d);
        return year >= fromYear && year <= toYear;
      });
  }, [fromYear, toYear, isAllYears]);

  // Compute stats for loaded parties
  const allStats: PartyStats[] = [];
  for (let i = 0; i < selectedParties.length; i++) {
    const result = results[i];
    if (result?.data) {
      allStats.push(
        computePartyStats(
          selectedParties[i],
          filterDonationsByYear(result.data),
          t,
        ),
      );
    }
  }

  const overlappingDonors =
    allStats.length >= 2 ? computeOverlappingDonors(allStats) : [];
  const canCompare = selectedPartyIds.size >= 2;

  // Winner calculations
  const winners = {
    totalSum: findWinner(allStats, (s) => s.totalSum),
    count: findWinner(allStats, (s) => s.count),
    average: findWinner(allStats, (s) => s.average),
    median: findWinner(allStats, (s) => s.median),
    uniqueDonors: findWinner(allStats, (s) => s.uniqueDonors.size),
    topDonorSum: findWinner(allStats, (s) => s.topDonor?.sum ?? 0),
    mostFrequentCount: findWinner(
      allStats,
      (s) => s.mostFrequentDonor?.count ?? 0,
    ),
    largestDonation: findWinner(
      allStats,
      (s) => s.largestDonation?.[DonationField.Amount] ?? 0,
    ),
    mostActiveYearSum: findWinner(allStats, (s) => s.mostActiveYear?.sum ?? 0),
    yearWithMostDonationsCount: findWinner(
      allStats,
      (s) => s.yearWithMostDonations?.count ?? 0,
    ),
  };

  // Row definitions per section
  const overviewRows: ComparisonRow[] = [
    {
      label: tCompareParties("stats.sum"),
      values: (s) => formatCountryCurrency(locale, s.totalSum, countryConfig),
      winner: winners.totalSum,
    },
    {
      label: tCompareParties("stats.count"),
      values: (s) => formatNumber(locale, s.count),
      winner: winners.count,
    },
    {
      label: tCompareParties("stats.avg"),
      values: (s) => formatCountryCurrency(locale, s.average, countryConfig),
      winner: winners.average,
    },
    {
      label: tCompareParties("stats.median"),
      values: (s) => formatCountryCurrency(locale, s.median, countryConfig),
      winner: winners.median,
    },
  ];

  const timelineRows: ComparisonRow[] = [
    {
      label: tCompareParties("stats.first_year"),
      values: (s) => s.firstYear || NO_DATA_TEXT,
    },
    {
      label: tCompareParties("stats.last_year"),
      values: (s) => s.lastYear || NO_DATA_TEXT,
    },
    {
      label: tCompareParties("stats.active_year_sum"),
      values: (s) =>
        s.mostActiveYear ? (
          <TwoLineCell
            primary={s.mostActiveYear.year}
            secondary={formatCountryCurrency(
              locale,
              s.mostActiveYear.sum,
              countryConfig,
            )}
          />
        ) : (
          NO_DATA_TEXT
        ),
      winner: winners.mostActiveYearSum,
    },
    {
      label: tCompareParties("stats.active_year_count"),
      values: (s) =>
        s.yearWithMostDonations ? (
          <TwoLineCell
            primary={s.yearWithMostDonations.year}
            secondary={tCompareParties("n_donations", {
              count: formatNumber(locale, s.yearWithMostDonations.count),
            })}
          />
        ) : (
          NO_DATA_TEXT
        ),
      winner: winners.yearWithMostDonationsCount,
    },
  ];

  const donorRows: ComparisonRow[] = [
    {
      label: tCompareParties("stats.unique_donors"),
      values: (s) => formatNumber(locale, s.uniqueDonors.size),
      winner: winners.uniqueDonors,
    },
    {
      label: tCompareParties("stats.top_donor"),
      values: (s) =>
        s.topDonor ? (
          <TwoLineCell
            primary={
              <DonorLink country={countryConfig} donor={s.topDonor.name} />
            }
            secondary={formatCountryCurrency(
              locale,
              s.topDonor.sum,
              countryConfig,
            )}
          />
        ) : (
          NO_DATA_TEXT
        ),
      winner: winners.topDonorSum,
    },
    {
      label: tCompareParties("stats.frequent_donor"),
      values: (s) =>
        s.mostFrequentDonor ? (
          <TwoLineCell
            primary={
              <DonorLink
                country={countryConfig}
                donor={s.mostFrequentDonor.name}
              />
            }
            secondary={tCompareParties("n_donations", {
              count: formatNumber(locale, s.mostFrequentDonor.count),
            })}
          />
        ) : (
          NO_DATA_TEXT
        ),
      winner: winners.mostFrequentCount,
    },
  ];

  const topDonationRows: ComparisonRow[] = [
    {
      label: tCompareParties("stats.biggest_donation"),
      values: (s) =>
        s.largestDonation ? (
          <TwoLineCell
            primary={formatCountryCurrency(
              locale,
              s.largestDonation[DonationField.Amount],
              countryConfig,
            )}
            secondary={
              <DonorLink
                country={countryConfig}
                donor={s.largestDonation[DonationField.DonorName]}
              />
            }
          />
        ) : (
          NO_DATA_TEXT
        ),
      winner: winners.largestDonation,
    },
  ];

  return (
    <div>
      {/* Party Selector */}
      <fieldset className="m-0 mb-6 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">
          {tCompareParties("parties")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {countryConfig.parties.map((party) => {
            const isSelected = selectedPartyIds.has(party.id);
            return (
              <Button
                variant={isSelected ? "default" : "outline"}
                key={party.id}
                onClick={() => toggleParty(party.id)}
                disabled={
                  !isSelected && selectedPartyIds.size >= MAX_PARTY_SELECTION
                }
              >
                <PartyDot party={party.id} country={countryConfig} />
              </Button>
            );
          })}
        </div>
      </fieldset>

      {/* Year Filter */}
      <div className="mb-8">
        <YearRangeSelector
          countryConfig={countryConfig}
          fromYear={fromYear}
          toYear={toYear}
          setFromYear={setFromYear}
          setToYear={setToYear}
          showAllYears
        />
      </div>

      {!canCompare && <p>{tCompareParties("min_select")}</p>}

      {canCompare && isLoading && <Loading />}
      {canCompare && hasError && <p>{tData("error")}</p>}

      {canCompare && !isLoading && !hasError && allStats.length >= 2 && (
        <>
          {/* Sticky summary header */}
          <div className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-30 -mx-4 mb-4 border-b border-gray-200 px-4 py-3 backdrop-blur md:h-[72px] dark:border-gray-700">
            <div className="flex items-center justify-between gap-x-4 gap-y-1 pb-1 text-sm">
              <div className="grow overflow-hidden">
                <div className="mb-1 text-xs font-medium">
                  {tCompareParties("comparing")}
                </div>
                <div className="hidden items-center gap-2 overflow-hidden md:flex">
                  {allStats.map((s) => (
                    <PartyDot
                      className={"overflow-hidden"}
                      nameClassName={"truncate"}
                      key={s.party.id}
                      party={s.party.id}
                      country={countryConfig}
                    />
                  ))}
                </div>
                <div className="md:hidden">
                  {allStats.length} {tCompareParties("parties")}
                </div>
              </div>
              <div className="shrink-0 font-medium">
                <div className="mb-1 text-end text-xs font-medium">
                  {tCompareParties("years")}
                </div>
                <div>{formatYearsRange([fromYear, toYear])}</div>
              </div>
            </div>
          </div>

          <ArticleSection
            title={tCompareParties("overview.title")}
            id="sec-compare-overview"
          >
            <p className="text-muted-foreground mt-1 mb-4 text-sm">
              {tCompareParties("overview.description")}
            </p>
            <ComparisonTable
              stats={allStats}
              rows={overviewRows}
              countryConfig={countryConfig}
            />
          </ArticleSection>

          {fromYear === toYear ? null : (
            <ArticleSection
              title={tCompareParties("timeline.title")}
              id="sec-compare-timeline"
            >
              <p className="text-muted-foreground mt-1 mb-4 text-sm">
                {tCompareParties("overview.description")}
              </p>
              <ComparisonTable
                stats={allStats}
                rows={timelineRows}
                countryConfig={countryConfig}
              />
            </ArticleSection>
          )}

          <ArticleSection
            title={tCompareParties("top_donations.title")}
            id="sec-compare-top-donations"
          >
            <p className="text-muted-foreground mt-1 mb-4 text-sm">
              {tCompareParties("top_donations.description")}
            </p>
            <ComparisonTable
              stats={allStats}
              rows={topDonationRows}
              countryConfig={countryConfig}
            />

            {/* Top 3 Donors per party */}
            <div className="mt-6">
              <div className="w-full text-sm">
                {/* Desktop/Tablet View */}
                <div className="hidden md:block">
                  <table className="w-full table-fixed text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="bg-background text-muted-foreground sticky top-[72px] left-0 z-20 w-48 px-4 py-3 text-left text-sm font-medium">
                          {tCompareParties("top_3_donors")}
                        </th>
                        {allStats.map((s) => (
                          <th
                            key={s.party.id}
                            className="bg-background sticky top-[72px] z-10 px-4 py-3"
                          >
                            <PartyHeader
                              party={s.party}
                              country={countryConfig}
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[0, 1, 2].map((rank) => (
                        <tr
                          key={rank}
                          className="border-b border-gray-100 dark:border-gray-800"
                        >
                          <td className="bg-background text-muted-foreground sticky left-0 px-4 py-2 text-sm">
                            #{rank + 1}
                          </td>
                          {allStats.map((stats) => {
                            const donor = stats.topDonors[rank];
                            return (
                              <td
                                key={stats.party.id}
                                className="px-4 py-2 text-right"
                              >
                                {donor ? (
                                  <div>
                                    <div className="truncate font-medium">
                                      <DonorLink
                                        country={countryConfig}
                                        donor={donor.name}
                                      />
                                    </div>
                                    <div className="text-muted-foreground text-xs tabular-nums">
                                      {formatCountryCurrency(
                                        locale,
                                        donor.sum,
                                        countryConfig,
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  NO_DATA_TEXT
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="grid gap-4 md:hidden">
                  {[0, 1, 2].map((rank) => {
                    const hasAnyDonor = allStats.some((s) => s.topDonors[rank]);
                    if (!hasAnyDonor) return null;

                    return (
                      <div key={rank} className="card min-w-0">
                        <h4 className="border-b border-gray-100 pb-2 text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                          #{rank + 1}
                        </h4>
                        <div className="mt-3 grid gap-4">
                          {allStats.map((stats) => {
                            const donor = stats.topDonors[rank];
                            return (
                              <div
                                key={stats.party.id}
                                className="flex min-w-0 gap-3"
                              >
                                <div
                                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: partyColor(
                                      stats.party.id,
                                      countryConfig,
                                    ),
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-muted-foreground mb-1 text-xs font-semibold">
                                    {stats.party.short}
                                  </div>
                                  {donor ? (
                                    <>
                                      <div className="truncate font-medium">
                                        <DonorLink
                                          country={countryConfig}
                                          donor={donor.name}
                                        />
                                      </div>
                                      <div className="text-muted-foreground text-xs font-medium tabular-nums">
                                        {formatCountryCurrency(
                                          locale,
                                          donor.sum,
                                          countryConfig,
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-muted-foreground">
                                      {NO_DATA_TEXT}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ArticleSection>

          {countryConfig.hasDonorType && (
            <ArticleSection
              title={tCompareParties("donor_types.title")}
              id="sec-compare-donor-types"
            >
              <p className="text-muted-foreground mt-1 mb-4 text-sm">
                {tCompareParties("donor_types.description")}
              </p>
              <ComparisonTable
                stats={allStats}
                rows={[
                  {
                    label: tCompareParties("donor_types.biggest_donor_type"),
                    values: (s) => {
                      const top = s.donorTypeBreakdown[0];
                      return top ? (
                        <TwoLineCell
                          primary={top.label}
                          secondary={`${formatCountryCurrency(
                            locale,
                            top.sum,
                            countryConfig,
                          )} · ${formatPercentFormat(locale, top.percentage)}`}
                        />
                      ) : (
                        NO_DATA_TEXT
                      );
                    },
                  },
                ]}
                countryConfig={countryConfig}
              />

              {/* Donor type distribution */}
              <div className="mt-6 w-full text-sm">
                {(() => {
                  // Collect all donor types across parties
                  const allTypes = new Set<DonorType>();
                  for (const s of allStats) {
                    for (const b of s.donorTypeBreakdown) {
                      allTypes.add(b.type);
                    }
                  }
                  // Sort by label
                  const sortedTypes = [...allTypes].toSorted((a, b) =>
                    t(`donor_type.${a}`).localeCompare(t(`donor_type.${b}`)),
                  );

                  return (
                    <>
                      {/* Desktop/Tablet View */}
                      <div className="hidden md:block">
                        <table className="w-full table-fixed text-sm">
                          <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                              <th className="bg-background text-muted-foreground sticky top-[72px] left-0 z-20 w-48 px-4 py-3 text-left text-sm font-medium">
                                {tCompareParties("donor_type")}
                              </th>
                              {allStats.map((s) => (
                                <th
                                  key={s.party.id}
                                  className="bg-background sticky top-[72px] z-10 px-4 py-3"
                                >
                                  <PartyHeader
                                    party={s.party}
                                    country={countryConfig}
                                  />
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sortedTypes.map((dt) => (
                              <tr
                                key={dt}
                                className="border-b border-gray-100 dark:border-gray-800"
                              >
                                <td className="bg-background text-muted-foreground sticky left-0 w-48 px-4 py-2 text-sm whitespace-nowrap">
                                  {t(`donor_type.${dt}`)}
                                </td>
                                {allStats.map((s) => {
                                  const entry = s.donorTypeBreakdown.find(
                                    (b) => b.type === dt,
                                  );
                                  return (
                                    <td
                                      key={s.party.id}
                                      className="px-4 py-2 text-right tabular-nums"
                                    >
                                      {entry ? (
                                        <TwoLineCell
                                          primary={formatPercentFormat(
                                            locale,
                                            entry.percentage,
                                          )}
                                          secondary={formatCountryCurrency(
                                            locale,
                                            entry.sum,
                                            countryConfig,
                                          )}
                                        />
                                      ) : (
                                        NO_DATA_TEXT
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile View */}
                      <div className="grid gap-4 md:hidden">
                        {sortedTypes.map((dt) => (
                          <div key={dt} className="card min-w-0">
                            <h4 className="border-b border-gray-100 pb-2 text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
                              {t(`donor_type.${dt}`)}
                            </h4>
                            <div className="mt-3 grid gap-4">
                              {allStats.map((stats) => {
                                const entry = stats.donorTypeBreakdown.find(
                                  (b) => b.type === dt,
                                );
                                return (
                                  <div
                                    key={stats.party.id}
                                    className="flex gap-3"
                                  >
                                    <div
                                      className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                      style={{
                                        backgroundColor: partyColor(
                                          stats.party.id,
                                          countryConfig,
                                        ),
                                      }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="text-muted-foreground mb-1 text-xs font-semibold">
                                        {stats.party.short}
                                      </div>
                                      <div className="font-medium tabular-nums">
                                        {entry ? (
                                          <TwoLineCell
                                            primary={formatPercentFormat(
                                              locale,
                                              entry.percentage,
                                            )}
                                            secondary={formatCountryCurrency(
                                              locale,
                                              entry.sum,
                                              countryConfig,
                                            )}
                                          />
                                        ) : (
                                          <span className="text-muted-foreground">
                                            {NO_DATA_TEXT}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
            </ArticleSection>
          )}

          <ArticleSection
            title={tCompareParties("donors.title")}
            id="sec-compare-donors"
          >
            <p className="text-muted-foreground mt-1 mb-4 text-sm">
              {tCompareParties("donors.description")}
            </p>
            <ComparisonTable
              stats={allStats}
              rows={donorRows}
              countryConfig={countryConfig}
            />

            {/* Overlapping Donors */}
            {overlappingDonors.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold">
                  {tCompareParties("overlapping.title", {
                    count: formatNumber(locale, overlappingDonors.length),
                  })}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {tCompareParties("overlapping.description")}
                </p>
                <div className="w-full text-sm">
                  {/* Desktop/Tablet View */}
                  <div className="hidden md:block">
                    <table className="w-full table-fixed text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="bg-background sticky top-[72px] left-0 z-20 w-48 px-4 py-2 text-left font-medium">
                            {tCompareParties("donor")}
                          </th>
                          {allStats.map((s) => (
                            <th
                              key={s.party.id}
                              className="bg-background sticky top-[72px] z-10 px-4 py-2"
                            >
                              <PartyHeader
                                party={s.party}
                                country={countryConfig}
                              />
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {overlappingDonors
                          .slice(0, OVERLAP_MAX)
                          .map((donor) => (
                            <tr
                              key={donor.name}
                              className="border-b border-gray-100 dark:border-gray-800"
                            >
                              <td className="bg-background sticky left-0 w-48 px-4 py-2">
                                <div className="truncate font-medium">
                                  <DonorLink
                                    country={countryConfig}
                                    donor={donor.name}
                                  />
                                </div>
                                <div className="text-muted-foreground text-xs tabular-nums">
                                  {formatCompactCountryCurrency(
                                    locale,
                                    donor.totalSum,
                                    countryConfig,
                                  )}
                                  {" · "}
                                  {tCompareParties("n_donations", {
                                    count: formatNumber(
                                      locale,
                                      donor.totalSum > 0
                                        ? Object.values(donor.perParty).reduce(
                                            (acc, d) => acc + d.count,
                                            0,
                                          )
                                        : 0,
                                    ),
                                  })}
                                </div>
                              </td>
                              {allStats.map((s) => {
                                const data = donor.perParty[s.party.id];
                                return (
                                  <td
                                    key={s.party.id}
                                    className="px-4 py-2 text-right"
                                  >
                                    {data ? (
                                      <TwoLineCell
                                        primary={formatCountryCurrency(
                                          locale,
                                          data.sum,
                                          countryConfig,
                                        )}
                                        secondary={tCompareParties(
                                          "n_donations",
                                          {
                                            count: formatNumber(
                                              locale,
                                              data.count,
                                            ),
                                          },
                                        )}
                                      />
                                    ) : (
                                      <span className="text-muted-foreground">
                                        {NO_DATA_TEXT}
                                      </span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile View */}
                  <div className="grid gap-4 md:hidden">
                    {overlappingDonors.slice(0, OVERLAP_MAX).map((donor) => (
                      <div key={donor.name} className="card min-w-0">
                        <div className="border-b border-gray-100 pb-3 dark:border-gray-700">
                          <h4 className="truncate text-base font-semibold">
                            <DonorLink
                              country={countryConfig}
                              donor={donor.name}
                            />
                          </h4>
                          <div className="text-muted-foreground mt-0.5 text-xs font-medium tabular-nums">
                            {formatCompactCountryCurrency(
                              locale,
                              donor.totalSum,
                              countryConfig,
                            )}
                            {" · "}
                            {tCompareParties("n_donations", {
                              count: formatNumber(
                                locale,
                                donor.totalSum > 0
                                  ? Object.values(donor.perParty).reduce(
                                      (acc, d) => acc + d.count,
                                      0,
                                    )
                                  : 0,
                              ),
                            })}
                          </div>
                        </div>

                        <div className="mt-3 grid gap-4">
                          {allStats.map((s) => {
                            const data = donor.perParty[s.party.id];
                            return (
                              <div
                                key={s.party.id}
                                className="flex min-w-0 gap-3"
                              >
                                <div
                                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: partyColor(
                                      s.party.id,
                                      countryConfig,
                                    ),
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="text-muted-foreground mb-1 text-xs font-semibold">
                                    {s.party.short}
                                  </div>
                                  <div className="min-w-0 font-medium tabular-nums">
                                    {data ? (
                                      <TwoLineCell
                                        primary={formatCountryCurrency(
                                          locale,
                                          data.sum,
                                          countryConfig,
                                        )}
                                        secondary={tCompareParties(
                                          "n_donations",
                                          {
                                            count: formatNumber(
                                              locale,
                                              data.count,
                                            ),
                                          },
                                        )}
                                      />
                                    ) : (
                                      <span className="text-muted-foreground">
                                        {NO_DATA_TEXT}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {overlappingDonors.length > 50 && (
                  <p className="text-muted-foreground px-4 py-2 text-sm">
                    {tCompareParties("overlapping.more", {
                      count: formatNumber(
                        locale,
                        overlappingDonors.length - OVERLAP_MAX,
                      ),
                    })}
                  </p>
                )}
              </div>
            )}
          </ArticleSection>
        </>
      )}
    </div>
  );
};

/** Party column header with colored dot */
const PartyHeader = ({
  party,
  country,
}: {
  party: Party;
  country: CountryConfig;
}) => (
  <div className="flex items-center justify-end gap-1.5">
    <span
      className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: partyColor(party.id, country) }}
    />
    <span className="font-semibold">{party.short}</span>
  </div>
);

/** Reusable comparison table: metrics as rows, parties as columns */
const ComparisonTable = ({
  stats,
  rows,
  countryConfig,
}: {
  stats: PartyStats[];
  rows: ComparisonRow[];
  countryConfig: CountryConfig;
}) => (
  <div className="w-full text-sm">
    {/* Desktop/Tablet View (Table) */}
    <div className="hidden md:block">
      <table className="w-full table-fixed text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="bg-background sticky top-[72px] left-0 z-20 w-48 px-4 py-3 text-left font-medium" />
            {stats.map((s) => (
              <th
                key={s.party.id}
                className="bg-background sticky top-[72px] z-10 px-4 py-3"
              >
                <PartyHeader party={s.party} country={countryConfig} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <td className="bg-background text-muted-foreground sticky left-0 w-48 px-4 py-2.5 text-sm">
                {row.label}
              </td>
              {stats.map((s) => {
                const isWinner = row.winner === s.party.id;
                return (
                  <td
                    key={s.party.id}
                    className={`px-4 py-2.5 font-medium ${
                      isWinner
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                        : ""
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="w-4 shrink-0">
                        {isWinner && <Trophy className="h-3.5 w-3.5" />}
                      </span>
                      <div className="min-w-0 flex-1 text-right tabular-nums">
                        {row.values(s)}
                      </div>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile View (Stacked Cards) */}
    <div className="grid gap-4 md:hidden">
      {rows.map((row) => (
        <div key={row.label} className="card min-w-0">
          <h4 className="border-b border-gray-100 pb-2 text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {row.label}
          </h4>
          <div className="mt-3 grid gap-4">
            {stats.map((s) => {
              const isWinner = row.winner === s.party.id;
              return (
                <div key={s.party.id} className="flex min-w-0 gap-3">
                  <div
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: partyColor(s.party.id, countryConfig),
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-muted-foreground mb-1 flex items-center justify-between text-xs font-semibold">
                      <span>{s.party.short}</span>
                      {isWinner && (
                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="min-w-0 font-medium tabular-nums">
                      {row.values(s)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/** Two-line cell: primary text on top, secondary muted text below */
const TwoLineCell = ({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary: ReactNode;
}) => (
  <div className="w-full min-w-0 tabular-nums">
    <div
      className="truncate"
      title={typeof primary === "string" ? primary : undefined}
    >
      {primary}
    </div>
    <div className="text-muted-foreground truncate text-xs font-normal">
      {secondary}
    </div>
  </div>
);

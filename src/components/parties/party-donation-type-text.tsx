"use client";

import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { RankBadge } from "@/components/donations/ranking-item";
import { PercentageHint } from "@/components/percentage-hint";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import {
  formatAnd,
  formatCountryCurrency,
  formatPercentFormat,
} from "@/utils/formatter";
import { capitalize } from "@/utils/string";
import { DonationField, DonationType } from "@/utils/types";

export const LoadingPartyDonationTypeText = ({
  party,
  donations,
}: {
  party: Party;
  donations: Donation[];
}) => {
  const country = useRequiredCountryConfig();
  const browserBasedLocale = useBrowserBasedLocale();
  const tParty = useTranslations("party");
  const tDonationType = useTranslations("donation_type");

  const sumByType: Partial<
    Record<DonationType, { sum: number; count: number }>
  > = {};
  let totalSum = 0;

  donations.forEach((donation) => {
    if (donation[DonationField.Receiver] !== party[PartyField.Id]) return;

    const donationType =
      donation[DonationField.DonationType] ?? DonationType.Money;

    sumByType[donationType] ??= { sum: 0, count: 0 };
    sumByType[donationType]!.sum += donation[DonationField.Amount];
    sumByType[donationType]!.count++;

    totalSum += donation[DonationField.Amount];
  });

  const sortedEntries = Object.entries(sumByType).toSorted(
    ([, a], [, b]) => b.sum - a.sum,
  );

  const partyShort = party[PartyField.Short];
  const topEntry = sortedEntries[0];
  const topType = topEntry ? (Number(topEntry[0]) as DonationType) : undefined;

  const topTypeName = topType !== undefined ? tDonationType(`${topType}`) : "";
  const topAmount = topEntry
    ? formatCountryCurrency(browserBasedLocale, topEntry[1].sum, country)
    : "";
  const topPercent =
    topEntry && totalSum > 0
      ? formatPercentFormat(browserBasedLocale, topEntry[1].sum / totalSum)
      : "";
  const topCount = topEntry ? topEntry[1].count : 0;

  const remainingEntries = sortedEntries.slice(1);
  const remainingItems = remainingEntries.map(([type, stats]) => {
    const donationType = Number(type) as DonationType;
    const typeName = tDonationType(`${donationType}`);
    const amount = formatCountryCurrency(
      browserBasedLocale,
      stats.sum,
      country,
    );
    const percent =
      totalSum > 0
        ? formatPercentFormat(browserBasedLocale, stats.sum / totalSum)
        : "";
    return tParty("donation_types.summary_item", {
      amount,
      percentage: percent,
      type: typeName,
    });
  });

  const remainingTypesText = formatAnd(browserBasedLocale, remainingItems);

  return (
    <>
      <p className="mb-4">
        {tParty("donation_types.p0", { party: partyShort })}
        {sortedEntries.length === 1 ? (
          <>
            {" "}
            {tParty("donation_types.all_single", {
              party: partyShort,
              type: topTypeName,
              amount: topAmount,
              percentage: topPercent,
              count: topCount,
            })}
          </>
        ) : sortedEntries.length > 1 ? (
          <>
            {" "}
            {tParty("donation_types.largest_share", {
              type: topTypeName,
              amount: topAmount,
              percentage: topPercent,
            })}
            {remainingEntries.length > 0 ? (
              <>
                {" "}
                {tParty("donation_types.remaining_share", {
                  types: remainingTypesText,
                })}
              </>
            ) : null}
          </>
        ) : null}
      </p>
      <p className="mb-4">{tParty("donation_types.treemap_guide")}</p>
      <ul className="mx-2 py-2 *:py-1">
        {sortedEntries.map(([type, stats], idx) => {
          const donationType = Number(type) as DonationType;
          const typeName = capitalize(tDonationType(`${donationType}`));

          return (
            <li
              key={donationType}
              className="flex w-full items-center justify-between text-sm font-semibold"
            >
              <div className="flex items-center overflow-x-hidden">
                <RankBadge rank={idx + 1} />
                <span className="truncate">{typeName}</span>
              </div>
              <div className="ml-2 flex tabular-nums">
                <span className="lg:mr-1">
                  {formatCountryCurrency(
                    browserBasedLocale,
                    stats.sum,
                    country,
                  )}
                </span>
                <PercentageHint
                  browserBasedLocale={browserBasedLocale}
                  percentage={stats.sum / totalSum}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

"use client";
import { useLocale } from "next-intl";

import Loading from "./loading";
import { PercentageHint } from "./percentage-hint";
import { RankBadge } from "./ranking-item";
import { useDonationsByParty } from "../hooks/use-api";
import { formatCountryCurrency } from "../utils/formatter";
import { DonationField, DonorType } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Party } from "../utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const LoadingPartyDonorTypeText = ({
  party,
  country,
}: {
  country: CountryConfig;
  party: Party;
}) => {
  const t = useTranslations();
  const tData = useTranslations("data");
  const locale = useLocale();

  const {
    data: donations,
    error,
    isLoading,
  } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !donations) return <div>{tData("error")}</div>;

  const sumByType: Partial<Record<DonorType, { sum: number; count: number }>> =
    {};
  let totalSum = 0;

  donations.forEach((donation) => {
    if (donation[DonationField.Receiver] !== party.id) return;

    const donorType = donation[DonationField.DonorType] ?? DonorType.Other;

    sumByType[donorType] ??= { sum: 0, count: 0 };
    sumByType[donorType].sum += donation[DonationField.Amount];
    sumByType[donorType].count++;

    totalSum += donation[DonationField.Amount];
  });

  const sortedEntries = Object.entries(sumByType).toSorted(
    ([, a], [, b]) => b.sum - a.sum,
  );

  return (
    <>
      <p>
        {t("party.donor_types.p0")}
        <br />
        {t("party.donor_types.p1", {
          count: sortedEntries.length,
          party: party.short,
        })}
      </p>
      <p>{t("party.donor_types.p2")}</p>
      <ul className="mx-2 py-2 *:py-1">
        {sortedEntries.map(([type, stats], idx) => {
          const donorType = type as unknown as DonorType;

          return (
            <li
              key={donorType}
              className="flex w-full items-center justify-between text-sm font-semibold"
            >
              <div className="flex items-center overflow-x-hidden">
                <RankBadge rank={idx + 1} />
                <span className="truncate">{t(`donor_type.${donorType}`)}</span>
              </div>
              <div className="ml-2 flex tabular-nums">
                <span className="lg:mr-1">
                  {formatCountryCurrency(locale, stats.sum, country)}
                </span>
                <PercentageHint
                  locale={locale}
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

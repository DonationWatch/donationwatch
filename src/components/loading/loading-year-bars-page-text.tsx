"use client";
import { useLocale } from "next-intl";

import type { Party } from "@/types/party";
import type { Donation, ReceiverId } from "@/utils/types";

import { FormatAnd } from "@/components/formatter";
import { TextPartyLink } from "@/components/parties/text-party-link";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { Translation } from "@/components/translation";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { donationYear } from "@/utils/date";
import { formatCountryCurrency, formatMonthYear } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const YearBarsPageText = ({
  parties,
  years,
  donations,
}: {
  parties: Party[];
  years: string[];
  donations: Donation[];
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p[PartyField.Id]));

  const monthYearData: Record<string, Record<string, number>> = {};
  const partyMonths: Record<ReceiverId, Set<string>> = {};

  donations.forEach((donation: Donation & { [DonationField.Date]: string }) => {
    if (donation[DonationField.Date] === donationYear(donation)) return;
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    const yearMonth = donation[DonationField.Date].substring(0, 7);

    monthYearData[yearMonth] ??= {};
    monthYearData[yearMonth][donation[DonationField.Receiver]] ??= 0;
    monthYearData[yearMonth][donation[DonationField.Receiver]] +=
      donation[DonationField.Amount];

    partyMonths[donation[DonationField.Receiver]] ??= new Set();
    partyMonths[donation[DonationField.Receiver]].add(yearMonth);
  });

  let monthWithHighestDonationSum:
    | undefined
    | {
        date: string;
        sum: number;
        count: number;
      };

  let monthWithMostDonations:
    | undefined
    | {
        date: string;
        sum: number;
        count: number;
      };

  const partiesMonthCounts: Record<number, ReceiverId[]> = {};

  Object.keys(monthYearData).forEach((month) => {
    const sum = Object.values(monthYearData[month]).reduce(
      (acc, donation) => acc + donation,
      0,
    );
    const count = Object.keys(monthYearData[month]).length;

    if (!monthWithMostDonations) {
      monthWithMostDonations = { date: month, sum, count };
    } else if (count > monthWithMostDonations.count) {
      monthWithMostDonations = {
        date: month,
        sum,
        count,
      };
    }

    if (!monthWithHighestDonationSum) {
      monthWithHighestDonationSum = { date: month, sum, count };
    } else if (sum > monthWithHighestDonationSum.sum) {
      monthWithHighestDonationSum = {
        date: month,
        sum,
        count,
      };
    }
  });

  (Object.keys(partyMonths) as ReceiverId[]).forEach((party) => {
    partiesMonthCounts[partyMonths[party].size] ??= [];
    partiesMonthCounts[partyMonths[party].size].push(party);
  });

  const partiesWithMostMonths = Object.entries(partiesMonthCounts)
    .toSorted(([a], [b]) => parseInt(b) - parseInt(a))
    .at(0);

  return (
    <>
      {monthWithHighestDonationSum ? (
        <p className="mb-6">
          <Translation
            t={t}
            translationId={"per_month.highest_sum"}
            variables={{
              month: formatMonthYear(
                browserBasedLocale,
                new Date(monthWithHighestDonationSum.date),
              ),
              sum: formatCountryCurrency(
                browserBasedLocale,
                monthWithHighestDonationSum.sum,
                country,
              ),
              count: monthWithHighestDonationSum.count,
            }}
          />
        </p>
      ) : null}
      {partiesWithMostMonths?.length ? (
        <p className="mb-6">
          <Translation
            t={t}
            translationId={"per_month.most_months"}
            variables={{
              party: (
                <FormatAnd
                  locale={locale}
                  items={partiesWithMostMonths[1].map((partyId) => (
                    <TextPartyLink
                      key={partyId}
                      party={partyId}
                      locale={locale}
                    />
                  ))}
                />
              ),
              count: partiesWithMostMonths[0],
            }}
          />
        </p>
      ) : null}
      {monthWithMostDonations ? (
        <p>
          <Translation
            t={t}
            translationId={"per_month.month_most_donations"}
            variables={{
              month: formatMonthYear(
                browserBasedLocale,
                new Date(monthWithMostDonations.date),
              ),
              count: monthWithMostDonations.count,
            }}
          />
        </p>
      ) : null}
    </>
  );
};

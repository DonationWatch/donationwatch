"use client";

import { FormatAnd } from "./formatter";
import Loading from "./loading";
import { TextPartyLink } from "./text-party-link";
import { Translation } from "./translation";
import { useDonationsByYears } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";
import { isNotNullandNotUndefined } from "../utils/array";
import { donationYear } from "../utils/date";
import { formatCountryCurrency, formatMonthYear } from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, Party, ReceiverId } from "../utils/types";

export const LoadingYearBarsPageText = ({
  parties,
  years,
  country,
}: {
  country: CountryConfig;
  parties: Party[];
  years: string[];
}) => {
  const { translations, locale } = useTranslations();
  const results = useDonationsByYears(country, years);

  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{translations.data_error}</div>;

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p.id));
  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

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
      <p className="mb-6">{translations.per_month.description}</p>
      {monthWithHighestDonationSum ? (
        <p className="mb-6">
          <Translation
            text={translations.per_month.highest_sum}
            variables={{
              month: formatMonthYear(
                locale,
                new Date(monthWithHighestDonationSum.date),
              ),
              sum: formatCountryCurrency(
                locale,
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
            text={translations.per_month.most_months}
            variables={{
              party: (
                <FormatAnd
                  locale={locale}
                  items={partiesWithMostMonths[1].map((partyId) => (
                    <TextPartyLink
                      key={partyId}
                      party={partyId}
                      country={country}
                      translations={translations}
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
            text={translations.per_month.month_most_donations}
            variables={{
              month: formatMonthYear(
                locale,
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

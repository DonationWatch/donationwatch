"use client";

import { DonorLink } from "./donor-link";
import { FormatAnd } from "./formatter";
import Loading from "./loading";
import { Translation } from "./translation";
import { t } from "../app/[locale]/translations";
import { useDonationsByYears } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";
import { isNotNullandNotUndefined } from "../utils/array";
import { donationYear } from "../utils/date";
import {
  formatAnd,
  formatCountryCurrency,
  formatYearsRange,
} from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, Party } from "../utils/types";
import type { FC } from "react";

const TOP_DONORS_TO_SHOW = 5;

export const YearsDonorPageText: FC<{
  years: string[];
  country: CountryConfig;
  parties: Party[];
}> = ({ years, country, parties }) => {
  const { translations, locale } = useTranslations();
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{translations.data_error}</div>;

  const biggestDonor: { donor: string; amount: number } = {
    donor: "",
    amount: 0,
  };
  const mostDonationsDonor: {
    donor: string;
    count: number;
    sum: number;
  } = {
    donor: "",
    count: 0,
    sum: 0,
  };
  const mostUniquePartiesDonor: {
    donor: string;
    count: number;
    sum: number;
  } = {
    donor: "",
    count: 0,
    sum: 0,
  };

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p.id));
  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);
  const donorDonations: Record<string, Donation[]> = {};

  donations.forEach((donation) => {
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    donorDonations[donation[DonationField.DonorName]] ??= [];
    donorDonations[donation[DonationField.DonorName]].push(donation);
  });

  const topDonors = Object.entries(donorDonations)
    .map(([donor, donations]) => ({
      donor,
      amount: donations.reduce(
        (sum, donation) => sum + donation[DonationField.Amount],
        0,
      ),
    }))
    .toSorted((a, b) => b.amount - a.amount)
    .slice(0, TOP_DONORS_TO_SHOW);

  Object.entries(donorDonations).forEach(([donor, donations]) => {
    const groupedDonations = donations.reduce<Record<string, Donation[]>>(
      (acc, donation) => {
        acc[donation[DonationField.Receiver]] ??= [];
        acc[donation[DonationField.Receiver]].push(donation);
        return acc;
      },
      {},
    );

    const uniqueParties = new Set(
      donations.map((d) => d[DonationField.Receiver]),
    );
    const donorSum = donations.reduce(
      (sum, donation) => sum + donation[DonationField.Amount],
      0,
    );

    if (mostUniquePartiesDonor.count < uniqueParties.size) {
      mostUniquePartiesDonor.donor = donor;
      mostUniquePartiesDonor.count = uniqueParties.size;
      mostUniquePartiesDonor.sum = donorSum;
    } else if (
      mostUniquePartiesDonor.count === uniqueParties.size &&
      mostUniquePartiesDonor.sum < donorSum
    ) {
      mostUniquePartiesDonor.donor = donor;
      mostUniquePartiesDonor.count = uniqueParties.size;
      mostUniquePartiesDonor.sum = donorSum;
    }

    Object.values(groupedDonations).forEach((donations) => {
      const sum = donations.reduce(
        (sum, donation) => sum + donation[DonationField.Amount],
        0,
      );

      if (biggestDonor.amount < sum) {
        biggestDonor.donor = donor;
        biggestDonor.amount = sum;
      }
      if (mostDonationsDonor.count < donations.length) {
        mostDonationsDonor.donor = donor;
        mostDonationsDonor.count = donations.length;
        mostDonationsDonor.sum = sum;
      }
    });
  });

  return (
    <>
      <p className="mb-6">
        {t(translations.donors.detail.unique_donors, {
          years: formatAnd(locale, years),
          count: Object.keys(donorDonations).length,
        })}
      </p>

      {topDonors.length > 0 ? (
        <p className="mb-6">
          <Translation
            text={translations.donors.detail.top_3}
            variables={{
              amount: topDonors.length,
              years: formatYearsRange(years),
              donors: (
                <FormatAnd
                  locale={locale}
                  items={topDonors.map((d, i) => (
                    <span key={i}>
                      <DonorLink country={country} donor={d.donor} /> (
                      {formatCountryCurrency(locale, d.amount, country)})
                    </span>
                  ))}
                />
              ),
            }}
          />
        </p>
      ) : null}

      {biggestDonor.amount > 0 ? (
        <p className="mb-6">
          <Translation
            text={translations.donors.detail.biggest_donor}
            variables={{
              amount: formatCountryCurrency(
                locale,
                biggestDonor.amount,
                country,
              ),
              donor: <DonorLink country={country} donor={biggestDonor.donor} />,
            }}
          />
        </p>
      ) : null}
      {mostDonationsDonor.sum > 0 ? (
        <p className="mb-6">
          <Translation
            text={translations.donors.detail.most_donations}
            variables={{
              count: mostDonationsDonor.count,
              sum: formatCountryCurrency(
                locale,
                mostDonationsDonor.sum,
                country,
              ),
              donor: (
                <DonorLink country={country} donor={mostDonationsDonor.donor} />
              ),
            }}
          />
        </p>
      ) : null}

      {mostUniquePartiesDonor.count > 1 ? (
        <p>
          <Translation
            text={translations.donors.detail.most_unique_parties}
            variables={{
              count: mostUniquePartiesDonor.count,
              sum: formatCountryCurrency(
                locale,
                mostUniquePartiesDonor.sum,
                country,
              ),
              donor: (
                <DonorLink
                  country={country}
                  donor={mostUniquePartiesDonor.donor}
                />
              ),
            }}
          />
        </p>
      ) : null}
    </>
  );
};

"use client";
import { useLocale } from "next-intl";

import { DonorLink } from "./donor-link";
import { FormatAnd } from "./formatter";
import Loading from "./loading";
import { FaqSchema } from "./schema";
import { Translation } from "./translation";
import { useDonationsByParty } from "../hooks/use-api";
import { isNotNullandNotUndefined } from "../utils/array";
import { donationYear } from "../utils/date";
import {
  formatAnd,
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatDate,
  formatYear,
} from "../utils/formatter";
import { DonationField } from "../utils/types";
import { ArticleSectionTitle } from "./layout/article";

import type { CountryConfig } from "../utils/countries";
import type { Donation, Party } from "../utils/types";
import type { ReactNode } from "react";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

const TOP_DONORS_TO_SHOW = 5;

export const PartyDonorPageText = ({
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
  const yearDonations: Record<string, number[]> = {};
  const donorDonations: Record<string, number> = {};
  const donorNames: Record<string, string> = {};
  const donorDonationCounts: Record<string, number> = {};

  const partyDonations: Donation[] = [];
  donations.map((donation) => {
    if (donation[DonationField.Receiver] !== party.id) return;

    const year = donationYear(donation);

    yearDonations[year] ??= [];
    yearDonations[year].push(donation[DonationField.Amount]);

    const donor = donation[DonationField.DonorName];
    donorNames[donor] = donor;
    donorDonations[donor] ??= 0;
    donorDonations[donor] += donation[DonationField.Amount];

    donorDonationCounts[donor] ??= 0;
    donorDonationCounts[donor] += 1;

    partyDonations.push(donation);
  });

  const topDonors = Object.entries(donorDonations)
    .map(([donorId, sum]) => ({
      donorId,
      sum,
      name: donorNames[donorId],
    }))
    .toSorted((a, b) => b.sum - a.sum)
    .slice(0, TOP_DONORS_TO_SHOW);

  let biggestSingularDonation: Donation | undefined;
  let biggestDonor: { name: string; donorId: string; sum: number } | undefined;
  let frequentDonor: { name: string; count: number } | undefined;

  const lastDonation = partyDonations.at(-1);
  if (!lastDonation) return null;

  const firstDonation = partyDonations[0];

  // Find the max donation count
  const maxDonationCount = Math.max(...Object.values(donorDonationCounts));
  // Find all donors with the max donation count
  const mostFrequentDonors = Object.entries(donorDonationCounts)
    .filter(([, count]) => count === maxDonationCount)
    .map(([donorId, count]) => ({ name: donorId, count }));

  Object.entries(donorDonations).forEach(([donorId, sum]) => {
    if (!biggestDonor) biggestDonor = { name: donorId, sum, donorId };
    if (biggestDonor.sum < sum) biggestDonor = { name: donorId, sum, donorId };
  });

  // Only set frequentDonor if there is exactly one donor with the max count
  if (mostFrequentDonors.length === 1) {
    frequentDonor = mostFrequentDonors[0];
  } else {
    frequentDonor = undefined;
  }

  partyDonations.forEach((donation) => {
    sum += donation[DonationField.Amount];

    if (
      !biggestSingularDonation ||
      biggestSingularDonation[DonationField.Amount] <
        donation[DonationField.Amount]
    )
      biggestSingularDonation = donation;
  });

  // Generate FAQ data for JSON-LD
  const faqData: {
    question: string;
    answer: string;
    answerHTML?: ReactNode;
  }[] = [
    {
      question: t("party.qa.sum.q", { party: party.short }),
      answer: t("party.qa.sum.a", {
        party: party.short,
        sum: formatCountryCurrency(locale, sum, country),
        count: partyDonations.length,
        minYear: formatYear(
          locale,
          new Date(firstDonation[DonationField.Date]),
        ),
        minSum: formatCompactCountryCurrency(
          locale,
          country.minPublicDonationAmount,
          country,
        ),
      }),
    },
    {
      question: t("party.qa.top_donors.q", { party: party.short }),
      answer: t("party.qa.top_donors.a", {
        party: party.short,
        donors: formatAnd(
          locale,
          topDonors.map(
            (d) =>
              `${d.name} (${formatCountryCurrency(locale, d.sum, country)})`,
          ),
        ),
      }),
      answerHTML: (
        <Translation
          text={t.raw("party.qa.top_donors.a")}
          variables={{
            party: party.short,
            donors: (
              <FormatAnd
                locale={locale}
                items={topDonors.map((d, i) => (
                  <span key={i}>
                    <DonorLink country={country} donor={d.name} /> (
                    {formatCountryCurrency(locale, d.sum, country)})
                  </span>
                ))}
              />
            ),
          }}
        />
      ),
    },
    biggestSingularDonation
      ? {
          question: t("party.qa.largest_singular.q", {
            party: party.short,
          }),
          answer: t("party.qa.largest_singular.a", {
            amount: formatCountryCurrency(
              locale,
              biggestSingularDonation[DonationField.Amount],
              country,
            ),
            donor: biggestSingularDonation[DonationField.DonorName],
            date: formatDate(
              locale,
              new Date(biggestSingularDonation[DonationField.Date]),
            ),
          }),
          answerHTML: (
            <Translation
              text={t.raw("party.qa.largest_singular.a")}
              variables={{
                amount: formatCountryCurrency(
                  locale,
                  biggestSingularDonation[DonationField.Amount],
                  country,
                ),
                donor: (
                  <DonorLink
                    country={country}
                    donor={biggestSingularDonation[DonationField.DonorName]}
                  />
                ),
                date: formatDate(
                  locale,
                  new Date(biggestSingularDonation[DonationField.Date]),
                ),
              }}
            />
          ),
        }
      : undefined,
    biggestDonor
      ? {
          question: t("party.qa.biggest_overall.q", {
            party: party.short,
          }),
          answer: t("party.qa.biggest_overall.a", {
            party: party.short,
            donor: biggestDonor.name,
            sum: formatCountryCurrency(locale, biggestDonor.sum, country),
          }),

          answerHTML: (
            <Translation
              text={t.raw("party.qa.biggest_overall.a")}
              variables={{
                party: party.short,
                donor: (
                  <DonorLink country={country} donor={biggestDonor.name} />
                ),
                sum: formatCountryCurrency(locale, biggestDonor.sum, country),
              }}
            />
          ),
        }
      : undefined,
    frequentDonor
      ? {
          question: t("party.qa.frequent_donor.q", {
            party: party.short,
          }),
          answer: t("party.qa.frequent_donor.a", {
            party: party.short,
            donor: frequentDonor.name,
            count: frequentDonor.count,
            sum: formatCountryCurrency(
              locale,
              donorDonations[frequentDonor.name],
              country,
            ),
          }),
          answerHTML: (
            <Translation
              text={t.raw("party.qa.frequent_donor.a")}
              variables={{
                party: party.short,
                donor: (
                  <DonorLink country={country} donor={frequentDonor.name} />
                ),
                count: frequentDonor.count,
                sum: formatCountryCurrency(
                  locale,
                  donorDonations[frequentDonor.name],
                  country,
                ),
              }}
            />
          ),
        }
      : undefined,
  ].filter(isNotNullandNotUndefined);

  return (
    <>
      <FaqSchema inLanguage={locale} faq={faqData} />
      <ArticleSectionTitle
        as={"h1"}
        id={"sec-party-donors"}
        title={t("party.donors.title", { party: party.short })}
      />
      <p className="mb-6">
        {t("party.donors.summary", {
          party: party.short,
          minYear: formatYear(
            locale,
            new Date(firstDonation[DonationField.Date]),
          ),
          minSum: formatCompactCountryCurrency(
            locale,
            country.minPublicDonationAmount,
            country,
          ),
          source: country.source.name,
        })}
      </p>
      <section aria-label={t("faq")}>
        <dl className="space-y-2">
          {faqData.map((item, index) => (
            <div key={index} className="pb-3">
              <dt className="mb-2 font-medium">{item.question}</dt>
              <dd>{item.answerHTML ?? item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
};

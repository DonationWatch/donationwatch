"use client";
import type { Party } from "@donationwatch/core/types/party";
import type { Donation } from "@donationwatch/core/utils/types";
import type { PartyDonorStats } from "@donationwatch/data/queries/get-party-donor-stats";
import type { ReactNode } from "react";

import { PartyField } from "@donationwatch/core/types/party";
import { isNotNullandNotUndefined } from "@donationwatch/core/utils/array";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatDate,
  formatYear,
} from "@donationwatch/core/utils/formatter";
import { computePartyDonorStats } from "@donationwatch/data/queries/get-party-donor-stats";
import { useLocale } from "next-intl";

import { DonorLink } from "@/components/donors/donor-link";
import { FormatAnd } from "@/components/formatter";
import { ArticleSectionTitle } from "@/components/layout/article";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { Translation } from "@/components/translation";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const PartyDonorPageText = ({
  party,
  donations: data,
  ssrStats,
  chart,
}: {
  party: Party;
  donations: Donation[];
  ssrStats?: PartyDonorStats | null;
  chart?: ReactNode;
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

  const stats =
    data.length > 0
      ? computePartyDonorStats(party[PartyField.Id], data)
      : (ssrStats ?? null);

  if (!stats) return null;

  const {
    sum,
    count,
    firstDonationDate,
    topDonors,
    biggestSingularDonation,
    biggestDonor,
    frequentDonor,
  } = stats;

  const faqData: {
    question: string;
    answer: ReactNode;
  }[] = [
    {
      question: t("party.qa.sum.q", { party: party[PartyField.Short] }),
      answer: t("party.qa.sum.a", {
        party: party[PartyField.Short],
        sum: formatCountryCurrency(browserBasedLocale, sum, country),
        count,
        minYear: formatYear(browserBasedLocale, new Date(firstDonationDate)),
        minSum: formatCompactCountryCurrency(
          browserBasedLocale,
          country.minPublicDonationAmount,
          country,
        ),
      }),
    },
    {
      question: t("party.qa.top_donors.q", { party: party[PartyField.Short] }),
      answer: (
        <Translation
          t={t}
          translationId={"party.qa.top_donors.a"}
          variables={{
            party: party[PartyField.Short],
            donors: (
              <FormatAnd
                locale={locale}
                items={topDonors.map((d, i) => (
                  <span key={i}>
                    <DonorLink donor={d.name} /> (
                    {formatCountryCurrency(browserBasedLocale, d.sum, country)})
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
            party: party[PartyField.Short],
          }),
          answer: (
            <Translation
              t={t}
              translationId={"party.qa.largest_singular.a"}
              variables={{
                amount: formatCountryCurrency(
                  browserBasedLocale,
                  biggestSingularDonation.amount,
                  country,
                ),
                donor: <DonorLink donor={biggestSingularDonation.donor} />,
                date: formatDate(
                  browserBasedLocale,
                  new Date(biggestSingularDonation.date),
                ),
              }}
            />
          ),
        }
      : undefined,
    biggestDonor
      ? {
          question: t("party.qa.biggest_overall.q", {
            party: party[PartyField.Short],
          }),
          answer: (
            <Translation
              t={t}
              translationId={"party.qa.biggest_overall.a"}
              variables={{
                party: party[PartyField.Short],
                donor: <DonorLink donor={biggestDonor.name} />,
                sum: formatCountryCurrency(
                  browserBasedLocale,
                  biggestDonor.sum,
                  country,
                ),
              }}
            />
          ),
        }
      : undefined,
    frequentDonor
      ? {
          question: t("party.qa.frequent_donor.q", {
            party: party[PartyField.Short],
          }),
          answer: (
            <Translation
              t={t}
              translationId={"party.qa.frequent_donor.a"}
              variables={{
                party: party[PartyField.Short],
                donor: <DonorLink donor={frequentDonor.name} />,
                count: frequentDonor.count,
                sum: formatCountryCurrency(
                  browserBasedLocale,
                  frequentDonor.sum,
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
      <ArticleSectionTitle
        as={"h1"}
        id={"sec-party-donors"}
        title={t("party.donors.title", { party: party[PartyField.Short] })}
      />
      <p className="mb-6">
        {t("party.donors.summary", {
          party: party[PartyField.Short],
          minYear: formatYear(browserBasedLocale, new Date(firstDonationDate)),
          minSum: formatCompactCountryCurrency(
            browserBasedLocale,
            country.minPublicDonationAmount,
            country,
          ),
          source: country.source.name,
        })}
      </p>
      {chart ? <div className="mb-6">{chart}</div> : null}
      <section aria-label={t("faq")}>
        <dl className="space-y-2">
          {faqData.map((item, index) => (
            <div key={index} className="pb-3">
              <dt className="mb-2 font-medium">{item.question}</dt>
              <dd>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
};

"use client";

import { BigDonorPill } from "./donors-hero";
import { MetaCard } from "./meta-card";
import { PercentageHint } from "./percentage-hint";
import { TextPartyLink } from "./text-party-link";
import { t } from "../app/[locale]/translations";
import { useTranslations } from "../hooks/use-translations";
import {
  formatCountryCurrency,
  formatNumber,
  formatYearsRange,
} from "../utils/formatter";
import { sumPartySums } from "../utils/math";

import type { CountryConfig } from "../utils/countries";
import type { PartyYearsSums } from "../utils/loader/party-years-sums";
import type { DonorMeta, ReceiverId } from "../utils/types";
import type { FC } from "react";

export const RelatedDonorsSection: FC<{
  country: CountryConfig;
  donorMeta: DonorMeta;
}> = ({ country, donorMeta }) => {
  const { locale, translations } = useTranslations();

  if (!donorMeta.relations) {
    return null;
  }

  let sum = 0;
  let count = 0;
  const partySums: Record<string, number> = {};
  let minYear: string | undefined;
  let maxYear: string | undefined;

  const allPartySums: PartyYearsSums = {};

  donorMeta.relations.forEach(([, , sums]) => {
    Object.entries(sums).forEach(([year, partySum]) => {
      if (!minYear) minYear = year;
      if (!maxYear) maxYear = year;

      if (year < minYear) minYear = year;
      if (year > maxYear) maxYear = year;

      Object.entries(partySum).forEach(([partyId, stats]) => {
        partySums[partyId] ??= 0;
        partySums[partyId] += stats.sum;

        sum += stats.sum;
        count += stats.count;

        allPartySums[year] ??= {};
        allPartySums[year][partyId] ??= {
          sum: 0,
          average: 0,
          count: 0,
          lastDonation: stats.lastDonation,
        };

        allPartySums[year][partyId].sum += stats.sum;
        allPartySums[year][partyId].count += stats.count;
      });
    });
  });

  const biggestSums = Object.entries(partySums).toSorted(
    ([, sumA], [, sumB]) => sumB - sumA,
  );

  return (
    <>
      <div>
        <div className="mb-4 text-xl">{translations.similar_donors.title}</div>
        <p>{translations.similar_donors.description}</p>
        <p>
          {t(translations.similar_donors.summary, {
            count: donorMeta.relations.length ?? 0,
          })}
        </p>
      </div>
      <div className="my-4 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <MetaCard
            title={translations.sum}
            value={formatCountryCurrency(locale, sum, country)}
          />
          <MetaCard
            title={translations.donation_count}
            value={formatNumber(locale, count)}
          />
          <MetaCard
            title={translations.donor.active_period}
            value={formatYearsRange([minYear!, maxYear!])}
          />
        </div>

        {/* Party Distribution */}
        <div>
          <h4 className="mb-4">{translations.similar_donors.list_title}</h4>
          <ul>
            {biggestSums.map(([partyId, donorSum]) => {
              return (
                <li
                  key={partyId}
                  className="flex items-center justify-between p-2"
                >
                  <span>
                    <TextPartyLink
                      translations={translations}
                      locale={locale}
                      party={partyId as ReceiverId}
                      country={country}
                    />
                  </span>
                  <div className="flex items-center text-sm font-semibold tabular-nums">
                    <span className="">
                      {formatCountryCurrency(locale, donorSum, country)}
                    </span>
                    &nbsp;
                    <PercentageHint
                      locale={locale}
                      percentage={donorSum / sum}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Related Donors */}
        <div>
          <h4 className="mb-3">{translations.related.donors}</h4>
          <ul className="grid items-stretch gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {donorMeta.relations.map(([name, , sums]) => (
              <BigDonorPill
                translations={translations}
                key={name}
                donor={{
                  name: name,
                  sum: sumPartySums(sums),
                  partyYearSums: sums,
                }}
                locale={locale}
                country={country}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

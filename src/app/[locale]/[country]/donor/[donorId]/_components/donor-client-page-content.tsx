"use client";

import { useLocale } from "next-intl";

import type { CountryConfig } from "@/types/country-config";
import type { Donation, ReceiverId } from "@/utils/types";

import { LoadedDonationYearsTreemap } from "@/components/charts/loading-donation-years-treemap";
import { RankBadge } from "@/components/donations/ranking-item";
import {
  ArticleSectionColumn,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { TextPartyLink } from "@/components/parties/text-party-link";
import { PercentageHint } from "@/components/percentage-hint";
import { Translation } from "@/components/translation";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { getCountryName, getParty } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import {
  formatAnd,
  formatCountryCurrency,
  formatDate,
  formatNumber,
} from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const DonorClientPageContent = ({
  countryConfig,
  donations,
}: {
  donorId: string;
  countryConfig: CountryConfig;
  donations: Donation[];
}) => {
  const tDonor = useTranslations("donor");
  const tCountries = useTranslations("countries");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

  if (!donations || donations.length === 0) {
    return null;
  }

  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );
  const sums: Record<string, number> = {};
  const donationParties: Record<ReceiverId, { sum: number; count: number }> =
    {};
  const donationYears: Record<string, { count: number; sum: number }> = {};
  let oldestDonation: Donation | undefined;
  let newestDonation: Donation | undefined;
  let biggestDonation: Donation | undefined;
  let sum = 0;

  donations.forEach((donation) => {
    sums[donation[DonationField.Receiver]] ??= 0;
    sums[donation[DonationField.Receiver]] += donation[DonationField.Amount];
    sum += donation[DonationField.Amount];

    donationParties[donation[DonationField.Receiver]] ??= { sum: 0, count: 0 };
    donationParties[donation[DonationField.Receiver]].sum +=
      donation[DonationField.Amount];
    donationParties[donation[DonationField.Receiver]].count++;

    const year = donationYear(donation);
    donationYears[year] ??= { count: 0, sum: 0 };
    donationYears[year].count++;
    donationYears[year].sum += donation[DonationField.Amount];

    if (
      !oldestDonation ||
      donation[DonationField.Date] < oldestDonation[DonationField.Date]
    ) {
      oldestDonation = donation;
    }
    if (
      !newestDonation ||
      donation[DonationField.Date] > newestDonation[DonationField.Date]
    ) {
      newestDonation = donation;
    }
    if (
      !biggestDonation ||
      donation[DonationField.Amount] > biggestDonation[DonationField.Amount]
    ) {
      biggestDonation = donation;
    }
  });

  const avg = sum / donations.length;

  const allPartyDonations = Object.entries(sums).map(([party, amount]) => ({
    party: party as ReceiverId,
    sum: amount,
  }));

  const mostPartyDonations = Object.entries(donationParties)
    .map(([party, data]) => ({
      party: party as ReceiverId,
      count: data.count,
    }))
    .toSorted((a, b) => b.count - a.count)
    .slice(0, 3);

  const biggestYear = Object.entries(donationYears).reduce(
    (acc, [year, { sum }]) => {
      if (sum > acc.sum) {
        acc.year = year;
        acc.sum = sum;
      }
      return acc;
    },
    { year: "", sum: 0 },
  );
  const mostDonationsYear = Object.entries(donationYears).reduce(
    (acc, [year, { count }]) => {
      if (count > acc.count) {
        acc.year = year;
        acc.count = count;
      }
      return acc;
    },
    { year: "", count: 0 },
  );

  return (
    <ArticleSectionWrapper id={"sec-donor-overview"}>
      <ArticleSectionTwoColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id={"sec-donor-overview"}
            title={tDonor("subtitle")}
          />
          <p className="mb-6">
            {tDonor("summary", {
              donor: donorName,
              sum: formatCountryCurrency(
                browserBasedLocale,
                sum,
                countryConfig,
              ),
              count: formatNumber(browserBasedLocale, donations.length),
              avg: formatCountryCurrency(
                browserBasedLocale,
                avg,
                countryConfig,
              ),
              parties: formatNumber(
                browserBasedLocale,
                Object.keys(donationParties).length,
              ),
            })}
          </p>
          <p className="mb-6">{tDonor("biggest_amounts")}</p>
          <ul className="mx-2 py-2 *:py-1">
            {allPartyDonations
              .toSorted((a, b) => b.sum - a.sum)
              .map((partyDonation, idx) => (
                <li
                  key={partyDonation.party}
                  className="flex w-full items-center justify-between text-sm font-semibold"
                >
                  <div className="flex items-center overflow-x-hidden">
                    <RankBadge rank={idx + 1} />
                    <TextPartyLink
                      party={partyDonation.party}
                      locale={locale}
                      country={countryConfig}
                    />
                  </div>
                  <div className="ml-2 flex tabular-nums">
                    <span className="lg:mr-1">
                      {formatCountryCurrency(
                        browserBasedLocale,
                        partyDonation.sum,
                        countryConfig,
                      )}
                    </span>
                    <PercentageHint
                      browserBasedLocale={browserBasedLocale}
                      percentage={partyDonation.sum / sum}
                    />
                  </div>
                </li>
              ))}
          </ul>
          <p className="mb-6">
            {oldestDonation ? (
              <>
                <Translation
                  t={tDonor}
                  translationId={"oldest"}
                  variables={{
                    minYear: countryConfig.minYear,
                    date: formatDate(
                      browserBasedLocale,
                      new Date(oldestDonation[DonationField.Date]),
                    ),
                    amount: formatCountryCurrency(
                      browserBasedLocale,
                      oldestDonation[DonationField.Amount],
                      countryConfig,
                    ),
                    party: (
                      <TextPartyLink
                        party={oldestDonation[DonationField.Receiver]}
                        country={countryConfig}
                        locale={locale}
                      />
                    ),
                  }}
                />
                <br />
              </>
            ) : null}
            {newestDonation &&
            newestDonation[DonationField.Id] !==
              oldestDonation?.[DonationField.Id] ? (
              <>
                <Translation
                  t={tDonor}
                  translationId={"newest"}
                  variables={{
                    date: formatDate(
                      browserBasedLocale,
                      new Date(newestDonation[DonationField.Date]),
                    ),
                    amount: formatCountryCurrency(
                      browserBasedLocale,
                      newestDonation[DonationField.Amount],
                      countryConfig,
                    ),
                    party: (
                      <TextPartyLink
                        party={newestDonation[DonationField.Receiver]}
                        country={countryConfig}
                        locale={locale}
                      />
                    ),
                  }}
                />
                <br />
              </>
            ) : null}
          </p>
          <p className="mb-6">
            <Translation
              t={tDonor}
              translationId={"most_donations"}
              variables={{
                list: formatAnd(
                  browserBasedLocale,
                  mostPartyDonations.map(({ party, count }) =>
                    tDonor("most_donations_item", {
                      party: getParty(countryConfig, party)[PartyField.Short],
                      count: formatNumber(browserBasedLocale, count),
                    }),
                  ),
                ),
              }}
            />
            {mostDonationsYear.count > 0 && biggestYear.sum > 0 ? (
              <>
                <br />
                {tDonor("highest_most_donation", {
                  biggestYear: biggestYear.year,
                  biggestSum: formatCountryCurrency(
                    browserBasedLocale,
                    biggestYear.sum,
                    countryConfig,
                  ),
                  mostYear: mostDonationsYear.year,
                  mostCount: formatNumber(
                    browserBasedLocale,
                    mostDonationsYear.count,
                  ),
                })}
              </>
            ) : null}
            {biggestDonation ? (
              <>
                <br />
                <Translation
                  t={tDonor}
                  translationId={"biggest"}
                  variables={{
                    amount: formatCountryCurrency(
                      browserBasedLocale,
                      biggestDonation[DonationField.Amount],
                      countryConfig,
                    ),
                    date: formatDate(
                      browserBasedLocale,
                      new Date(biggestDonation[DonationField.Date]),
                    ),
                    party: (
                      <TextPartyLink
                        party={biggestDonation[DonationField.Receiver]}
                        country={countryConfig}
                        locale={locale}
                      />
                    ),
                  }}
                />
              </>
            ) : null}
          </p>
        </ArticleSectionColumn>
        <ArticleSectionColumn>
          <div>
            <LoadedDonationYearsTreemap
              country={countryConfig}
              title={tDonor("tree_map", {
                name: donorName,
              })}
              subtitle={tDonor("tree_map_subtitle", {
                donor: donorName,
                country: getCountryName(countryConfig, tCountries),
              })}
              parties={countryConfig.parties}
              donations={donations}
            />
          </div>
        </ArticleSectionColumn>
      </ArticleSectionTwoColumns>
    </ArticleSectionWrapper>
  );
};

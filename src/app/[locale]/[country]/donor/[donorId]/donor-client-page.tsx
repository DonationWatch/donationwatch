"use client";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";
import type { Donation, ReceiverId } from "@/utils/types";

import { DonationStackedTimeseriesChart } from "@/components/charts/donation-sum-chart";
import { LoadedDonationYearsTreemap } from "@/components/charts/loading-donation-years-treemap";
import { RankBadge } from "@/components/donations/ranking-item";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { TextPartyLink } from "@/components/parties/text-party-link";
import { PercentageHint } from "@/components/percentage-hint";
import { DonationHistoryTable } from "@/components/table/donation-history-table";
import { Translation } from "@/components/translation";
import { useDonationsByDonorId } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getCountryName, getParty } from "@/utils/countries";
import { donationYear, fillYears } from "@/utils/date";
import { getDonorName } from "@/utils/donor";
import {
  formatAnd,
  formatCountryCurrency,
  formatDate,
  formatNumber,
  formatPercentFormat,
} from "@/utils/formatter";
import { DonationField } from "@/utils/types";

const DonorClientPageContent = ({
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
              sum: formatCountryCurrency(locale, sum, countryConfig),
              count: formatNumber(locale, donations.length),
              avg: formatCountryCurrency(locale, avg, countryConfig),
              parties: formatNumber(
                locale,
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
                        locale,
                        partyDonation.sum,
                        countryConfig,
                      )}
                    </span>
                    <PercentageHint
                      locale={locale}
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
                  text={tDonor.raw("oldest")}
                  variables={{
                    minYear: countryConfig.minYear,
                    date: formatDate(
                      locale,
                      new Date(oldestDonation[DonationField.Date]),
                    ),
                    amount: formatCountryCurrency(
                      locale,
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
                  text={tDonor.raw("newest")}
                  variables={{
                    date: formatDate(
                      locale,
                      new Date(newestDonation[DonationField.Date]),
                    ),
                    amount: formatCountryCurrency(
                      locale,
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
              text={tDonor.raw("most_donations")}
              variables={{
                list: formatAnd(
                  locale,
                  mostPartyDonations.map(({ party, count }) =>
                    tDonor("most_donations_item", {
                      party: getParty(countryConfig, party).short,
                      count: formatNumber(locale, count),
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
                    locale,
                    biggestYear.sum,
                    countryConfig,
                  ),
                  mostYear: mostDonationsYear.year,
                  mostCount: formatNumber(locale, mostDonationsYear.count),
                })}
              </>
            ) : null}
            {biggestDonation ? (
              <>
                <br />
                <Translation
                  text={tDonor.raw("biggest")}
                  variables={{
                    amount: formatCountryCurrency(
                      locale,
                      biggestDonation[DonationField.Amount],
                      countryConfig,
                    ),
                    date: formatDate(
                      locale,
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

const DonorDonationTimeline = ({
  countryConfig,
  donations,
}: {
  donorId: string;
  countryConfig: CountryConfig;
  donations: Donation[];
}) => {
  const tCountries = useTranslations("countries");
  const tDonor = useTranslations("donor");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const firstYear = donationYear(donations[0]);
  const lastYear = donationYear(donations[donations.length - 1]);
  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );

  const parties = new Set<ReceiverId>();
  const sumPerYear: Record<string, number> = {};

  let donationsHaveYearsOnly: boolean = true;
  let sum = 0;

  donations.forEach((donation) => {
    parties.add(donation[DonationField.Receiver]);

    sum += donation[DonationField.Amount];
    const year = donationYear(donation);
    sumPerYear[year] ??= 0;
    sumPerYear[year] += donation[DonationField.Amount];

    if (donation[DonationField.Date].length > 4) {
      donationsHaveYearsOnly = false;
    }
  });

  return (
    <ArticleSectionWrapper id={"sec-donor-timeseries"}>
      <ArticleSectionTwoColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id={"sec-donor-timeseries"}
            title={tDonor("timeline.title")}
          />

          <p className="mb-6">
            {tDonor("timeline.p0", {
              donor: donorName,
              year: firstYear,
            })}
          </p>
          <p className="mb-6">{tDonor("timeline.years")}</p>
          <ul className="mx-2 py-2 text-sm *:py-1">
            {Object.entries(sumPerYear).map(([year, yearSum]) => (
              <li key={year} className="">
                <div className="flex w-full items-center justify-between text-sm font-semibold">
                  <span>{year}</span>
                  <span className="tabular-nums">
                    <span>
                      {formatCountryCurrency(locale, yearSum, countryConfig)}
                    </span>{" "}
                    <span
                      className={
                        "hidden w-14 text-right text-gray-500 lg:inline-block dark:text-gray-400"
                      }
                    >
                      ({formatPercentFormat(locale, yearSum / sum)})
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="mb-6">{tDonor("timeline.p1")}</p>
        </ArticleSectionColumn>
        <ArticleSectionColumn>
          <div>
            <DonationStackedTimeseriesChart
              donations={donations}
              country={countryConfig}
              donationsHaveYearsOnly={donationsHaveYearsOnly}
              title={tDonor("timeline.title")}
              subtitle={tDonor("timeline.chart_subtitle", {
                country: getCountryName(countryConfig, tCountries),
                donor: donorName,
                minYear: firstYear,
              })}
              years={fillYears(firstYear, lastYear)}
              parties={[...parties].map((id) => getParty(countryConfig, id))}
            />
          </div>
        </ArticleSectionColumn>
      </ArticleSectionTwoColumns>
    </ArticleSectionWrapper>
  );
};

export const DonorClientPage = ({
  donorId,
  countryConfig,
}: {
  donorId: string;
  countryConfig: CountryConfig;
  country: Country;
}) => {
  const t = useTranslations("data");
  const { data, isLoading, error } = useDonationsByDonorId(
    countryConfig,
    donorId,
  );

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );

  if (error || !data) return t("error");

  if (!data || !data.length) {
    return notFound();
  }

  return (
    <Article fullWidth={true}>
      <DonorClientPageContent
        donorId={donorId}
        countryConfig={countryConfig}
        donations={data}
      />
      <DonorDonationTimeline
        donorId={donorId}
        countryConfig={countryConfig}
        donations={data}
      />
      <DonorDonationTable countryConfig={countryConfig} donations={data} />
    </Article>
  );
};

const DonorDonationTable = ({
  donations,
  countryConfig,
}: {
  countryConfig: CountryConfig;
  donations: Donation[];
}) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const donorName = getDonorName(
    donations.at(0)?.[DonationField.DonorName] ?? "",
    tCommon,
  );

  return (
    <ArticleSectionWrapper id={"sec-donor-donations-table"}>
      <ArticleSectionOneColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            id={"sec-donor-donations-table"}
            title={t("changes.title")}
          />

          <p className="mb-6">
            {t("donor.table", {
              donor: donorName,
            })}
          </p>

          <DonationHistoryTable
            readonlyDonor={true}
            donations={donations}
            country={countryConfig}
            years={countryConfig.years}
            partiesIds={[]}
          />
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};

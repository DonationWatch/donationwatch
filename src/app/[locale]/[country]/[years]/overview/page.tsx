import { notFound } from "next/navigation";

import { DonationYearScatterPlot } from "../../../../../components/chart/donation-year-scatter-plot";
import { DonationsPieChart } from "../../../../../components/chart/donations-pie-chart";
import { FormatAnd } from "../../../../../components/formatter";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "../../../../../components/layout/article";
import { TextPartyLink } from "../../../../../components/text-party-link";
import { TopPartyYearDonations } from "../../../../../components/top-party-year-donations";
import { Translation } from "../../../../../components/translation";
import { YearsHeader } from "../../../../../components/years-header";
import { getCountryName } from "../../../../../utils/countries";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import { getParties } from "../../../../../utils/data/get-parties";
import { getPartiesSum } from "../../../../../utils/data/get-parties-sum";
import {
  formatAnd,
  formatCompactCountryCurrency,
  formatCountryCurrency,
  formatYearsRange,
} from "../../../../../utils/formatter";
import {
  getPartyYearsSums,
  hasYearSums,
} from "../../../../../utils/loader/party-years-sums";
import { generateAlternates } from "../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { deserializeYears } from "../../../../../utils/serializers";
import { isValidCountry, isValidLocale } from "../../../../../utils/validate";
import { getTranslations, t } from "../../../translations";

import type { Country } from "../../../../../utils/countries";
import type { PartySum } from "../../../../../utils/data/get-parties-sum";
import type { ConstLocale } from "../../../../../utils/locales";
import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/[years]/overview">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { locale, country } = params;
  const years = params.years;

  const [translations, countryConfig, partyYearSums] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  const countryName = getCountryName(countryConfig, translations);
  const deserializedYears = deserializeYears(years);
  const yearRange = formatYearsRange(deserializedYears);
  const parties = getParties(countryConfig, deserializedYears);
  const { sum, count } = getPartiesSum(
    countryConfig,
    partyYearSums,
    parties,
    deserializedYears,
  );

  const description = t(translations.page_title.years.description, {
    year: yearRange,
    country: countryName,
    parties: parties.length,
    sum: formatCompactCountryCurrency(locale, sum, countryConfig),
    count,
    minAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
  });

  return {
    title: `${t(translations.page_title.years.overview, {
      year: yearRange,
      country: countryName,
    })}`,
    description,
    alternates: generateAlternates(`${country}/${years}/overview`),
  };
}

export default async function OverviewPage(props: {
  params: Promise<{
    locale: ConstLocale;
    years: string;
    country: Country;
  }>;
}) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();

  const { locale } = params;
  const years = deserializeYears(params.years);
  const [translations, countryConfig, partyYearSums] = await Promise.all([
    getTranslations(params.locale),
    getCountryConfig(params.country),
    getPartyYearsSums(params.country),
  ]);

  if (!hasYearSums(partyYearSums, years)) {
    const lastYearWithData = Object.entries(partyYearSums)
      .toReversed()
      .find(([, sums]) => Object.keys(sums).length > 0);

    return (
      <div className="grow">
        <Article
          skipTitleOffset={true}
          title={translations.years.no_data.title}
          subtitle={
            <>
              <p>
                {t(translations.years.no_data.summary, {
                  year: formatYearsRange(years),
                })}
                {lastYearWithData
                  ? " " +
                    t(translations.years.no_data.last_year, {
                      year: lastYearWithData[0],
                    })
                  : null}
              </p>
              {lastYearWithData ? (
                <YearsHeader
                  className="card card--action mt-8"
                  country={countryConfig}
                  idPrefix="list-"
                  translations={translations}
                  locale={locale}
                  years={[lastYearWithData[0]]}
                  partySums={partyYearSums}
                />
              ) : null}
            </>
          }
        />
      </div>
    );
  }

  const parties = getParties(countryConfig, years);
  const { sum, sums, count } = getPartiesSum(
    countryConfig,
    partyYearSums,
    parties,
    years,
  );

  let mostDonations: PartySum | undefined;
  const donationsSums: PartySum[] = [];

  sums.forEach((sum) => {
    if (!mostDonations) mostDonations = sum;

    if (mostDonations[1].count < sum[1].count) mostDonations = sum;

    donationsSums.push(sum);
  });

  const topDonationSums = donationsSums
    .toSorted((a, b) => b[1].sum - a[1].sum)
    .slice(0, 5);

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-years-overview"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-overview"}
              title={translations.overview.detail.title}
            />
            <p className="mb-6">{translations.overview.detail.summary}</p>
            <p className="mb-6">
              {t(translations.overview.detail.summary2, {
                years: formatAnd(params.locale, years),
                partyCount: sums.length,
                donationCount: count,
                minimumAmount: formatCompactCountryCurrency(
                  params.locale,
                  countryConfig.minPublicDonationAmount,
                  countryConfig,
                ),
                donationSum: formatCountryCurrency(
                  params.locale,
                  sum,
                  countryConfig,
                ),
              })}
            </p>
            {topDonationSums.length ? (
              <p className="mb-6">
                <Translation
                  text={translations.overview.detail.highest_sum}
                  variables={{
                    years: formatYearsRange(years),
                    parties: (
                      <FormatAnd
                        locale={locale}
                        items={topDonationSums.map(([receiverId, sum]) => (
                          <>
                            <TextPartyLink
                              country={countryConfig}
                              party={receiverId}
                              translations={translations}
                              locale={locale}
                            />
                            (
                            {formatCountryCurrency(
                              locale,
                              sum.sum,
                              countryConfig,
                            )}
                            )
                          </>
                        ))}
                      />
                    ),
                  }}
                />
              </p>
            ) : null}
            {mostDonations && (
              <p className="mb-6">
                <Translation
                  text={translations.overview.detail.most_donations}
                  variables={{
                    party: (
                      <TextPartyLink
                        party={mostDonations[0]}
                        country={countryConfig}
                        translations={translations}
                        locale={locale}
                      />
                    ),
                    count: mostDonations[1].count,
                    sum: formatCountryCurrency(
                      params.locale,
                      mostDonations[1].sum,
                      countryConfig,
                    ),
                  }}
                />
              </p>
            )}
            <TopPartyYearDonations
              translations={translations}
              locale={locale}
              years={years}
              country={countryConfig}
              sums={sums}
              sum={sum}
            />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <DonationsPieChart
                years={years}
                country={countryConfig}
                partyYearsSums={partyYearSums}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>

      {count > 0 ? (
        <ArticleSectionWrapper id={"sec-scatter"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h2"}
                id={"sec-scatter"}
                title={translations.overview.scatter.title}
              />
              <p className="mb-6">{translations.overview.scatter.summary}</p>
              <DonationYearScatterPlot
                years={years}
                country={countryConfig}
                parties={parties}
                title={translations.overview.scatter.title}
                subtitle={t(translations.overview.scatter.subtitle, {
                  country: getCountryName(countryConfig, translations),
                  years: formatYearsRange(years),
                })}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
    </Article>
  );
}

import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoadingDonationPartyTreemap } from "../../../../../../components/chart/loading-donation-years-treemap";
import { LoadingPartyDonorTypeTreemap } from "../../../../../../components/chart/loading-donor-types-treemap";
import { DonorOverviewList } from "../../../../../../components/donor-overview-list";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "../../../../../../components/layout/article";
import { LoadingPartyDonorTypeText } from "../../../../../../components/part-donor-type-text";
import { PartyDonorPageText } from "../../../../../../components/party-donor-page-text";
import { getCountryName, getParty } from "../../../../../../utils/countries";
import { getCountryConfig } from "../../../../../../utils/data/get-country-config";
import {
  formatCompactCountryCurrency,
  formatCountryCurrency,
} from "../../../../../../utils/formatter";
import { getPartyYearsSums } from "../../../../../../utils/loader/party-years-sums";
import { generateAlternates } from "../../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../../utils/not-found-metadata";
import {
  isValidCountry,
  isValidLocale,
  isValidParty,
} from "../../../../../../utils/validate";

import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/donors">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { locale, country, partyId } = params;

  const [tCountries, tPageTitle, countryConfig, partySums] = await Promise.all([
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "page_title" }),
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;

  const party = getParty(countryConfig, partyId);

  let sum = 0;
  let count = 0;

  for (const partySum of Object.values(partySums)) {
    for (const [party, yearSum] of Object.entries(partySum)) {
      if (party !== partyId) continue;

      sum += yearSum.sum;
      count += yearSum.count;
    }
  }

  const description = tPageTitle("party.description", {
    year: countryConfig.minYear,
    party: party.short,
    count,
    minimumAmount: formatCompactCountryCurrency(
      locale,
      countryConfig.minPublicDonationAmount,
      countryConfig,
    ),
    sum: formatCountryCurrency(locale, sum, countryConfig),
    country: getCountryName(countryConfig, tCountries),
  });

  return {
    title: tPageTitle("party.donors", {
      party: party.short,
      country: getCountryName(countryConfig, tCountries),
    }),
    description,
    alternates: generateAlternates(`${country}/party/${partyId}/donors`),
  };
}

export default async function DonorPage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/donors">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-party-donors"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <PartyDonorPageText party={party} country={countryConfig} />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <div>
              <LoadingDonationPartyTreemap
                country={countryConfig}
                party={party}
                tooSmallAreaColor={party.color}
                title={t("party.donors.title", {
                  party: party.short,
                })}
                subtitle={t("party.donors.subtitle", {
                  party: party.short,
                  country: getCountryName(countryConfig, tCountries),
                })}
              />
            </div>
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>

      {countryConfig.hasDonorType ? (
        <ArticleSectionWrapper id={"sec-party-donor-types"}>
          <ArticleSectionTwoColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                id={"sec-party-donor-types"}
                title={t("party.donor_types.title")}
              />
              <LoadingPartyDonorTypeText
                country={countryConfig}
                party={party}
              />
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <LoadingPartyDonorTypeTreemap
                country={countryConfig}
                party={party}
                title={t("party.donor_types.treemap.title", {
                  party: party.short,
                })}
                subtitle={t("party.donor_types.treemap.description", {
                  party: party.short,
                  country: getCountryName(countryConfig, tCountries),
                })}
              />
            </ArticleSectionColumn>
          </ArticleSectionTwoColumns>
        </ArticleSectionWrapper>
      ) : null}

      <ArticleSectionWrapper id={"sec-donor-list"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <DonorOverviewList countryConfig={countryConfig} party={party} />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </Article>
  );
}

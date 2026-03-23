import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DonationPerMonthChart } from "@/components/charts/donation-per-month-chart";
import { DonationPartyChart } from "@/components/charts/donation-sum-chart";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { PartyTimelineText } from "@/components/parties/party-timeline-text";
import { getCountryName, getParty } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { formatYearsRange } from "@/utils/formatter";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale, isValidParty } from "@/utils/validate";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [t, tCountries, tPageTitle, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getTranslations({ locale: params.locale, namespace: "page_title" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;
  const party = getParty(countryConfig, partyId);

  return {
    title: tPageTitle("party.timeline", {
      party: party.short,
      country: getCountryName(countryConfig, tCountries),
    }),
    description: t("party.timeline.detail.summary", {
      party: party.short,
    }),
    alternates: generateAlternates(`${country}/party/${partyId}/timeline`),
  };
}
export default async function TimelinePage(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale, country, partyId } = params;

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getTranslations({ locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);

  if (!party) {
    return notFound();
  }

  return (
    <Article fullWidth={true}>
      {hasFeature(countryConfig, Features.Date) ? (
        <ArticleSectionWrapper id={"sec-timeline"}>
          <ArticleSectionOneColumns>
            <ArticleSectionColumn>
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={t("party.timeline.detail.title", {
                  party: party.short,
                })}
              />
              <p>
                {t("party.timeline.detail.summary", {
                  party: party.short,
                })}
              </p>
            </ArticleSectionColumn>
            <ArticleSectionColumn>
              <DonationPartyChart
                title={t("party.timeline.chart_title", {
                  party: party.short,
                })}
                subtitle={t("party.timeline.subtitle", {
                  party: party.short,
                  country: getCountryName(countryConfig, tCountries),
                })}
                country={countryConfig}
                years={countryConfig.years}
                party={party}
                limitToFirstDateYear={true}
              />
            </ArticleSectionColumn>
          </ArticleSectionOneColumns>
        </ArticleSectionWrapper>
      ) : null}
      <ArticleSectionWrapper id={"sec-per-year"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            {hasFeature(countryConfig, Features.Date) ? null : (
              <ArticleSectionTitle
                as={"h1"}
                id={"sec-timeline"}
                title={t("party.timeline.detail.title", {
                  party: party.short,
                })}
              />
            )}
            <PartyTimelineText country={countryConfig} party={party} />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <DonationPerMonthChart
              country={countryConfig}
              title={t("per_year_party.title", {
                party: party.short,
              })}
              resolution={"year"}
              subtitle={t("per_year_party.subtitle", {
                country: getCountryName(countryConfig, tCountries),
                years: formatYearsRange(countryConfig.years),
                party: party.short,
              })}
              years={countryConfig.years}
              parties={[party]}
            />
          </ArticleSectionColumn>
        </ArticleSectionTwoColumns>
      </ArticleSectionWrapper>
    </Article>
  );
}

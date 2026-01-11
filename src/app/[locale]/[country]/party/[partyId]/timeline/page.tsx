"use server";

import { notFound } from "next/navigation";

import { DonationPartyChart } from "../../../../../../components/chart/donation-sum-chart";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "../../../../../../components/layout/article";
import { getCountryName, getParty } from "../../../../../../utils/countries";
import { getCountryConfig } from "../../../../../../utils/data/get-country-config";
import { generateAlternates } from "../../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../../utils/not-found-metadata";
import {
  isValidCountry,
  isValidLocale,
  isValidParty,
} from "../../../../../../utils/validate";
import { getTranslations, t } from "../../../../translations";

import type { Metadata } from "next";

import { DonationPerMonthChart } from "@/components/chart/donation-per-month-chart";
import { PartyTimelineText } from "@/components/party-timeline-text";
import { formatYearsRange } from "@/utils/formatter";

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/party/[partyId]/timeline">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;

  const { locale, country, partyId } = params;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;
  const party = getParty(countryConfig, partyId);

  return {
    title: `${t(translations.page_title.party.timeline, {
      party: party.short,
      country: getCountryName(countryConfig, translations),
    })}`,
    description: t(translations.party.timeline.detail.summary, {
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

  const { locale, country, partyId } = params;

  const [translations, countryConfig] = await Promise.all([
    getTranslations(locale),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);

  if (!party) {
    return notFound();
  }

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-timeline"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-timeline"}
              title={t(translations.party.timeline.detail.title, {
                party: party.short,
              })}
            />
            <p>
              {t(translations.party.timeline.detail.summary, {
                party: party.short,
              })}
            </p>
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <DonationPartyChart
              title={t(translations.party.timeline.chart_title, {
                party: party.short,
              })}
              subtitle={t(translations.party.timeline.subtitle, {
                party: party.short,
                country: getCountryName(countryConfig, translations),
              })}
              country={countryConfig}
              years={countryConfig.years}
              party={party}
              limitToFirstDateYear={true}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
      <ArticleSectionWrapper id={"sec-per-year"}>
        <ArticleSectionTwoColumns>
          <ArticleSectionColumn>
            <PartyTimelineText country={countryConfig} party={party} />
          </ArticleSectionColumn>
          <ArticleSectionColumn>
            <DonationPerMonthChart
              country={countryConfig}
              title={t(translations.per_year_party.title, {
                party: party.short,
              })}
              resolution={"year"}
              subtitle={t(translations.per_year_party.subtitle, {
                country: getCountryName(countryConfig, translations),
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

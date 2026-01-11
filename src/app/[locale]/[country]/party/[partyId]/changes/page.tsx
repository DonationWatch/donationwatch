"use server";

import { notFound } from "next/navigation";

import { DynamicPartyDonationHistory } from "../../../../../../components/dynamic-donation-history";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
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
    title: `${t(translations.page_title.party.changes, {
      party: party.short,
      country: getCountryName(countryConfig, translations),
    })}`,
    description: t(translations.party.changes.detail.summary, {
      party: party.short,
    }),
    alternates: generateAlternates(`${country}/party/${partyId}/changes`),
  };
}

export default async function ChangesPage(
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

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-years-changes"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-years-changes"}
              title={t(translations.party.changes.detail.title, {
                party: party.short,
              })}
            />
            <p className="mb-6">
              {t(translations.party.changes.detail.summary, {
                party: party.short,
              })}
            </p>
            <DynamicPartyDonationHistory
              country={countryConfig}
              party={party}
            />
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
    </Article>
  );
}

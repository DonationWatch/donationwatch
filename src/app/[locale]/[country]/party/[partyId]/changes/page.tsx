import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { DynamicPartyDonationHistory } from "@/components/donations/dynamic-donation-history";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import { PartyField } from "@/types/party";
import { getCountryName, getParty } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
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
    title: tPageTitle("party.changes", {
      party: party[PartyField.Short],
      country: getCountryName(countryConfig, tCountries),
    }),
    description: t("party.changes.detail.summary", {
      party: party[PartyField.Short],
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
  setRequestLocale(params.locale);

  const { country, partyId } = params;

  const [t, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
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
              title={t("party.changes.detail.title", {
                party: party[PartyField.Short],
              })}
            />
            <p className="mb-6">
              {t("party.changes.detail.summary", {
                party: party[PartyField.Short],
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

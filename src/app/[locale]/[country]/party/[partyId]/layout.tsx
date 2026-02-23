import { ChartLine, Earth, History, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { AbsoluteMultipleColorsGradient } from "../../../../../components/absolute-multiple-colors-gradient";
import { PageHeader } from "../../../../../components/layout/page-header";
import { MetaCard } from "../../../../../components/meta-card";
import { LastModifiedSchema } from "../../../../../components/schema";
import { NavigationTabs } from "../../../../../components/tabs";
import { WikiQuote } from "../../../../../components/wiki-quote";
import { isNotNullandNotUndefined } from "../../../../../utils/array";
import { partyColor } from "../../../../../utils/color";
import { THUMBNAIL_PREFIX } from "../../../../../utils/config";
import { getParty } from "../../../../../utils/countries";
import { getCountryConfig } from "../../../../../utils/data/get-country-config";
import {
  formatCountryCurrency,
  formatNumber,
} from "../../../../../utils/formatter";
import {
  getPartyYearsSums,
  lastPartyStatsDonation,
} from "../../../../../utils/loader/party-years-sums";
import { baseOpenGraph, baseTwitter } from "../../../../../utils/meta";
import { notFoundMetadata } from "../../../../../utils/not-found-metadata";
import { generateCountryTitlePart } from "../../../../../utils/title";
import {
  isValidCountry,
  isValidLocale,
  isValidParty,
} from "../../../../../utils/validate";

import type { ParamsOf } from "../../../../../../.next/types/routes";
import type { TabItem } from "../../../../../components/tabs";
import type { Metadata } from "next";

export const dynamicParams = true;

const CACHED_PARTIES_COUNT = 10;

export async function generateStaticParams({
  params,
}: {
  params: ParamsOf<"/[locale]/[country]/party/[partyId]">;
}) {
  if (!isValidLocale(params.locale)) return [];
  if (!isValidCountry(params.country)) return [];

  const { country } = params;

  const countryConfig = await getCountryConfig(country);
  return countryConfig.parties
    .toSorted((a, b) => b.sum - a.sum)
    .slice(0, CACHED_PARTIES_COUNT)
    .map((party) => ({
      partyId: party.id,
    }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]">,
): Promise<Metadata> {
  const { locale, country, partyId } = await props.params;

  if (!isValidLocale(locale)) return notFoundMetadata;
  if (!isValidCountry(country)) return notFoundMetadata;
  setRequestLocale(locale);

  const [t, countryConfig] = await Promise.all([
    getTranslations({ locale }),
    getCountryConfig(country),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFoundMetadata;

  const party = getParty(countryConfig, partyId);

  if (!party) {
    return notFoundMetadata;
  }

  const countryPart = generateCountryTitlePart(countryConfig, t);

  const title = {
    template: `%s | DonationWatch`,
    default: `${party.short} | ${countryPart} | DonationWatch`,
  };

  const imageUrl = `${THUMBNAIL_PREFIX}/${locale}/${country}/parties/${party.id}.png`;

  return {
    title,
    openGraph: baseOpenGraph({
      locale,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    }),
    twitter: baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    }),
  };
}

export default async function PartyLayout(
  props: LayoutProps<"/[locale]/[country]/party/[partyId]">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale, country, partyId } = params;

  const { children } = props;

  const [t, countryConfig, partyYearsSums, tCommon] = await Promise.all([
    getTranslations({ locale }),
    getCountryConfig(country),
    getPartyYearsSums(country),
    getTranslations({ locale, namespace: "common" }),
  ]);

  if (!isValidParty(partyId, countryConfig)) return notFound();
  const party = getParty(countryConfig, partyId);

  let donationCount = 0;
  let donationSum = 0;

  Object.values(partyYearsSums).forEach((partyYearSums) => {
    const sums = partyYearSums[party.id];

    if (!sums) return;

    donationCount += sums.count;
    donationSum += sums.sum;
  });

  const showExtendedMeta = true;
  const wikiPageId = party.wiki;
  const tabItems: TabItem[] = [
    {
      icon: UserRound,
      href: `/${locale}/${country}/party/${party.id}/donors`,
      label: t("donors.title"),
    },
    {
      icon: History,
      href: `/${locale}/${country}/party/${party.id}/changes`,
      label: t("changes.title"),
    },
    countryConfig.hasTimeline
      ? {
          icon: ChartLine,
          href: `/${locale}/${country}/party/${party.id}/timeline`,
          label: t("timeline.title"),
        }
      : undefined,
    countryConfig.hasOrigin
      ? {
          icon: Earth,
          href: `/${locale}/${country}/party/${party.id}/origin/overview`,
          label: t("origin.title"),
        }
      : undefined,
  ].filter(isNotNullandNotUndefined);

  const lastDonation = lastPartyStatsDonation(countryConfig, partyYearsSums, {
    partyId,
  });

  return (
    <>
      {lastDonation ? <LastModifiedSchema dateModified={lastDonation} /> : null}
      <AbsoluteMultipleColorsGradient
        colors={[{ color: partyColor(party.id, countryConfig), width: 100 }]}
      />
      <PageHeader>
        <section aria-labelledby="hero-label">
          <div className="mb-4">
            <h2 className="mb-2 text-slate-500 dark:text-slate-300">
              {t("years.title")}
            </h2>
            <h3 className="text-3xl font-semibold sm:text-4xl" id="hero-label">
              {party.short}
            </h3>
            {party.short !== party.name ? (
              <h4 className="mt-1 text-lg">{party.name}</h4>
            ) : null}
          </div>
          <div className="mb-3">
            <div className="flex-row space-y-2 sm:flex sm:space-y-0 sm:space-x-10">
              <MetaCard
                title={t("donation_count")}
                value={formatNumber(locale, donationCount)}
              />
              <MetaCard
                title={t("sum")}
                value={formatCountryCurrency(
                  locale,
                  donationSum,
                  countryConfig,
                )}
              />
              {showExtendedMeta && donationCount > 1 && (
                <MetaCard
                  title={t("average")}
                  value={formatCountryCurrency(
                    locale,
                    donationSum / donationCount,
                    countryConfig,
                  )}
                />
              )}
            </div>
          </div>
          <div className="mb-3">
            {wikiPageId && (
              <section aria-label={tCommon("summary")} className="pt-4 sm:px-4">
                <WikiQuote pageId={wikiPageId} country={countryConfig} />
              </section>
            )}
          </div>
        </section>
      </PageHeader>
      <div className="container mx-auto px-4">
        <div className="space-y-4 pt-4">
          <NavigationTabs items={tabItems} />
        </div>
      </div>
      {children}
    </>
  );
}

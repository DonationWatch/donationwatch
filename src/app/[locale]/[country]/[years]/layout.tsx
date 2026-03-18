import { List, History, UserRound, ChartLine, Earth } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DynamicAbsoluteMultiplePartySumsGradient } from "../../../../components/dynamic-stacked-party-line";
import { PageHeader } from "../../../../components/layout/page-header";
import { LastModifiedSchema } from "../../../../components/schema";
import { NavigationTabs } from "../../../../components/tabs";
import { YearsFooterNav } from "../../../../components/years-footer-nav";
import { YearsHeader } from "../../../../components/years-header";
import { isNotNullandNotUndefined } from "../../../../utils/array";
import { THUMBNAIL_PREFIX } from "../../../../utils/config";
import { getCountryName } from "../../../../utils/countries";
import { getCountryConfig } from "../../../../utils/data/get-country-config";
import { formatYearsRange } from "../../../../utils/formatter";
import {
  getPartyYearsSums,
  hasYearSums,
  lastPartyStatsDonation,
} from "../../../../utils/loader/party-years-sums";
import { baseOpenGraph, baseTwitter } from "../../../../utils/meta";
import { notFoundMetadata } from "../../../../utils/not-found-metadata";
import {
  deserializeYears,
  hasKnownYearRange,
  serializeYears,
} from "../../../../utils/serializers";
import { isValidCountry, isValidLocale } from "../../../../utils/validate";

import type { ParamsOf } from "../../../../../.next/types/routes";
import type { TabItem } from "../../../../components/tabs";
import type { Metadata } from "next";

import { canShowYearsTimeline } from "@/utils/party";

export const dynamicParams = true;

const CACHED_LAST_YEARS = 3;
const CACHED_LAST_LEGISLATIVE_YEARS = 1;

const sortYearsDesc = (a: string, b: string) =>
  parseInt(b, 10) - parseInt(a, 10);

export async function generateStaticParams({
  params,
}: {
  params: ParamsOf<"/[locale]/[country]/[years]">;
}) {
  if (!isValidCountry(params.country)) return [];

  const countryConfig = await getCountryConfig(params.country);

  return [
    // singular years
    ...countryConfig.years.toSorted(sortYearsDesc).slice(0, CACHED_LAST_YEARS),

    // legislative year ranges
    ...(countryConfig.legislativeYears ?? [])
      .map((years) => serializeYears(years))
      .toSorted(sortYearsDesc)
      .slice(0, CACHED_LAST_LEGISLATIVE_YEARS),
  ].map((year) => ({
    years: year,
  }));
}

export async function generateMetadata(
  props: LayoutProps<"/[locale]/[country]/[years]">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const years = deserializeYears(params.years);

  const [t, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(params.country),
  ]);

  const yearsParam = serializeYears(years);
  const imageUrl = `${THUMBNAIL_PREFIX}/${params.locale}/${params.country}/years/${yearsParam}.png`;

  if (!years.length) {
    return notFoundMetadata;
  }

  const title = {
    template: `%s | DonationWatch`,
    default: `${t("title", { country: getCountryName(countryConfig, tCountries) })} ${formatYearsRange(
      years,
    )} | DonationWatch`,
  };

  return {
    title,
    openGraph: baseOpenGraph({
      locale: params.locale,
      images: [{ url: imageUrl, width: 800, height: 418 }],
    }),
    twitter: baseTwitter({
      card: "summary_large_image",
      images: [imageUrl],
    }),
  };
}

export default async function YearsLayout(
  props: LayoutProps<"/[locale]/[country]/[years]">,
) {
  const params = await props.params;

  // Normalize same-year ranges: e.g. /2023-2023/... -> /2023/...
  const sameYearMatch = params.years.match(/^(\d{4})-(\d{4})$/);
  if (sameYearMatch && sameYearMatch[1] === sameYearMatch[2]) {
    redirect(`/${params.locale}/${params.country}/${sameYearMatch[1]}`);
  }

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { children } = props;
  const { locale, country } = params;
  const years = deserializeYears(params.years);

  const [t, countryConfig, partySums] = await Promise.all([
    getTranslations({ locale }),
    getCountryConfig(country),
    getPartyYearsSums(country),
  ]);

  if (!years.length || !hasKnownYearRange(years, countryConfig)) {
    return notFound();
  }

  const yearsLink = serializeYears(years);

  const tabItems: TabItem[] = [
    {
      icon: List,
      href: `/${locale}/${country}/${yearsLink}/overview`,
      label: t("overview.title"),
    },
    {
      icon: History,
      href: `/${locale}/${country}/${yearsLink}/changes`,
      label: t("changes.title"),
    },
    countryConfig.hasNoDonors
      ? undefined
      : {
          icon: UserRound,
          href: `/${locale}/${country}/${yearsLink}/donors`,
          activeHref: `/${locale}/${country}/${yearsLink}/donors`,
          label: t("donors.title"),
        },
    canShowYearsTimeline(countryConfig, partySums, years)
      ? {
          icon: ChartLine,
          href: `/${locale}/${country}/${yearsLink}/timeline`,
          label: t("timeline.title"),
        }
      : undefined,
    countryConfig.hasOrigin
      ? {
          icon: Earth,
          href: `/${locale}/${country}/${yearsLink}/origin/overview`,
          activeHref: `/${locale}/${country}/${yearsLink}/origin`,
          label: t("origin.title"),
        }
      : undefined,
  ].filter(isNotNullandNotUndefined);

  const lastDonation = lastPartyStatsDonation(countryConfig, partySums, {
    year: years.at(-1)!,
  });

  return (
    <>
      {lastDonation ? <LastModifiedSchema dateModified={lastDonation} /> : null}
      <DynamicAbsoluteMultiplePartySumsGradient
        partyYearsSums={partySums}
        years={years}
        country={countryConfig}
      />

      <PageHeader>
        <YearsHeader
          titleBeforeYears={true}
          title={t("years.title")}
          idPrefix="hero-"
          locale={locale}
          years={years}
          showTop3={false}
          showExtendedMeta={true}
          readonly={true}
          country={countryConfig}
          partySums={partySums}
          withStackedBar={false}
        />
      </PageHeader>

      {hasYearSums(partySums, years) ? (
        <div className="container mx-auto px-4">
          <div className="space-y-4 pt-4">
            <NavigationTabs items={tabItems} />
          </div>
        </div>
      ) : null}

      {children}

      <div className="container mx-auto px-4">
        <YearsFooterNav years={years} locale={locale} country={countryConfig} />
      </div>
    </>
  );
}

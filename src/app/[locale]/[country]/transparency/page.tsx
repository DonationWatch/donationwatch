import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Article, ArticleSection } from "../../../../components/layout/article";
import { getCountryConfig } from "../../../../utils/data/get-country-config";
import { LOCALES } from "../../../../utils/locales";
import { generateAlternates } from "../../../../utils/meta";
import { notFoundMetadata } from "../../../../utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "../../../../utils/validate";

import type { Metadata } from "next";

import {
  AggregatedDonorsList,
  FilteredDonorsList,
  FilteredReceiversList,
  NormalizedReceiversList,
} from "@/app/[locale]/[country]/transparency/transparency-list";
import { getCountryName } from "@/utils/countries";

export const dynamicParams = false;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/transparency">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const t = await getTranslations({
    locale: params.locale,
    namespace: "transparency",
  });

  return {
    robots: "noindex, nofollow",
    title: `${t("title")} | DonationWatch`,
    alternates: generateAlternates(`${country}/transparency`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/transparency">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { country } = params;

  const [tTransparency, tCountries, countryConfig] = await Promise.all([
    getTranslations({ locale: params.locale, namespace: "transparency" }),
    getTranslations({ locale: params.locale, namespace: "countries" }),
    getCountryConfig(country),
  ]);

  return (
    <Article title={tTransparency("title")}>
      {countryConfig.receiverFilters ? (
        <ArticleSection title={tTransparency("section.filtered_receivers")}>
          <p>{tTransparency("filtered_receivers.p0")}</p>
          <ul className="list-inside list-disc text-sm">
            {countryConfig.receiverFilters.map((filter, idx) => (
              <li key={`filter-${idx}`}>
                <span className="rounded bg-neutral-200 px-1 py-0.5 font-mono dark:bg-neutral-900">
                  {filter.toString()}
                </span>
              </li>
            ))}
          </ul>
          <p>{tTransparency("filtered_receivers.p1")}</p>
          <FilteredReceiversList countryConfig={countryConfig} />
        </ArticleSection>
      ) : null}

      {countryConfig.donorFilters ? (
        <ArticleSection title={tTransparency("section.filtered_donors")}>
          <p>{tTransparency("filtered_donors.p0")}</p>
          <ul className="list-inside list-disc text-sm">
            {countryConfig.donorFilters.map((filter, idx) => (
              <li key={`filter-${idx}`}>
                <span className="rounded bg-neutral-200 px-1 py-0.5 font-mono dark:bg-neutral-900">
                  {filter.toString()}
                </span>
              </li>
            ))}
          </ul>
          <p>{tTransparency("filtered_donors.p1")}</p>
          <FilteredDonorsList countryConfig={countryConfig} />
        </ArticleSection>
      ) : null}

      <NormalizedReceiversList
        title={tTransparency("receivers.title")}
        description={tTransparency("receivers.p0", {
          country: getCountryName(countryConfig, tCountries),
        })}
        countryConfig={countryConfig}
      />

      <ArticleSection title={tTransparency("section.aggregated")}>
        <p>{tTransparency("p0")}</p>
        <p>{tTransparency("p1")}</p>
        <AggregatedDonorsList countryConfig={countryConfig} />
      </ArticleSection>
    </Article>
  );
}

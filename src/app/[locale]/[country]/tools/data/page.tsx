import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CitationGenerator } from "@/components/citation/citation-generator";
import { DataExport } from "@/components/data-export";
import { Article } from "@/components/layout/article";
import { Translation } from "@/components/translation";
import { DATA_LICENSE } from "@/utils/config";
import { COUNTRIES, getCountryName } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { LOCALES } from "@/utils/locales";
import { generateAlternates } from "@/utils/meta";
import { notFoundMetadata } from "@/utils/not-found-metadata";
import { isValidCountry, isValidLocale } from "@/utils/validate";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...COUNTRIES].flatMap((country) =>
    LOCALES.map((locale) => ({ locale, country })),
  );
}

export async function generateMetadata(
  props: PageProps<"/[locale]/[country]/tools/data">,
): Promise<Metadata> {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFoundMetadata;
  if (!isValidCountry(params.country)) return notFoundMetadata;
  setRequestLocale(params.locale);

  const { country } = params;

  const tExport = await getTranslations({
    locale: params.locale,
    namespace: "export",
  });

  return {
    title: `${tExport("title")} | DonationWatch`,
    alternates: generateAlternates(`${country}/tools/data`),
  };
}

export default async function Page(
  props: PageProps<"/[locale]/[country]/tools/data">,
) {
  const params = await props.params;

  if (!isValidLocale(params.locale)) return notFound();
  if (!isValidCountry(params.country)) return notFound();
  setRequestLocale(params.locale);

  const { locale, country } = params;

  const [tExport, tCountries, tNavigation, countryConfig] = await Promise.all([
    getTranslations({ locale, namespace: "export" }),
    getTranslations({ locale, namespace: "countries" }),
    getTranslations({ locale, namespace: "navigation" }),
    getCountryConfig(country),
  ]);

  return (
    <Article title={tExport("title")}>
      <div className="space-y-6">
        <p>
          <Translation
            text={tExport.raw("p0")}
            variables={{
              country: getCountryName(countryConfig, tCountries),
              license: (
                <a
                  href="https://creativecommons.org/licenses/by/4.0/deed.en"
                  target="_blank"
                  rel={"noopener noreferrer"}
                  className="hover:text-primary-800 dark:hover:text-primary-400 underline"
                >
                  {DATA_LICENSE}
                </a>
              ),
            }}
          />
        </p>
        <p>
          <Translation
            text={tExport.raw("p1")}
            variables={{
              source: (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={countryConfig.source.url}
                  className="hover:text-primary-800 dark:hover:text-primary-400 underline"
                >
                  {countryConfig.source.name}
                </a>
              ),
              transparency: (
                <Link
                  href={`/${locale}/${countryConfig.id}/transparency`}
                  prefetch={false}
                  rel="nofollow"
                  className="hover:text-primary-800 dark:hover:text-primary-400 underline"
                >
                  {tNavigation("transparency")}
                </Link>
              ),
            }}
          />
        </p>
        <p>
          {
            <Translation
              text={tExport.raw("license")}
              variables={{
                license: (
                  <a
                    href="https://creativecommons.org/licenses/by/4.0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-800 dark:hover:text-primary-400 underline"
                  >
                    {DATA_LICENSE}
                  </a>
                ),
              }}
            />
          }
        </p>
        <DataExport country={countryConfig} locale={locale} />
      </div>
    </Article>
  );
}

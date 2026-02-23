"use client";
import { useLocale, useTranslations } from "next-intl";

import { FormatAnd } from "../../../../components/formatter";
import { ArticleSection } from "../../../../components/layout/article";
import Loading from "../../../../components/loading";
import { useNormalized } from "../../../../hooks/use-api";
import { getCountryName } from "../../../../utils/countries";

import type { CountryConfig } from "../../../../utils/countries";

export const Transparency = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
  const t = useTranslations();
  const tTransparency = useTranslations("transparency");
  const tData = useTranslations("data");
  const locale = useLocale();
  const { data, error, isLoading } = useNormalized(countryConfig);

  if (isLoading) return <Loading />;
  if (error || !data) return tData("error");

  return (
    <>
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
          <p className="text-sm">
            <FormatAnd
              locale={locale}
              items={data.filteredReceivers.map((name) => (
                <span key={name}>{name}</span>
              ))}
            />
          </p>
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
          <p className="text-sm">
            <FormatAnd
              locale={locale}
              items={data.filteredDonors.map((name) => (
                <span key={name}>{name}</span>
              ))}
            />
          </p>
        </ArticleSection>
      ) : null}

      {data.normalizedReceivers.length ? (
        <ArticleSection title={tTransparency("receivers.title")}>
          <p>
            {tTransparency("receivers.p0", {
              country: getCountryName(countryConfig, t),
            })}
          </p>
          <ul data-testid="transparency-receiver-list">
            {data.normalizedReceivers.map(([name, normalizedVariants]) => {
              return (
                <li
                  key={name}
                  className="border-b border-slate-200 py-2 last:border-b-0 dark:border-slate-950"
                >
                  <div className="font-semibold">{name}</div>
                  <p className="text-sm">
                    <FormatAnd
                      locale={locale}
                      items={normalizedVariants.map((name, idx) => (
                        <span key={idx}>{name}</span>
                      ))}
                    />
                  </p>
                </li>
              );
            })}
          </ul>
        </ArticleSection>
      ) : null}

      <ArticleSection title={tTransparency("section.aggregated")}>
        <p>{tTransparency("p0")}</p>
        <p>{tTransparency("p1")}</p>
        <ul data-testid="transparency-list" className="text-sm">
          {data.normalizedDonors.map(([name, normalizedVariants]) => {
            return (
              <li
                key={name}
                className="border-b border-slate-200 py-2 last:border-b-0 dark:border-slate-950"
              >
                <div className="font-semibold">{name}</div>
                <p>
                  <FormatAnd
                    locale={locale}
                    items={normalizedVariants.map((name, idx) => (
                      <span key={idx}>{name}</span>
                    ))}
                  />
                </p>
              </li>
            );
          })}
        </ul>
      </ArticleSection>
    </>
  );
};

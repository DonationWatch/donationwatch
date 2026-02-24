"use client";

import { useLocale } from "next-intl";

import { FormatAnd } from "../../../../components/formatter";
import { ArticleSection } from "../../../../components/layout/article";
import Loading from "../../../../components/loading";
import { useNormalized } from "../../../../hooks/use-api";

import type { CountryConfig } from "../../../../utils/countries";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const FilteredReceiversList = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
  const tData = useTranslations("data");
  const locale = useLocale();
  const { data, error, isLoading } = useNormalized(countryConfig);

  if (isLoading) return <Loading />;
  if (error || !data) return tData("error");

  return (
    <p className="text-sm">
      <FormatAnd
        locale={locale}
        items={data.filteredReceivers.map((name) => (
          <span key={name}>{name}</span>
        ))}
      />
    </p>
  );
};

export const FilteredDonorsList = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
  const tData = useTranslations("data");
  const locale = useLocale();
  const { data, error, isLoading } = useNormalized(countryConfig);

  if (isLoading) return <Loading />;
  if (error || !data) return tData("error");

  return (
    <p className="text-sm">
      <FormatAnd
        locale={locale}
        items={data.filteredDonors.map((name) => (
          <span key={name}>{name}</span>
        ))}
      />
    </p>
  );
};

export const NormalizedReceiversList = ({
  title,
  description,
  countryConfig,
}: {
  title: string;
  description: string;
  countryConfig: CountryConfig;
}) => {
  const locale = useLocale();
  const { data, error, isLoading } = useNormalized(countryConfig);

  if (isLoading) return null; // Don't show anything while loading for this conditional section? Or maybe separate loading state?
  if (error || !data) return null;

  if (!data.normalizedReceivers.length) return null;

  return (
    <ArticleSection title={title}>
      <p>{description}</p>
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
  );
};

export const AggregatedDonorsList = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
  const tData = useTranslations("data");
  const locale = useLocale();
  const { data, error, isLoading } = useNormalized(countryConfig);

  if (isLoading) return <Loading />;
  if (error || !data) return tData("error");

  return (
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
  );
};

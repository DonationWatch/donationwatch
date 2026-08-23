"use client";

import { useLocale } from "next-intl";
import dynamic from "next/dynamic";

import type { UseNormalizedData } from "@/hooks/use-api";

import { FormatAnd } from "@/components/formatter";
import { ArticleSection } from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useNormalized } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

// We use a dynamic component as we don't care about server rendering + client hydrating this content
export const DynamicTransparencyPageContent = dynamic(
  () => Promise.resolve(TransparencyPageContent),
  { ssr: false },
);

const TransparencyPageContent = ({
  texts,
}: {
  texts: {
    filteredReceivers: { title: string; p0: string; p1: string };
    filteredDonors: { title: string; p0: string; p1: string };
    normalizedReceivers: { title: string; p0: string };
    aggregatedDonors: { title: string; p0: string; p1: string };
  };
}) => {
  const countryConfig = useRequiredCountryConfig();
  const tData = useTranslations("data");
  const { data, error, isLoading } = useNormalized(countryConfig);

  if (isLoading) return <Loading />;
  if (error || !data) return tData("error");

  return (
    <>
      <TransparencyReceiverFiltersList
        data={data}
        title={texts.filteredReceivers.title}
        p0={texts.filteredReceivers.p0}
        p1={texts.filteredReceivers.p1}
      />

      <TransparencyDonorFiltersList
        data={data}
        title={texts.filteredDonors.title}
        p0={texts.filteredDonors.p0}
        p1={texts.filteredDonors.p1}
      />

      <NormalizedReceiversList
        data={data}
        title={texts.normalizedReceivers.title}
        description={texts.normalizedReceivers.p0}
      />

      <ArticleSection title={texts.aggregatedDonors.title}>
        <p>{texts.aggregatedDonors.p0}</p>
        <p>{texts.aggregatedDonors.p1}</p>
        <AggregatedDonorsList data={data} />
      </ArticleSection>
    </>
  );
};

const TransparencyReceiverFiltersList = ({
  data,
  title,
  p0,
  p1,
}: {
  data: UseNormalizedData;
  title: string;
  p0: string;
  p1: string;
}) => {
  if (!data.receiverFilters) return null;

  return (
    <ArticleSection title={title}>
      <p>{p0}</p>
      <ul className="list-inside list-disc text-sm">
        {data.receiverFilters.map((filter, idx) => (
          <li key={`filter-${idx}`}>
            <span className="rounded bg-neutral-200 px-1 py-0.5 font-mono dark:bg-neutral-900">
              {filter.toString()}
            </span>
          </li>
        ))}
      </ul>
      <p>{p1}</p>
      <FilteredReceiversList data={data} />
    </ArticleSection>
  );
};

const TransparencyDonorFiltersList = ({
  data,
  title,
  p0,
  p1,
}: {
  data: UseNormalizedData;
  title: string;
  p0: string;
  p1: string;
}) => {
  if (!data.donorFilters) return null;

  return (
    <ArticleSection title={title}>
      <p>{p0}</p>
      <ul className="list-inside list-disc text-sm">
        {data.donorFilters.map((filter, idx) => (
          <li key={`filter-${idx}`}>
            <span className="rounded bg-neutral-200 px-1 py-0.5 font-mono dark:bg-neutral-900">
              {filter.toString()}
            </span>
          </li>
        ))}
      </ul>
      <p>{p1}</p>
      <FilteredDonorsList data={data} />
    </ArticleSection>
  );
};

const FilteredReceiversList = ({ data }: { data: UseNormalizedData }) => {
  const locale = useLocale();

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

const FilteredDonorsList = ({ data }: { data: UseNormalizedData }) => {
  const locale = useLocale();

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

const NormalizedReceiversList = ({
  data,
  title,
  description,
}: {
  data: UseNormalizedData;
  title: string;
  description: string;
}) => {
  const locale = useLocale();

  if (!data.normalizedReceivers.length) return null;

  return (
    <ArticleSection title={title}>
      <p>{description}</p>
      <ul data-testid="transparency-receiver-list">
        {data.normalizedReceivers.map(([name, normalizedVariants]) => {
          return (
            <li
              key={name}
              className="border-b border-zinc-200 py-2 last:border-b-0 dark:border-zinc-950"
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

const AggregatedDonorsList = ({ data }: { data: UseNormalizedData }) => {
  const locale = useLocale();

  return (
    <ul data-testid="transparency-list" className="text-sm">
      {data.normalizedDonors.map(([name, normalizedVariants]) => {
        return (
          <li
            key={name}
            className="border-b border-zinc-200 py-2 last:border-b-0 dark:border-zinc-950"
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

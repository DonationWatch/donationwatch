"use client";

import { useWikipediaByPageId } from "../hooks/use-api";

import type { UnloadedCountryConfig } from "../utils/countries";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

const WikiQuoteSkeleton = () => (
  <div className="mb-4 animate-pulse border-l-4 border-gray-300 py-2 pl-4 dark:border-gray-700">
    <div className="mb-2 h-4.25 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="mb-2 h-4.25 w-11/12 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="mb-2 h-4.25 w-4/5 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="mb-2 h-4.25 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="mt-6 h-3 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

export const WikiQuote = ({
  pageId,
  country,
}: {
  pageId: number;
  country: UnloadedCountryConfig;
}) => {
  const t = useTranslations("data");
  const { data, error, isLoading } = useWikipediaByPageId(country, pageId);

  if (isLoading) return <WikiQuoteSkeleton />;
  if (error) return <div>{t("error")}</div>;
  if (!data) return null;

  const wikiCountry = country.wikiCountry;
  const url = `https://${wikiCountry}.wikipedia.org/?curid=${pageId}`;
  const text = data.extract.split("\n")[0];

  return (
    <blockquote
      data-testid="wiki-quote"
      className="mb-4 border-l-4 border-gray-300 py-2 pl-4 dark:border-gray-700"
      cite={url}
    >
      <p className="line-clamp-4 text-base whitespace-pre-wrap">{text}</p>
      <cite className="mt-2 block">
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 dark:text-primary-300 text-sm"
          href={url}
        >
          via wikipedia.org
        </a>
      </cite>
    </blockquote>
  );
};

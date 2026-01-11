"use client";

import Loading from "./loading";
import { useWikipediaByPageId } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";

import type { UnloadedCountryConfig } from "../utils/countries";
import type { FC } from "react";

export const WikiQuote: FC<{
  pageId: number;
  country: UnloadedCountryConfig;
}> = ({ pageId, country }) => {
  const { translations } = useTranslations();
  const { data, error, isLoading } = useWikipediaByPageId(country, pageId);

  if (isLoading) return <Loading />;
  if (error) return <div>{translations.data_error}</div>;
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
      <p className="whitespace-pre-wrap">{text}</p>
      <cite>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 dark:text-primary-300"
          href={url}
        >
          via wikipedia.org
        </a>
      </cite>
    </blockquote>
  );
};

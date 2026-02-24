"use client";

import Loading from "./loading";
import { useWikipediaByPageId } from "../hooks/use-api";

import type { UnloadedCountryConfig } from "../utils/countries";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const WikiQuote = ({
  pageId,
  country,
}: {
  pageId: number;
  country: UnloadedCountryConfig;
}) => {
  const t = useTranslations("data");
  const { data, error, isLoading } = useWikipediaByPageId(country, pageId);

  if (isLoading) return <Loading />;
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
      <p className="whitespace-pre-wrap">{text}</p>
      <cite>
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

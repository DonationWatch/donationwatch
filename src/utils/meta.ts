import type { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types";
import type { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import type { Twitter } from "next/dist/lib/metadata/types/twitter-types";

import { BASE_URL, SITE_NAME, TWITTER_SITE } from "./config";
import { CONST_LOCALES } from "./locales";

export const generateAlternates = (
  path?: string,
): Required<Pick<AlternateURLs, "canonical" | "languages">> => {
  const alternates: Required<Pick<AlternateURLs, "canonical" | "languages">> = {
    canonical: "./",
    languages: {},
  };

  CONST_LOCALES.forEach((locale) => {
    alternates.languages[locale] =
      `${BASE_URL}/${locale}${path ? `/${path}` : ""}`;
  });

  return alternates;
};

export const baseOpenGraph = (openGraph?: OpenGraph): OpenGraph => {
  return {
    siteName: SITE_NAME,
    type: "website",
    ...openGraph,
  };
};

export const baseTwitter = (twitter?: Twitter): Twitter => {
  return {
    site: TWITTER_SITE,
    ...twitter,
  };
};

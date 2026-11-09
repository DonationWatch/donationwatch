import type {
  Dataset,
  Organization,
  Person,
  WebPage,
  WithContext,
} from "schema-dts";

import {
  BASE_URL,
  BSKY_URL,
  GITHUB_ORG,
  SITE_NAME,
  TWITTER_URL,
} from "@/utils/config";

export const DatasetSchema = ({
  name,
  description,
  url,
  temporalCoverage,
  spatialCoverage,
  sourceUrl,
}: {
  name: string;
  description: string;
  url: string;
  temporalCoverage: string;
  spatialCoverage: string;
  sourceUrl: string;
}) => {
  const jsonLd: WithContext<Dataset> = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name,
    description,
    url,
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    temporalCoverage,
    spatialCoverage,
    isBasedOn: sourceUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export const OrganizationSchema = () => {
  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    logo: "https://donation.watch/apple-icon.png",
    url: BASE_URL,
    sameAs: [BSKY_URL, TWITTER_URL, GITHUB_ORG],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export const LastModifiedSchema = ({
  dateModified,
}: {
  dateModified: string;
}) => {
  const jsonLd: WithContext<WebPage> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    dateModified,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
};

export const DonorSchema = ({
  name,
  url,
  isPerson,
  sameAs,
}: {
  name: string;
  url: string;
  isPerson: boolean;
  sameAs?: string[];
}) => {
  const jsonLd: WithContext<Person | Organization> = isPerson
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name,
        url,
        ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
      }
    : {
        "@context": "https://schema.org",
        "@type": "Organization",
        name,
        url,
        ...(sameAs && sameAs.length > 0 ? { sameAs } : {}),
      };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
};

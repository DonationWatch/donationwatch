import type { ConstLocale } from "../utils/locales";
import type { FAQPage, Organization, WebPage, WithContext } from "schema-dts";

import { BASE_URL, BSKY_URL, GITHUB_ORG, TWITTER_URL } from "@/utils/config";

export const OrganizationSchema = () => {
  const jsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DonationWatch",
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

export const FaqSchema = ({
  faq,
  inLanguage,
}: {
  inLanguage: ConstLocale;
  faq: { question: string; answer: string }[];
}) => {
  const jsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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

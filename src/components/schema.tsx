import type { ConstLocale } from "../utils/locales";
import type { FC } from "react";
import type { FAQPage, WebPage, WithContext } from "schema-dts";

export const LastModifiedSchema: FC<{
  dateModified: string;
}> = ({ dateModified }) => {
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

export const FaqSchema: FC<{
  inLanguage: ConstLocale;
  faq: { question: string; answer: string }[];
}> = ({ faq, inLanguage }) => {
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

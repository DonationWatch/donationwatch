import type { ReactNode } from "react";

import { Fragment } from "react";

import type { ConstLocale } from "@/utils/locales";

import { andFormatter } from "@/utils/formatter";

const PLACEHOLDER = "__REACT_NODE__";

export const FormatAnd = ({
  locale,
  items,
}: {
  locale: ConstLocale;
  items: ReactNode[];
}) => {
  const placeholders = items.map((_, i) => `${PLACEHOLDER}${i}__`);
  const parts = andFormatter(locale).formatToParts(placeholders);

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "element") {
          const idx = placeholders.indexOf(part.value);
          return <Fragment key={i}>{items[idx]}</Fragment>;
        }
        return <Fragment key={i}>{part.value}</Fragment>;
      })}
    </>
  );
};

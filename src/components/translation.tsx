import { Fragment } from "react";

import type { FC, ReactNode } from "react";

export const splitTranslation = (text: string) => {
  const regex = /\{(\w+)\}/g;
  const parts: {
    id: number;
    type: "static" | "variable";
    value: string;
  }[] = [];
  let lastIndex = 0;
  let match;
  let id = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        id: id++,
        type: "static",
        value: text.slice(lastIndex, match.index),
      });
    }
    parts.push({
      id: id++,
      type: "variable",
      value: match[1],
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push({
      id: id++,
      type: "static",
      value: text.slice(lastIndex),
    });
  }

  return parts;
};

export const Translation: FC<{
  text: string;
  variables?: Record<string, string | number | ReactNode>;
}> = ({ text, variables }) => {
  if (!variables) return text;

  const parts = splitTranslation(text);

  return parts.map((part) => {
    if (part.type === "static")
      return <Fragment key={part.id}>{part.value}</Fragment>;

    return <Fragment key={part.id}>{variables[part.value]}</Fragment>;
  });
};

import type { ReactNode } from "react";

import { Fragment } from "react";

export const splitPlaceholderTranslation = (text: string) => {
  const regex = /__VAR__(\w+)__/g;
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

type TranslationProps<T extends (key: never, ...args: never[]) => string> = {
  t: T;
  translationId: Parameters<T>[0];
  variables: Record<string, string | number | ReactNode>;
};

export const Translation = <
  T extends (key: never, ...args: never[]) => string,
>({
  variables,
  t,
  translationId,
}: TranslationProps<T>) => {
  const processedVariables: Record<string, unknown> = {};
  const reactNodeVariables: Record<string, ReactNode> = {};

  if (variables) {
    for (const [key, val] of Object.entries(variables)) {
      if (val && (typeof val === "object" || typeof val === "function")) {
        processedVariables[key] = `__VAR__${key}__`;
        reactNodeVariables[key] = val as ReactNode;
      } else {
        processedVariables[key] = val;
      }
    }
  }

  const resolvedString = (
    t as unknown as (key: string, variables?: Record<string, unknown>) => string
  )(translationId as string, processedVariables);

  const parts = splitPlaceholderTranslation(resolvedString);

  return (
    <>
      {parts.map((part) => {
        if (part.type === "static")
          return <Fragment key={part.id}>{part.value}</Fragment>;

        return (
          <Fragment key={part.id}>
            {reactNodeVariables[part.value] ?? variables[part.value]}
          </Fragment>
        );
      })}
    </>
  );
};

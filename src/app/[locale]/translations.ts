// import "server-only";
import { DEFAULT_LOCALE } from "../../utils/locales";

import type { Translations } from "../../messages/translations";
import type { ConstLocale, CONST_LOCALES } from "../../utils/locales";

const translations: Record<
  (typeof CONST_LOCALES)[number],
  () => Promise<Translations>
> = {
  en: () => import("../../messages/en").then((module) => module.default),
  de: () => import("../../messages/de").then((module) => module.default),
  nl: () => import("../../messages/nl").then((module) => module.default),
  cs: () => import("../../messages/cs").then((module) => module.default),
  lv: () => import("../../messages/lv").then((module) => module.default),
  et: () => import("../../messages/et").then((module) => module.default),
  hr: () => import("../../messages/hr").then((module) => module.default),
  no: () => import("../../messages/no").then((module) => module.default),
};

const loaded: Record<string, Translations> = {};

export const getTranslations = async (
  locale: ConstLocale,
): Promise<Translations> => {
  if (!translations[locale]) {
    locale = DEFAULT_LOCALE;
  }

  // return cached one
  if (loaded[locale]) return loaded[locale];

  const result = await translations[locale]();
  loaded[locale] = result;
  return result;
};

// Takes a string "Foo {bar} baz" and interpolates it with the given variables
export const t = (
  string: string,
  variables: Record<string, string | number>,
): string => {
  return string.replace(/\{([a-zA-Z0-9]+)}/g, (match: string, key: string) => {
    return `${variables[key] ?? match}`;
  });
};

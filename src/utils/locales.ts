import type En from "../messages/en";

export const LOCALES = ["en", "de", "nl", "cs", "lv", "et", "hr", "no"];
export const CONST_LOCALES = [
  "en",
  "de",
  "nl",
  "cs",
  "lv",
  "et",
  "hr",
  "no",
] as const;
export const DEFAULT_LOCALE = "en";
export const LOCALES_SET = new Set(CONST_LOCALES);

export type ConstLocale = (typeof CONST_LOCALES)[number];
export type Countries = keyof typeof En.countries;

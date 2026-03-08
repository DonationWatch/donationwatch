export const LOCALES = ["en", "de", "nl", "cs", "lv", "et", "hr", "no", "uk"];
export const CONST_LOCALES = [
  "en",
  "de",
  "nl",
  "cs",
  "lv",
  "et",
  "hr",
  "no",
  "uk",
] as const;
export const DEFAULT_LOCALE = "en";
export const LOCALES_SET = new Set(CONST_LOCALES);

export type ConstLocale = (typeof CONST_LOCALES)[number];

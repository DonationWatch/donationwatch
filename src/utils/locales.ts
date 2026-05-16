import type { Brand } from "@/utils/brand";

export const LOCALES = [
  "en",
  "de",
  "nl",
  "cs",
  "lv",
  "et",
  "hr",
  "no",
  "uk",
  "fr",
];
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
  "fr",
] as const;
export const DEFAULT_LOCALE = "en";
export const LOCALES_SET = new Set(CONST_LOCALES);

export type ConstLocale = (typeof CONST_LOCALES)[number];

// The following locale types can be used in the locale based formatters:
// Full locale as reported by the browser, e.g. en-US.
// May contain a full BCP 47 tag like en-US at runtime; branded over ConstLocale as a type anchor.
export type BrowserBasedLocale = Brand<ConstLocale, "BrowserBasedLocale">;
// Locale used in the social media generation
export type ImageLocale = Brand<ConstLocale, "ImageLocale">;
// Locale used in the page generateMetadata functions
export type MetadataLocale = Brand<ConstLocale, "MetadataLocale">;

import { DEFAULT_LOCALE, LOCALES } from "@donationwatch/core/utils/locales";
import acceptLanguageParser from "accept-language-parser";

export const localeFromAcceptLanguage = (
  acceptLanguage: string | null | undefined,
): string => {
  try {
    return (
      acceptLanguageParser.pick(LOCALES, acceptLanguage ?? "", {
        loose: true,
      }) ?? DEFAULT_LOCALE
    );
  } catch {
    return DEFAULT_LOCALE;
  }
};

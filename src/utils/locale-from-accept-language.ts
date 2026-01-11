import acceptLanguageParser from "accept-language-parser";

import { DEFAULT_LOCALE, LOCALES } from "./locales";

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

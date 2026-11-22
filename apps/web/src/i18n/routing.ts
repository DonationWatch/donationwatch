import {
  CONST_LOCALES,
  DEFAULT_LOCALE,
} from "@donationwatch/core/utils/locales";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: CONST_LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LOCALE,

  localeCookie: false,
  alternateLinks: false,
  localeDetection: true,
});

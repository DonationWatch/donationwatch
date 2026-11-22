import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { Page, BrowserContext } from "@playwright/test";
import type { Messages, createTranslator } from "next-intl";

export interface FixtureProps {
  context: BrowserContext;
  page: Page;
  translations: ReturnType<typeof createTranslator<Messages>>;
  locale: ConstLocale;
}

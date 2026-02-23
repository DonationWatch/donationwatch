import type { ConstLocale } from "@/utils/locales";
import type { Page } from "@playwright/test";
import type { createTranslator, Messages } from "next-intl";

export interface FixtureProps {
  page: Page;
  translations: ReturnType<typeof createTranslator<Messages>>;
  locale: ConstLocale;
}

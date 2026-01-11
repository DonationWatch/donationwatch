import type { Translations } from "@/messages/translations";
import type { ConstLocale } from "@/utils/locales";
import type { Page } from "@playwright/test";

export interface FixtureProps {
  page: Page;
  translations: Translations;
  locale: ConstLocale;
}

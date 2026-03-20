import type { Page } from "@playwright/test";
import type { Messages, createTranslator } from "next-intl";

import type { ConstLocale } from "@/utils/locales";

export interface FixtureProps {
  page: Page;
  translations: ReturnType<typeof createTranslator<Messages>>;
  locale: ConstLocale;
}

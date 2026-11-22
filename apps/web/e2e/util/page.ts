import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { Page } from "@playwright/test";
import type { Messages, createTranslator } from "next-intl";

import type { FixtureProps } from "./props";

export class PageObject {
  protected readonly page: Page;
  protected readonly translations: ReturnType<
    typeof createTranslator<Messages>
  >;
  protected readonly locale: ConstLocale;

  constructor(protected readonly props: FixtureProps) {
    this.page = props.page;
    this.translations = props.translations;
    this.locale = props.locale;
  }
}

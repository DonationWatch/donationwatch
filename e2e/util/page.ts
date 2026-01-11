import type { FixtureProps } from "./props";
import type { Translations } from "../../src/messages/translations";
import type { ConstLocale } from "@/utils/locales";
import type { Page } from "@playwright/test";

export class PageObject {
  protected readonly page: Page;
  protected readonly translations: Translations;
  protected readonly locale: ConstLocale;

  constructor(protected readonly props: FixtureProps) {
    this.page = props.page;
    this.translations = props.translations;
    this.locale = props.locale;
  }
}

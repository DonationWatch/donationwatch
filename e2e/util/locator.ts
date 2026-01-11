import type { FixtureProps } from "./props";
import type { Translations } from "../../src/messages/translations";
import type { Locator, Page } from "@playwright/test";

export class LocatorObject {
  protected readonly translations: Translations;
  protected readonly page: Page;

  constructor(
    public readonly locator: Locator,
    protected props: FixtureProps,
  ) {
    this.translations = props.translations;
    this.page = props.page;
  }
}

import type { Locator, Page } from "@playwright/test";
import type { Messages, createTranslator } from "next-intl";

import type { FixtureProps } from "./props";

export class LocatorObject {
  protected readonly translations: ReturnType<
    typeof createTranslator<Messages>
  >;
  protected readonly page: Page;

  constructor(
    public readonly locator: Locator,
    protected props: FixtureProps,
  ) {
    this.translations = props.translations;
    this.page = props.page;
  }
}

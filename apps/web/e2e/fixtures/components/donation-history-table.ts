import type { Locator } from "@playwright/test";

import type { FixtureProps } from "../../util/props";

import { LocatorObject } from "../../util/locator";

export class Table extends LocatorObject {
  private readonly columnHeaders: Locator;
  public readonly rows: Locator;

  constructor(locator: Locator, props: FixtureProps) {
    super(locator, props);

    this.columnHeaders = this.locator.getByRole("columnheader");
    this.rows = this.locator.locator("tbody").getByRole("row");
  }
}

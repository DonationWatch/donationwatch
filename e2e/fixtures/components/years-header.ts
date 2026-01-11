import { expect } from "@playwright/test";

import { LocatorObject } from "../../util/locator";

import type { FixtureProps } from "../../util/props";
import type { Locator } from "@playwright/test";

export class YearsHeader extends LocatorObject {
  public readonly yearsHeader: Locator;
  public readonly rankingItems: Locator;

  constructor(locator: Locator, props: FixtureProps) {
    super(locator, props);

    this.yearsHeader = locator.getByRole("heading");
    this.rankingItems = locator.getByTestId("ranking-item");
  }

  public async expectHasRankingItems() {
    await expect.poll(() => this.rankingItems.count()).toBeGreaterThan(0);
  }
}

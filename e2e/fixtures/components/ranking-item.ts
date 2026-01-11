import { expect } from "@playwright/test";

import { LocatorObject } from "../../util/locator";

import type { FixtureProps } from "../../util/props";
import type { Locator } from "@playwright/test";

export class RankingItem extends LocatorObject {
  public readonly button: Locator;
  public readonly detail: Locator;

  constructor(locator: Locator, props: FixtureProps) {
    super(locator, props);

    this.button = locator.locator("[role=button][aria-controls]");
    this.detail = locator.getByTestId("ranking-item-detail");
  }

  public async toggle() {
    await this.button.click();
  }

  public async expectDetailVisible(isVisible = true) {
    if (isVisible) {
      await expect(this.detail).toBeVisible();
    } else {
      await expect(this.detail).toBeHidden();
    }
  }
}

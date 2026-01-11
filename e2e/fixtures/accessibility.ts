import AxeBuilder from "@axe-core/playwright";
import { expect } from "@playwright/test";

import { PageObject } from "../util/page";

export class Accessibility extends PageObject {
  public async check() {
    const accessibilityScanResults = await new AxeBuilder({
      page: this.page,
    })
      .disableRules([])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  }
}

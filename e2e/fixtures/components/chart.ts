import { expect } from "@playwright/test";

import { LocatorObject } from "../../util/locator";

import type { ChartFeature } from "../../../src/components/chart/echart";
import type { FixtureProps } from "../../util/props";
import type { Locator } from "@playwright/test";

export class Chart extends LocatorObject {
  constructor(
    private feature: ChartFeature,
    locator: Locator,
    props: FixtureProps,
  ) {
    super(locator, props);
  }

  public async expectHasFeature() {
    await expect(this.locator).toHaveAttribute(
      "data-testid-feature",
      this.feature,
    );
  }
}

import type { Locator } from "@playwright/test";

import { expect } from "@playwright/test";

import type { ChartFeature } from "@/components/charts/echart";

import type { FixtureProps } from "../../util/props";

import { LocatorObject } from "../../util/locator";

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

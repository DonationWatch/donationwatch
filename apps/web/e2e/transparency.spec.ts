import { expect } from "@playwright/test";

import { test } from "./util/fixture";

test.describe("Methodology", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/germany/methodology`);
  });

  test(`is accessible`, async ({ page, accessibility }) => {
    // await expect(page.getByTestId("transparency-receiver-list")).toBeVisible();
    await page.getByTestId("aggregated-donors-trigger").click();
    await expect(page.getByTestId("transparency-list")).toBeVisible();
    await accessibility.check();
  });
});

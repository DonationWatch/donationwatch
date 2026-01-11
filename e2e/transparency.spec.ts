import { expect } from "@playwright/test";

import { test } from "./util/fixture";

test.describe("Transparency", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/germany/transparency`);
  });

  test(`is accessible`, async ({ page, accessibility }) => {
    // await expect(page.getByTestId("transparency-receiver-list")).toBeVisible();
    await expect(page.getByTestId("transparency-list")).toBeVisible();
    await accessibility.check();
  });
});

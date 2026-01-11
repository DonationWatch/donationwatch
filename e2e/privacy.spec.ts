import { expect } from "@playwright/test";

import { test } from "./util/fixture";

test.describe("Privacy page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/privacy`);
  });

  test(`is accessible`, async ({ accessibility, translations, page }) => {
    await expect(
      page.getByRole("heading", { name: translations.privacy.title }),
    ).toBeVisible();

    await accessibility.check();
  });
});

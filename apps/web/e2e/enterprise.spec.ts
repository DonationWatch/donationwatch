import { expect } from "@playwright/test";

import { test } from "./util/fixture";

test.describe("Enterprise page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/enterprise`);
  });

  test("is accessible and has correct headings", async ({
    accessibility,
    enterprisePage,
  }) => {
    await expect(enterprisePage.heading).toBeVisible();
    await expect(enterprisePage.formTitle).toBeVisible();

    await accessibility.check();
  });

  test("form has required inputs", async ({ enterprisePage }) => {
    await expect(enterprisePage.fullNameInput).toBeVisible();
    await expect(enterprisePage.workEmailInput).toBeVisible();
    await expect(enterprisePage.organizationInput).toBeVisible();
    await expect(enterprisePage.queryRequestInput).toBeVisible();
    await expect(enterprisePage.submitButton).toBeVisible();
  });
});

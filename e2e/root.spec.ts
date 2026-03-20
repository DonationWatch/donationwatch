import { expect } from "@playwright/test";

import { COUNTRIES } from "@/utils/countries";

import { test } from "./util/fixture";

test.describe("Root page", () => {
  test.beforeEach(async ({ page, rootPage, baseURL }) => {
    await page.goto(`${baseURL}`);
    await expect(rootPage.heading).toBeVisible();
  });

  test("works", async ({ accessibility, rootPage }) => {
    await test.step("is accessible", async () => {
      await accessibility.check();
    });

    await test.step("has countries links", async () => {
      await expect(rootPage.countryLinks).toHaveCount(COUNTRIES.size);
    });
  });
});

test.describe("detected country banner", () => {
  test("appears and redirects to the detected country if it's a different one", async ({
    page,
    rootPage,
    baseURL,
  }) => {
    await page.route("*/**/api/v1/country", async (route) => {
      await route.fulfill({ json: { country: "UK" } });
    });

    await page.goto(`${baseURL}`);

    await expect(rootPage.detectedCountryIndicator).toBeVisible();
    await rootPage.detectedCountryIndicator.click();

    await page.waitForURL(`${baseURL}/unitedkingdom`);
  });

  test("doesn't appear if the detected country is the current country", async ({
    page,
    rootPage,
    baseURL,
  }) => {
    await page.route("*/**/api/v1/country", async (route) => {
      await route.fulfill({ json: { country: "DE" } });
    });

    await page.goto(`${baseURL}`);

    await expect(rootPage.detectedCountryIndicator).toBeHidden();
  });
});

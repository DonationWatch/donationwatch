import { COUNTRIES } from "@donationwatch/core/utils/countries";
import { expect } from "@playwright/test";

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

    await test.step("has single donations section", async () => {
      await expect(rootPage.singleDonations).toBeVisible();
    });

    await test.step("has top donors section", async () => {
      await expect(rootPage.topDonors).toBeVisible();
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

test.describe("app icons", () => {
  test("serves apple-icon.png and redirects apple-touch-icon probes", async ({
    request,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;

    const appleIcon = await request.get(`${origin}/apple-icon.png`);
    expect(appleIcon.status()).toBe(200);
    expect(appleIcon.headers()["content-type"]).toContain("image/png");

    for (const legacyPath of [
      "/apple-touch-icon.png",
      "/apple-touch-icon-precomposed.png",
    ]) {
      const redirect = await request.get(`${origin}${legacyPath}`, {
        maxRedirects: 0,
      });
      expect(redirect.status()).toBe(308);
      expect(redirect.headers().location).toMatch(/\/apple-icon\.png$/);

      const resolved = await request.get(`${origin}${legacyPath}`);
      expect(resolved.status()).toBe(200);
      expect(resolved.headers()["content-type"]).toContain("image/png");
    }
  });

  test("serves favicons and emits expected icon link tags without duplicates", async ({
    page,
    request,
    baseURL,
  }) => {
    const origin = new URL(baseURL!).origin;

    const favicon = await request.get(`${origin}/favicon.ico`);
    expect(favicon.status()).toBe(200);

    const darkFavicon = await request.get(`${origin}/favicon-dark.svg`);
    expect(darkFavicon.status()).toBe(200);
    expect(darkFavicon.headers()["content-type"]).toContain("image/svg+xml");

    await page.goto(`${baseURL}`);

    const appleTouchIcon = page.locator('link[rel="apple-touch-icon"]');
    await expect(appleTouchIcon).toHaveAttribute(
      "href",
      /^\/apple-icon\.png\?/,
    );
    await expect(appleTouchIcon).toHaveAttribute("sizes", "180x180");
    await expect(appleTouchIcon).toHaveAttribute("type", "image/png");
    await expect(page.locator('link[rel="icon"]')).toHaveCount(2);
    await expect(
      page.locator(
        'link[rel="icon"][href="/favicon.ico"][media="(prefers-color-scheme: light)"]',
      ),
    ).toHaveCount(1);
    await expect(
      page.locator(
        'link[rel="icon"][href="/favicon-dark.svg"][media="(prefers-color-scheme: dark)"]',
      ),
    ).toHaveCount(1);
  });
});

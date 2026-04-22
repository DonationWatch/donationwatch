import { expect } from "@playwright/test";

import { SITE_NAME } from "@/utils/config";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";

import { test } from "./util/fixture";

test.describe("Homepage", () => {
  COUNTRIES.forEach((country) => {
    test.describe(`for ${country}`, () => {
      test.beforeEach(async ({ search, page, baseURL }) => {
        await page.goto(`${baseURL}/${country}`);
        // wait for the page to load
        await expect(search.openSearchButton).toBeVisible();
      });

      test("works", async ({ accessibility, homePage, meta, locale }) => {
        const countryConfig = await getCountryConfig(country);

        await test.step("is accessible", async () => {
          await accessibility.check();
        });

        await test.step("has correct meta", async () => {
          await meta.expectConfigured(
            SITE_NAME,
            `/${locale}/${country}/cover.png`,
          );
        });

        await test.step("has biggest donations text", async () => {
          await expect(homePage.biggestDonations).toBeVisible({
            visible: hasFeature(countryConfig, Features.Donors),
          });
        });

        await test.step("has donations from current legislative session", async (step) => {
          step.skip(
            !countryConfig.legislativeYears,
            "not all countries have legislative sessions",
          );

          await expect(homePage.currentLegislativePeriod.locator).toBeVisible();

          const cc = await getCountryConfig(country);
          if (hasFeature(cc, Features.Date)) {
            await expect(homePage.mostRecentDonations).toBeVisible();
          }

          await expect(homePage.partiesList).toBeVisible();
          await expect(homePage.pastLegislativePeriods).toBeVisible();

          await test.step("page legislative years header", async () => {
            const headers = await homePage.getPastLegislativeYearsHeader();
            for (const header of headers) {
              await expect(header.locator).toBeVisible();
            }
          });
        });
      });
    });
  });

  test.describe("detected country banner", () => {
    test("appears and redirects to the detected country if it's a different one", async ({
      page,
      homePage,
      baseURL,
    }) => {
      await page.route("*/**/api/v1/country", async (route) => {
        await route.fulfill({ json: { country: "UK" } });
      });

      await page.goto(`${baseURL}/germany`);

      await expect(homePage.detectedCountryIndicator).toBeVisible();
      await homePage.detectedCountryIndicator.click();

      await page.waitForURL(`${baseURL}/unitedkingdom`);
    });

    test("doesn't appear if the detected country is the current country", async ({
      page,
      homePage,
      baseURL,
    }) => {
      await page.route("*/**/api/v1/country", async (route) => {
        await route.fulfill({ json: { country: "DE" } });
      });

      await page.goto(`${baseURL}/germany`);

      await expect(homePage.detectedCountryIndicator).toBeHidden();
    });
  });
});

import { expect } from "@playwright/test";

import { test } from "./util/fixture";
import { COUNTRIES, Country } from "../src/utils/countries";
import { getCountryConfig } from "../src/utils/data/get-country-config";

const CHECK_YEAR = 2023;

test.describe("Year page", () => {
  test("redirects unsupported year to 404", async ({
    country,
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/${country}/2001/overview`);

    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  [...COUNTRIES]
    .filter((c) => c !== Country.croatia)
    .forEach((country) => {
      test.describe(`for ${country}`, () => {
        test.describe("overview page", () => {
          test.beforeEach(async ({ page, baseURL }) => {
            await page.goto(`${baseURL}/${country}/${CHECK_YEAR}/overview`);
            await expect(
              page.locator("article h1"),
              "Current year page is not showing 404",
            ).toBeVisible();
          });

          test("works", async ({
            yearOverviewPage,
            accessibility,
            meta,
            locale,
          }) => {
            await test.step("is accessible", async () => {
              await accessibility.check();
            });

            await test.step("has correct meta", async () => {
              await meta.expectConfigured(
                `${CHECK_YEAR}`,
                `/${locale}/${country}/years/${CHECK_YEAR}.png`,
              );
            });

            await test.step("expandable elements expand", async () => {
              const item = yearOverviewPage.getRankingItemByIndex(0);
              await test.step("expand the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible();
              });
              await test.step("collapse the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible(false);
              });
            });
          });
        });

        test.describe("changes page", () => {
          test.beforeEach(async ({ page, baseURL, historyPage }) => {
            await page.goto(`${baseURL}/${country}/${CHECK_YEAR}/changes`);
            await expect(
              page.locator("article h1"),
              "Current year page is not showing 404",
            ).toBeVisible();
            // wait for table to be loaded
            await expect(historyPage.tableRows.nth(0)).toBeVisible();
          });

          test("works", async ({ accessibility, meta, locale }) => {
            await test.step("is accessible", async () => {
              await accessibility.check();
            });

            await test.step("has correct meta", async () => {
              await meta.expectConfigured(
                `${CHECK_YEAR}`,
                `/${locale}/${country}/years/${CHECK_YEAR}.png`,
              );
            });
          });
        });

        test.describe("donors page", () => {
          test.beforeEach(async ({ page, baseURL }) => {
            await page.goto(
              `${baseURL}/${country}/${CHECK_YEAR}/donors/overview`,
            );
            await expect(
              page.locator("article h1"),
              "Current year page is not showing 404",
            ).toBeVisible();
          });

          test("works", async ({ donorsPage, accessibility, meta, locale }) => {
            await test.step("is accessible", async () => {
              await accessibility.check();
            });

            await test.step("has correct meta", async () => {
              await meta.expectConfigured(
                `${CHECK_YEAR}`,
                `/${locale}/${country}/years/${CHECK_YEAR}.png`,
              );
            });

            await test.step("expandable elements expand", async () => {
              const item = donorsPage.getRankingItemByIndex(0);
              await test.step("expand the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible();
              });
              await test.step("collapse the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible(false);
              });
            });

            await expect(donorsPage.donorList).toBeVisible();

            await test.step("has histogram", async () => {
              await donorsPage.histogramChart.expectHasFeature();
              await expect(
                donorsPage.histogramRankingItems.nth(0),
              ).toBeVisible();
            });
          });
        });

        test.describe("timeline page", () => {
          test.beforeEach(async ({ page, baseURL }) => {
            test.skip(
              !(await getCountryConfig(country)).hasTimeline,
              "Country does not have timeline",
            );

            await page.goto(`${baseURL}/${country}/${CHECK_YEAR}/timeline`);
            await expect(
              page.locator("article h1"),
              "Current year page is not showing 404",
            ).toBeVisible();
          });

          test("works", async ({
            accessibility,
            timelinePage,
            meta,
            locale,
          }) => {
            await test.step("is accessible", async () => {
              await accessibility.check();
            });

            await test.step("has correct meta", async () => {
              await meta.expectConfigured(
                `${CHECK_YEAR}`,
                `/${locale}/${country}/years/${CHECK_YEAR}.png`,
              );
            });

            await timelinePage.timelineChart.expectHasFeature();
            await timelinePage.monthChart.expectHasFeature();
          });
        });

        test.describe("origin page", () => {
          test.beforeEach(async ({ page, baseURL }) => {
            test.skip(
              !(await getCountryConfig(country)).hasOrigin,
              "Country does not have origin",
            );

            await page.goto(
              `${baseURL}/${country}/${CHECK_YEAR}/origin/overview`,
            );
            await expect(
              page.locator("article h1"),
              "Current year page is not showing 404",
            ).toBeVisible();
          });

          test("works", async ({ accessibility, originPage, meta, locale }) => {
            await test.step("is accessible", async () => {
              await accessibility.check();
            });

            await test.step("has correct meta", async () => {
              await meta.expectConfigured(
                `${CHECK_YEAR}`,
                `/${locale}/${country}/years/${CHECK_YEAR}.png`,
              );
            });

            await originPage.originMap.expectHasFeature();

            await test.step("state expandable elements expand", async () => {
              const item = originPage.getStateRankingItemByIndex(0);
              await test.step("expand the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible();
              });
              await test.step("collapse the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible(false);
              });
            });

            await test.step("country expandable elements expand", async () => {
              const item = originPage.getCountryRankingItemByIndex(0);
              await test.step("expand the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible();
              });
              await test.step("collapse the first ranking item", async () => {
                await item.toggle();
                await item.expectDetailVisible(false);
              });
            });
          });
        });
      });
    });
});

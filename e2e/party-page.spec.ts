import { expect } from "@playwright/test";

import { test } from "./util/fixture";

const CHECK_PARTY = "CSU";

test.describe("Party page", () => {
  test("redirects unknown party to 404", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/germany/party/ASDF`);

    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  test.describe("donors page", () => {
    test.beforeEach(async ({ page, baseURL, partyPage }) => {
      await page.goto(`${baseURL}/germany/party/${CHECK_PARTY}/donors`);
      await expect(
        partyPage.pageTitle,
        "Party page is not showing 404",
      ).toBeVisible();
    });

    test("works", async ({
      partyPage,
      donorsPage,
      accessibility,
      meta,
      locale,
    }) => {
      await test.step("is accessible", async () => {
        await accessibility.check();
      });

      await test.step("has no donor type section", async () => {
        await expect(partyPage.donorTypeSection.typeList).toBeHidden();
      });

      await test.step("has correct meta", async () => {
        await meta.expectConfigured(
          CHECK_PARTY,
          `/${locale}/germany/parties/${CHECK_PARTY}.png`,
        );
      });

      await test.step("shows wiki quote", async () => {
        await expect(partyPage.wikiQuote).not.toBeEmpty();
      });

      await test.step("state expandable elements expand", async () => {
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
    });
  });

  test("donor type section", async ({ page, baseURL, partyPage }) => {
    await page.goto(`${baseURL}/unitedkingdom/party/REFORM/donors`);
    await partyPage.donorTypeSection.treemap.expectHasFeature();
    await expect(partyPage.donorTypeSection.typeList).toBeVisible();
  });

  test.describe("history page", () => {
    test.beforeEach(async ({ page, baseURL, historyPage, partyPage }) => {
      await page.goto(`${baseURL}/germany/party/${CHECK_PARTY}/changes`);
      await expect(
        partyPage.pageTitle,
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
          CHECK_PARTY,
          `/${locale}/germany/parties/${CHECK_PARTY}.png`,
        );
      });
    });
  });

  test.describe("timeline page", () => {
    test.beforeEach(async ({ page, baseURL, partyPage }) => {
      await page.goto(`${baseURL}/germany/party/${CHECK_PARTY}/timeline`);
      await expect(
        partyPage.pageTitle,
        "Party page is not showing 404",
      ).toBeVisible();
    });

    test("works", async ({ accessibility, timelinePage, meta, locale }) => {
      await test.step("is accessible", async () => {
        await accessibility.check();
        await timelinePage.timelineChart.expectHasFeature();
        await timelinePage.yearChart.expectHasFeature();
      });

      await test.step("has correct meta", async () => {
        await meta.expectConfigured(
          CHECK_PARTY,
          `/${locale}/germany/parties/${CHECK_PARTY}.png`,
        );
      });
    });
  });

  test.describe("origin page", () => {
    test.beforeEach(async ({ page, baseURL, partyPage }) => {
      await page.goto(
        `${baseURL}/germany/party/${CHECK_PARTY}/origin/overview`,
      );
      await expect(
        partyPage.pageTitle,
        "Current year page is not showing 404",
      ).toBeVisible();
    });

    test("works", async ({ accessibility, originPage, meta, locale }) => {
      await test.step("is accessible", async () => {
        await accessibility.check();
      });

      await test.step("has correct meta", async () => {
        await meta.expectConfigured(
          CHECK_PARTY,
          `/${locale}/germany/parties/${CHECK_PARTY}.png`,
        );
      });

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

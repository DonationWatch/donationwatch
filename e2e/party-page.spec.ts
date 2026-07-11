import { expect } from "@playwright/test";

import { test } from "./util/fixture";

const CHECK_PARTY = "CSU";

test.describe("Party page", () => {
  test("redirects unknown party to 404", async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/germany/party/ASDF`);

    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  test("redirects wrong-cased party id to the correct one", async ({
    page,
    baseURL,
    locale,
  }) => {
    await page.goto(`${baseURL}/germany/party/fdp/donors`);

    await expect(page).toHaveURL(new RegExp(`/${locale}/germany/party/FDP`));
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
      translations,
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

      await test.step("can search for donors", async () => {
        await expect(donorsPage.search).toBeVisible();
        await expect(donorsPage.rankingItems.first()).toBeVisible();

        const filterDonorName = "Fake Donor 26";

        await test.step("search for the first donor's name", async () => {
          await donorsPage.search.fill(filterDonorName);
        });

        await test.step("the first donor should still be visible", async () => {
          await expect(donorsPage.rankingItems).toHaveCount(1);
          await expect(donorsPage.rankingItems.nth(0)).toContainText(
            filterDonorName,
          );
        });

        await test.step("search for a nonexistent donor", async () => {
          await donorsPage.search.fill("NonexistentDonorXYZ");
          await expect(donorsPage.rankingItems).toHaveCount(0);
          await expect(
            donorsPage.donorList.getByText(translations("search.empty")),
          ).toBeVisible();
        });

        await test.step("clear search", async () => {
          await donorsPage.search.fill("");
          await expect
            .poll(() => donorsPage.rankingItems.count())
            .toBeGreaterThan(1);
          await expect(
            donorsPage.rankingItems.filter({ hasText: filterDonorName }),
          ).toBeVisible();
        });
      });
    });
  });

  test("donor type section", async ({ page, baseURL, partyPage }) => {
    await page.goto(`${baseURL}/unitedkingdom/party/REFORM/donors`);
    await partyPage.donorTypeSection.treemap.expectHasFeature();
    await expect(partyPage.donorTypeSection.typeList).toBeVisible();
  });

  test.describe("changes page", () => {
    test.beforeEach(async ({ page, baseURL, historyPage, partyPage }) => {
      await page.goto(`${baseURL}/germany/party/${CHECK_PARTY}/changes`);
      await expect(
        partyPage.pageTitle,
        "Current year page is not showing 404",
      ).toBeVisible();
      // wait for table to be loaded
      await expect(historyPage.tableRows.nth(0)).toBeVisible();
    });

    test("works", async ({ accessibility, meta, locale, historyPage }) => {
      await test.step("is accessible", async () => {
        await accessibility.check();
      });

      await test.step("has correct meta", async () => {
        await meta.expectConfigured(
          CHECK_PARTY,
          `/${locale}/germany/parties/${CHECK_PARTY}.png`,
        );
      });

      await test.step("can search for donors", async () => {
        await historyPage.search.fill("Fake Donor 6");
        await expect(
          historyPage.tableRows.filter({ hasText: "Fake Donor 2" }),
        ).toHaveCount(0);
      });
    });

    test("shows date based on the navigator language", async ({
      page,
      baseURL,
      historyPage,
      browser,
    }) => {
      await page.goto(`${baseURL}/germany/party/${CHECK_PARTY}/changes`);
      const dateCell = historyPage.tableRows.first().locator("td").nth(0);

      await test.step("en useragent uses en-US format", async () => {
        await expect(dateCell).toHaveText("12/26/26");
      });

      await test.step("en-GB useragent uses en-GB format", async () => {
        const context = await browser.newContext({ locale: "en-GB" });
        const gbPage = await context.newPage();
        await gbPage.goto(`${baseURL}/germany/party/${CHECK_PARTY}/changes`);
        const gbDateCell = gbPage
          .locator("table tbody tr")
          .first()
          .locator("td")
          .nth(0);
        await expect(gbDateCell).toHaveText("26/12/26");
        await context.close();
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

    test("is showing the timeseries chart for australia ALP where a couple donations miss a date", async ({
      timelinePage,
      page,
      baseURL,
    }) => {
      await page.goto(`${baseURL}/australia/party/ALP/timeline`);
      await timelinePage.timelineChart.expectHasFeature();
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

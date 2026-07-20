import { expect } from "@playwright/test";

import { COUNTRIES, Country } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { getPartyYearsSums } from "@/utils/loader/party-years-sums";
import { canShowYearsTimeline, getLongName } from "@/utils/party";

import { DONOR_WITH_WIKIPEDIA_ARTICLE } from "../tests/config";
import { test } from "./util/fixture";

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

  test("normalizes same-year range to single year", async ({
    country,
    page,
    baseURL,
    locale,
  }) => {
    await page.goto(`${baseURL}/${country}/2023-2023/overview`);

    await expect(page).toHaveURL(new RegExp(`/${locale}/${country}/2023`));
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
              await test.step("expand it again and follow to the donor page", async () => {
                await item.toggle();
                await item.expectDetailVisible();

                await item.detail.locator("a").first().click();
                await expect(item.locator).toBeHidden();
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

          test("works", async ({
            accessibility,
            meta,
            locale,
            historyPage,
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

            await test.step("can search for donors", async () => {
              await historyPage.search.fill("Fake Donor 6");
              await expect(
                historyPage.tableRows.filter({ hasText: "Fake Donor 2" }),
              ).toHaveCount(0);
            });

            await test.step("can search for parties", async () => {
              const config = await getCountryConfig(country);
              const partyToSearch = config.parties.at(0)!;
              const otherParty = config.parties.at(1)!;

              await historyPage.search.fill(getLongName(partyToSearch));
              await expect(
                historyPage.tableRows.filter({
                  hasText: getLongName(otherParty),
                }),
              ).toHaveCount(0);
            });
          });
        });

        test.describe("donors page", () => {
          test.beforeEach(async ({ page, baseURL }) => {
            test.skip(
              !hasFeature(await getCountryConfig(country), Features.Donors),
              "Country has no donors",
            );

            await page.goto(
              `${baseURL}/${country}/${CHECK_YEAR}/donors/overview`,
            );
            await expect(
              page.locator("article h1"),
              "Current year page is not showing 404",
            ).toBeVisible();
          });

          test("works", async ({
            donorsPage,
            accessibility,
            meta,
            locale,
            translations,
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

            await test.step("can search for donors", async () => {
              await expect(donorsPage.search).toBeVisible();
              await expect(donorsPage.rankingItems.first()).toBeVisible();

              const filterDonorName = DONOR_WITH_WIKIPEDIA_ARTICLE;

              await test.step("search for the donor's name", async () => {
                await donorsPage.search.fill(filterDonorName);
              });

              await test.step("the filtered donor should be visible and be the only one", async () => {
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
              });
            });

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
            const countryConfig = await getCountryConfig(country);
            const partyYearSums = await getPartyYearsSums(country);

            test.skip(
              !hasFeature(countryConfig, Features.Date),
              "Country does not have dates and in turn no timeline",
            );
            test.skip(
              !canShowYearsTimeline(countryConfig, partyYearSums, [
                `${CHECK_YEAR}`,
              ]),
              "Timeline cannot be shown for this country and year",
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
              !hasFeature(await getCountryConfig(country), Features.Origin),
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

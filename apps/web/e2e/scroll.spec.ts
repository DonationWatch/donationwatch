import { DONOR_WITH_WIKIPEDIA_ARTICLE } from "@donationwatch/core/utils/config";
import { sha1Sync as hash } from "@donationwatch/core/utils/hash";
import { expect } from "@playwright/test";

import { test } from "./util/fixture";

const CHECK_PARTY = "CSU";
const CHECK_YEAR = 2023;

test.describe("Scroll behavior", () => {
  test("Party changes page scrolls to section on deep link", async ({
    page,
    baseURL,
  }) => {
    // Navigate to a deep link
    await page.goto(
      `${baseURL}/germany/party/${CHECK_PARTY}/changes#sec-party-changes`,
    );

    // The section title should be visible in the viewport
    const section = page.locator("#sec-party-changes").first();
    await expect(section).toBeInViewport();
  });

  test("Party donors page scrolls to donor list on deep link", async ({
    page,
    baseURL,
  }) => {
    await page.goto(
      `${baseURL}/germany/party/${CHECK_PARTY}/donors#sec-donor-list`,
    );

    const section = page.locator("#sec-donor-list").first();
    await expect(section).toBeInViewport();
  });

  test("Party donors page keeps industries treemap rendered after clicking TOC link", async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/germany/party/${CHECK_PARTY}/donors`);

    const interestsSection = page.locator(
      'section[aria-labelledby="sec-party-interests"]',
    );
    const canvas = interestsSection
      .locator('[data-testid="chart"][data-testid-feature="treemap"] canvas')
      .first();
    await expect(canvas).toBeVisible();

    const tocLink = page.locator(
      'a[data-toc-link][href="#sec-party-interests"]',
    );
    await expect(tocLink).toBeVisible();
    await tocLink.click();

    await expect(page.locator("#sec-party-interests").first()).toBeInViewport();

    await expect
      .poll(async () => {
        return canvas.evaluate((el: HTMLCanvasElement) => {
          const ctx = el.getContext("2d");
          if (!ctx || el.width === 0 || el.height === 0) return false;
          const { data } = ctx.getImageData(0, 0, el.width, el.height);
          const firstR = data[0];
          const firstG = data[1];
          const firstB = data[2];
          const firstA = data[3];
          for (let i = 4; i < data.length; i += 64) {
            if (
              data[i] !== firstR ||
              data[i + 1] !== firstG ||
              data[i + 2] !== firstB ||
              data[i + 3] !== firstA
            ) {
              return true;
            }
          }
          return false;
        });
      })
      .toBe(true);
  });

  test("Year changes page scrolls to section on deep link", async ({
    page,
    baseURL,
  }) => {
    await page.goto(
      `${baseURL}/germany/${CHECK_YEAR}/changes#sec-years-changes`,
    );

    const section = page.locator("#sec-years-changes").first();
    await expect(section).toBeInViewport();
  });

  test("Donor page scrolls to donations table on deep link", async ({
    page,
    baseURL,
  }) => {
    const donorHash = hash(DONOR_WITH_WIKIPEDIA_ARTICLE);
    await page.goto(
      `${baseURL}/germany/donor/${donorHash}#sec-donor-donations-table`,
    );

    const section = page.locator("#sec-donor-donations-table").first();
    await expect(section).toBeInViewport();
  });
});

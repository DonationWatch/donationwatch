import { expect } from "@playwright/test";

import { hash } from "../tasks/load-data/util";
import { DONOR_WITH_WIKIPEDIA_ARTICLE } from "../tests/config";
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

import { expect } from "@playwright/test";

import { test } from "./util/fixture";
import { hash } from "../tasks/load-data/util";
import { DONOR_WITH_WIKIPEDIA_ARTICLE } from "../tests/config";

test.describe("Donor page", () => {
  test("works as expected", async ({
    page,
    donorPage,
    baseURL,
    accessibility,
    meta,
    locale,
  }) => {
    await page.goto(
      `${baseURL}/germany/donor/${hash(DONOR_WITH_WIKIPEDIA_ARTICLE)}`,
    );

    await test.step("wikipedia article loads", async () => {
      await expect(donorPage.wikiQuote).toBeVisible();
      await expect(donorPage.donorName).toBeVisible();
      await expect(donorPage.pageTitle).toBeVisible();
    });

    await test.step("is accessible", async () => {
      await accessibility.check();
    });

    await test.step("has correct meta", async () => {
      await meta.expectConfigured(
        DONOR_WITH_WIKIPEDIA_ARTICLE,
        `/${locale}/germany/cover.png`,
      );
    });

    await test.step("donation table loads", async () => {
      await expect
        .poll(() => donorPage.changesTable.rows.count())
        .toBeGreaterThan(0);

      await test.step("is accessible", async () => {
        await accessibility.check();
      });
    });
  });
});

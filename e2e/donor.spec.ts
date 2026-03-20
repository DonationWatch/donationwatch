import { expect } from "@playwright/test";

import { formatAnd } from "@/utils/formatter";

import { hash } from "../tasks/load-data/util";
import { DONOR_WITH_UBOs, DONOR_WITH_WIKIPEDIA_ARTICLE } from "../tests/config";
import { test } from "./util/fixture";

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

  test("shows UBOs if known", async ({
    page,
    donorPage,
    baseURL,
    accessibility,
    locale,
  }) => {
    await page.goto(`${baseURL}/germany/donor/${hash(DONOR_WITH_UBOs)}`);

    await expect(donorPage.uboText).toHaveText(
      formatAnd(locale, ["Fake UBO 1", "Fake UBO 2"]),
    );

    await test.step("is accessible", async () => {
      await accessibility.check();
    });
  });
});

import { expect } from "@playwright/test";

import { getPartiesSync } from "@/config/parties";
import { Country } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";

import { DONOR_WITH_WIKIPEDIA_ARTICLE } from "../tests/config";
import { test } from "./util/fixture";

test.describe("Search", () => {
  test("Search opens and filters entries", async ({
    page,
    search,
    baseURL,
    partyPage,
    accessibility,
  }) => {
    const countryConfig = await getCountryConfig(Country.germany);
    await page.goto(`${baseURL}/germany`);

    await expect(search.searchDialog.locator).toBeHidden();

    const dialog = search.searchDialog;

    await test.step("opening", async () => {
      await search.openSearchButton.click();

      await expect(dialog.locator).toBeAttached();
      await expect(dialog.partyResults).toHaveCount(
        getPartiesSync(countryConfig.id).length,
      );
      await expect(dialog.yearResults).toHaveCount(countryConfig.years.length);
      await expect(dialog.legislativeYearsResults).toHaveCount(
        countryConfig.legislativeYears?.length ?? 0,
      );
      await expect(dialog.donorResults).toHaveCount(15);

      await test.step("check a11y", async () => {
        await accessibility.check();
      });
    });

    await test.step("searching", async () => {
      await test.step("users", async () => {
        await dialog.input.fill("wiki");
        await expect(dialog.partyResults).toHaveCount(0);
        await expect(dialog.donorResults).toHaveCount(1);
        await expect(dialog.donorResults.first()).toHaveText(
          DONOR_WITH_WIKIPEDIA_ARTICLE,
        );
      });

      await test.step("parties", async () => {
        await dialog.input.fill("bas");
        await expect(dialog.partyResults).toHaveCount(1);
        await expect(dialog.donorResults).toHaveCount(0);

        await expect(dialog.partyResults.first()).toHaveText("Die BASIS");
        await expect(dialog.yearResults).toBeHidden();
        await expect(dialog.legislativeYearsResults).toBeHidden();

        await test.step("check a11y", async () => {
          await accessibility.check();
        });
      });
    });

    await dialog.partyResults.first().click();
    await expect(partyPage.partyName).toHaveText("Die BASIS");
  });
});

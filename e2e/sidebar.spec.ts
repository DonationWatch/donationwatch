import { expect } from "@playwright/test";

import { test } from "./util/fixture";

const tests: [name: string, viewport: { width: number; height: number }][] = [
  ["IPhone SE portrait", { width: 375, height: 667 }],
  ["IPhone SE landscape", { width: 667, height: 375 }],
];

tests.forEach(([name, viewport]) => {
  test.describe(`Mobile sidebar ${name}`, () => {
    test.use({ viewport });

    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(`${baseURL}/germany`);
    });

    test(`has working sidenav`, async ({ navigation, search }) => {
      await navigation.sidebar.expectOpen(false);

      await test.step("open sidebar", async () => {
        await navigation.sidebarTrigger.click();
        await navigation.sidebar.expectOpen(true);
      });

      await test.step("open search from sidebar", async () => {
        await navigation.sidebar.searchButton.click();
        await expect(search.searchDialog.locator).toBeVisible();
      });
    });
  });
});

test.describe(`Desktop sidebar`, () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/germany`);
  });

  test(`has working sidenav`, async ({
    navigation,
    page,
    baseURL,
    translations,
  }) => {
    await navigation.sidebar.expectOpen(true);

    await test.step("close sidebar", async () => {
      await navigation.sidebarTrigger.click();
      await navigation.sidebar.expectOpen(false);
    });

    await test.step("sidebar state is persisted", async () => {
      await page.reload();
      await navigation.sidebar.expectOpen(false);
    });

    await test.step("open sidebar again", async () => {
      await navigation.sidebarTrigger.click();
      await navigation.sidebar.expectOpen(true);
    });

    await test.step("changing country", async () => {
      const dropdown = await navigation.sidebar.countrySwitch.open();
      await dropdown.selectItemByName(translations("countries.AT"));
      expect(page.url()).toContain(`${baseURL}/austria`);
    });
  });
});

import { test } from "./util/fixture";

test.describe("About page", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/about`);
  });

  test(`is accessible`, async ({ accessibility }) => {
    await accessibility.check();
  });
});

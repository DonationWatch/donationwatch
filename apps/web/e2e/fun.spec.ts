import { test } from "./util/fixture";

test.describe("Fun facts", () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/fun`);
  });

  test(`is accessible`, async ({ accessibility }) => {
    await accessibility.check();
  });
});

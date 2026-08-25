import { expect } from "@playwright/test";

import { test } from "./util/fixture";

test.describe("404 Not Found Handling", () => {
  test("returns HTTP 404 for malformed/unknown path under country", async ({
    country,
    page,
    baseURL,
  }) => {
    const response = await page.goto(`${baseURL}/${country}/foobar`);

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  test("returns HTTP 404 for unsupported out-of-range year", async ({
    country,
    page,
    baseURL,
  }) => {
    const response = await page.goto(`${baseURL}/${country}/1900`);

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  test("returns HTTP 404 for non-existent party", async ({
    country,
    page,
    baseURL,
  }) => {
    const response = await page.goto(
      `${baseURL}/${country}/party/non-existent-party-xyz`,
    );

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  test("returns HTTP 404 for donor route on country without donor feature", async ({
    page,
    baseURL,
  }) => {
    const response = await page.goto(
      `${baseURL}/france/donor/non-existent-donor-id-xyz`,
    );

    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });

  test("shows page not found for non-existent donor", async ({
    country,
    page,
    baseURL,
  }) => {
    await page.goto(`${baseURL}/${country}/donor/non-existent-donor-id-xyz`);

    await expect(page.getByRole("heading")).toHaveText("Page not found");
  });
});

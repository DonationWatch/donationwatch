import { defineConfig, devices } from "@playwright/test";

import { LOCALES } from "@/utils/locales";

const isCI = !!process.env.CI;
const BASE_URL = "http://localhost:3000";

const localeBrowsers = LOCALES.flatMap((locale) =>
  ["Desktop Chrome" /*"Desktop Firefox" /*, "Desktop Safari"*/].flatMap(
    (device) => ({
      name: `${device} ${locale}`,
      use: {
        ...devices[device],
        locale,
        baseURL: `${BASE_URL}/${locale}`,
      },
    }),
  ),
);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1, //isCI ? 1 : 4,

  // In CI we increase the timeout to 60s
  timeout: isCI ? 60 * 1000 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [["blob"], ["github"]]
    : [["html", { open: "never" }], ["list"]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    // in CI we only test the first locale to save time, locally we test all locales
    ...(isCI ? localeBrowsers.slice(0, 1) : localeBrowsers),

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: isCI
    ? {
        command: "pnpm run dev:turbo",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: !isCI,
        timeout: 120 * 1000,
      }
    : undefined,
});

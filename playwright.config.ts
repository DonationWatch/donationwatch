import { defineConfig, devices } from "@playwright/test";

import { DEFAULT_LOCALE } from "@/utils/locales";

const isCI = !!process.env.CI;
const BASE_URL = "http://localhost:3000";

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
  /* Opt out of parallel tests on CI, utilize CPU cores locally */
  workers: isCI ? 2 : undefined,

  // In CI we increase the timeout to 60s
  timeout: isCI ? 60 * 1000 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [["blob"], ["github"]]
    : [["html", { open: "never" }], ["list"]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `${BASE_URL}/${DEFAULT_LOCALE}`,
    locale: DEFAULT_LOCALE,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
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

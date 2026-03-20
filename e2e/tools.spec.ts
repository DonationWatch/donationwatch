import { expect } from "@playwright/test";

import { getCountryConfig } from "@/utils/data/get-country-config";

import { test } from "./util/fixture";

test.describe("Tools", () => {
  test.describe("Data export", () => {
    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(`${baseURL}/germany/tools/data`);
    });

    test(`has download buttons`, async ({ accessibility, tools }) => {
      await expect(tools.dataExport.downloadCSV).toBeEnabled();
      await expect(tools.dataExport.downloadJSON).toBeEnabled();

      await accessibility.check();
    });
  });

  test.describe("Bar chart race", () => {
    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(`${baseURL}/germany/tools/bar-chart-race`);
    });

    test(`persists filters in the url`, async ({
      page,
      accessibility,
      tools,
      country,
    }) => {
      const countryConfig = await getCountryConfig(country);

      const { barChartRaceTool } = tools;

      await expect(tools.barChartRaceTool.downloadVideoButton).toBeVisible();
      await accessibility.check();

      await test.step("Initial URL has default parameters", async () => {
        const url = new URL(page.url());
        expect(url.searchParams).toBeDefined();
      });

      await test.step("Clicking legislative year range updates URL", async (step) => {
        step.skip(
          !countryConfig.legislativeYears,
          "not all countries have legislative sessions",
        );

        await barChartRaceTool.legislativeYearButton("2018-2021").click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2018");
        expect(url.searchParams.get("to")).toBe("2021");
      });

      await test.step("Clicking individual year updates URL", async () => {
        await barChartRaceTool.individualYearButton(2020).click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2020");
        expect(url.searchParams.get("to")).toBe("2020");
      });

      await test.step("Clicking group by receiver updates URL", async () => {
        await barChartRaceTool.receiverButton.click();

        const url = new URL(page.url());
        expect(url.searchParams.get("groupBy")).toBe("receiver");
      });

      await test.step("Clicking group by donor updates URL", async () => {
        await barChartRaceTool.donorButton.click();

        const url = new URL(page.url());
        expect(url.searchParams.get("groupBy")).toBe(null);
      });

      await test.step("Clicking 30s animation duration updates URL", async () => {
        await barChartRaceTool.animationDurationButton("30s").click();

        const url = new URL(page.url());
        expect(url.searchParams.get("duration")).toBe("30000");
      });

      await test.step("Clicking 60s animation duration updates URL", async () => {
        await barChartRaceTool.animationDurationButton("60s").click();

        const url = new URL(page.url());
        expect(url.searchParams.get("duration")).toBe("60000");
      });

      await test.step("Clicking 10s animation duration updates URL to default", async () => {
        await barChartRaceTool.animationDurationButton("10s").click();

        const url = new URL(page.url());
        expect(url.searchParams.get("duration")).toBe(null);
      });

      await test.step("Clicking different individual year updates URL", async () => {
        await barChartRaceTool.individualYearButton(2023).click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2023");
        expect(url.searchParams.get("to")).toBe("2023");
      });

      await test.step("Opening advanced and selecting range updates URL", async () => {
        await barChartRaceTool.advancedSummary.click();

        await barChartRaceTool.fromYearDropdown.click();
        await barChartRaceTool.fromYearOption(2018).click();

        await barChartRaceTool.toYearDropdown.click();
        await barChartRaceTool.toYearOption(2021).click();

        const url = new URL(page.url());
        expect(url.searchParams.get("to")).toBe("2021");
      });
    });
  });

  test.describe("Compare parties", () => {
    test.beforeEach(async ({ page, baseURL }) => {
      await page.goto(`${baseURL}/germany/tools/compare`);
    });

    test(`it works`, async ({ page, accessibility, tools, country }) => {
      const countryConfig = await getCountryConfig(country);
      const { comparePartiesTool } = tools;

      await expect(comparePartiesTool.legislativeYearsFieldset).toBeVisible();
      await accessibility.check();

      await test.step("Clicking legislative year range updates URL", async (step) => {
        step.skip(
          !countryConfig.legislativeYears,
          "not all countries have legislative sessions",
        );

        await comparePartiesTool.legislativeYearButton("2018-2021").click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2018");
        expect(url.searchParams.get("to")).toBe("2021");
      });

      await test.step("Clicking individual year updates URL", async () => {
        await comparePartiesTool.individualYearButton(2020).click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2020");
        expect(url.searchParams.get("to")).toBe("2020");
      });

      await test.step("Clicking different individual year updates URL", async () => {
        await comparePartiesTool.individualYearButton(2023).click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2023");
        expect(url.searchParams.get("to")).toBe("2023");
      });

      await test.step("Opening advanced and selecting range updates URL", async () => {
        await comparePartiesTool.advancedSummary.click();

        await comparePartiesTool.fromYearDropdown.click();
        await comparePartiesTool.fromYearOption(2018).click();

        await comparePartiesTool.toYearDropdown.click();
        await comparePartiesTool.toYearOption(2021).click();

        const url = new URL(page.url());
        expect(url.searchParams.get("from")).toBe("2018");
        expect(url.searchParams.get("to")).toBe("2021");
      });

      await test.step("pick parties to compare", async () => {
        await comparePartiesTool.partyButton("Volt").click();
        await expect(comparePartiesTool.overviewSection).toBeHidden();
        await comparePartiesTool.partyButton("SPD").click();
        await expect(comparePartiesTool.overviewSection).toBeVisible();
      });
    });
  });
});

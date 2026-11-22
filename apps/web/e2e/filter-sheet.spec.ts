import { expect } from "@playwright/test";

import { test } from "./util/fixture";

test.describe("Filter sheet year range comboboxes", () => {
  test("dynamically constrains from/to options based on selection", async ({
    page,
    baseURL,
    filterSheet,
  }) => {
    // 1. Goto a country page with a year range route
    await page.goto(`${baseURL}/unitedkingdom/2020-2024/overview`);

    // 2. Open the filter sheet using the page object
    await filterSheet.open();

    // 3. Verify the filter sheet title is visible
    await expect(filterSheet.title).toBeVisible();

    // 4. Verify initial input states
    await expect(filterSheet.fromInput).toHaveValue("2020");
    await expect(filterSheet.toInput).toHaveValue("2024");

    // 5. Click "From" input to check its available options (should be 2020-2024 since "To" is 2024)
    await filterSheet.fromInput.click();
    await expect(filterSheet.options).toHaveCount(5);
    await expect(filterSheet.options.nth(0)).toHaveText("2020");
    await expect(filterSheet.options.nth(4)).toHaveText("2024");

    // Close "From" dropdown
    await filterSheet.closePopup();

    // 6. Click "To" input and change it to "2022"
    await filterSheet.toInput.click();
    const option2022 = filterSheet.getOption("2022");
    await expect(option2022).toBeVisible();
    await option2022.click();

    // 7. Verify "To" input value is now "2022"
    await expect(filterSheet.toInput).toHaveValue("2022");

    // 8. Click "From" input again; options should now be limited to 2020-2022 (count should be 3)
    await filterSheet.fromInput.click();
    await expect(filterSheet.options).toHaveCount(3);
    await expect(filterSheet.options.nth(0)).toHaveText("2020");
    await expect(filterSheet.options.nth(2)).toHaveText("2022");

    // Select "2021" as the "From" year
    const option2021 = filterSheet.getOption("2021");
    await expect(option2021).toBeVisible();
    await option2021.click();

    // 9. Verify "From" input value is now "2021"
    await expect(filterSheet.fromInput).toHaveValue("2021");

    // 10. Click "To" input; options should now be limited to 2021-2024 (count should be 4)
    await filterSheet.toInput.click();
    await expect(filterSheet.options).toHaveCount(4);
    await expect(filterSheet.options.nth(0)).toHaveText("2021");
    await expect(filterSheet.options.nth(3)).toHaveText("2024");

    // Close list
    await filterSheet.closePopup();
  });

  test("singular year page has party section but no year section", async ({
    page,
    baseURL,
    filterSheet,
  }) => {
    // Navigate to a singular year page
    await page.goto(`${baseURL}/unitedkingdom/2023/overview`);

    // Open filter sheet
    await filterSheet.open();

    // Assert that the party section is visible
    await expect(filterSheet.partySectionHeading).toBeVisible();

    // Assert that the year section is hidden
    await expect(filterSheet.yearsSectionHeading).toBeHidden();
  });

  test("party page has year section but no party section", async ({
    page,
    baseURL,
    filterSheet,
    partyPage,
  }) => {
    // Navigate to a party page
    await page.goto(`${baseURL}/unitedkingdom/party/REFORM`);

    // Wait for the page to be loaded/hydrated
    await expect(partyPage.pageTitle).toBeVisible();

    // Open filter sheet
    await filterSheet.open();

    // Assert that the year section is visible
    await expect(filterSheet.yearsSectionHeading).toBeVisible();

    // Assert that the party section is hidden
    await expect(filterSheet.partySectionHeading).toBeHidden();
  });

  test("hides filter trigger on country root page", async ({
    page,
    baseURL,
    filterSheet,
  }) => {
    // Navigate to a country root page
    await page.goto(`${baseURL}/unitedkingdom`);

    // Assert that the filter trigger button is hidden
    await expect(filterSheet.triggerButton).toBeHidden();
  });

  test("deselecting all parties shows the empty state page", async ({
    page,
    baseURL,
    filterSheet,
    translations,
  }) => {
    // 1. Goto a country page with a year range route
    await page.goto(
      `${baseURL}/unitedkingdom/2020-2024/overview?parties=TORIES`,
    );

    // 2. Open the filter sheet
    await filterSheet.open();

    // 3. Uncheck all checkboxes in the party section
    await filterSheet.partySection.deselectAll();

    // 4. Close the filter sheet
    await filterSheet.close();

    // 5. Assert that the empty state "No donations found" is visible
    const emptyStateHeading = page.getByRole("heading", {
      name: translations("filter.empty.title"),
    });
    await expect(emptyStateHeading).toBeVisible();

    // 6. Click the "Reset Filters" button in the empty state
    await page
      .getByRole("button", {
        name: translations("filter.empty.reset"),
      })
      .click();

    // 7. Verify that the empty state is gone and overview content is shown again
    await expect(emptyStateHeading).toBeHidden();
  });
});

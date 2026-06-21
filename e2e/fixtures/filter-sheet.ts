import { PageObject } from "../util/page";
import { Collapsible } from "./components/collapsible";

export class FilterSheet extends PageObject {
  // Trigger button in the sticky footer
  public readonly triggerButton = this.page.getByLabel(
    this.translations("filter.title"),
  );

  // Sheet dialog container
  public readonly dialog = this.page.getByRole("dialog");

  // Title inside the sheet
  public readonly title = this.dialog.getByText(
    this.translations("filter.title"),
  );

  // Filter sections headings (rendered as Collapsible Trigger buttons)
  public readonly yearsSectionHeading = this.dialog.getByRole("button", {
    name: this.translations("filter.years.title"),
  });

  public readonly yearsSection = new Collapsible(
    this.dialog.getByRole("button", {
      name: this.translations("filter.years.title"),
    }),
    this.props,
  );

  public readonly partySectionHeading = this.dialog.getByRole("button", {
    name: this.translations("filter.parties"),
  });

  public readonly partySection = new Collapsible(
    this.dialog.getByRole("button", {
      name: this.translations("filter.parties"),
    }),
    this.props,
  );

  // Year range combobox inputs
  public readonly fromInput = this.dialog.locator("#fromYear");
  public readonly toInput = this.dialog.locator("#toYear");

  // Options rendered in popover portals
  public readonly options = this.page.getByRole("option");

  public getOption(name: string) {
    return this.page.getByRole("option", { name, exact: true });
  }

  // Opens the filter sheet
  public async open() {
    await this.triggerButton.click();
    await this.dialog.waitFor({ state: "visible" });
  }

  // Closes the filter sheet using the Close button
  public async close() {
    await this.dialog
      .getByRole("button", {
        name: this.props.translations("actions.close"),
      })
      .click();
    await this.dialog.waitFor({ state: "hidden" });
  }

  // Closes the open combobox dropdown by pressing Escape
  public async closePopup() {
    await this.page.keyboard.press("Escape");
  }
}

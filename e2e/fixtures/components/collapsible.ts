import { LocatorObject } from "e2e/util/locator";

export class Collapsible extends LocatorObject {
  private readonly button = this.locator;
  private readonly content = this.button.locator("..").locator("> div");

  public toggle() {
    this.button.click();
  }

  public async deselectAll() {
    const checkboxes = this.content.locator(
      '[role=checkbox][aria-checked="true"]',
    );

    for (const checkbox of await checkboxes.all()) {
      await checkbox.click();
    }
  }
}

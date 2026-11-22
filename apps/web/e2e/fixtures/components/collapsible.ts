import { LocatorObject } from "../../util/locator";

export class Collapsible extends LocatorObject {
  private readonly button = this.locator;
  private readonly content = this.button.locator("..").locator("> div");

  public async toggle() {
    await this.button.click();
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

import { expect } from "@playwright/test";

import { LocatorObject } from "../../util/locator";

class DropdownContent extends LocatorObject {
  public readonly items = this.locator.getByRole("menuitem");

  public async selectItemByName(name: string) {
    const item = this.items.filter({ hasText: name });
    await item.click();
  }
}

export class DropdownMenu extends LocatorObject {
  public async open() {
    await this.locator.click();

    const controlsId = await this.locator.getAttribute("aria-controls");
    const content = new DropdownContent(
      this.page.locator(`#${controlsId}`),
      this.props,
    );

    await expect(content.locator).toBeVisible();

    return content;
  }
}

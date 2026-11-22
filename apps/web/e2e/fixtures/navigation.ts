import { expect } from "@playwright/test";

import { LocatorObject } from "../util/locator";
import { PageObject } from "../util/page";
import { DropdownMenu } from "./components/dropdown";

class Sidebar extends LocatorObject {
  public readonly countrySwitch = new DropdownMenu(
    this.locator.locator("button[aria-haspopup='menu']"),
    this.props,
  );
  public readonly searchButton = this.locator.getByText(
    this.translations("search.filter"),
  );

  public async expectOpen(open = true) {
    if (open) {
      await expect(this.locator).toBeInViewport();
    } else {
      await expect(this.locator).not.toBeInViewport();
    }
  }
}

export class Navigation extends PageObject {
  public readonly sidebarTrigger = this.page.getByTitle(
    this.translations("sidebar.toggle"),
  );
  public readonly sidebar = new Sidebar(
    this.page.locator('[data-sidebar="sidebar"]'),
    this.props,
  );
}

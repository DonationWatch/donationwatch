import { expect } from "@playwright/test";

import { PageObject } from "../util/page";

export class Toasts extends PageObject {
  private readonly toasts = this.page.locator(".toast");

  public getToast(type: "success") {
    return this.page.locator(`.toast[data-type='${type}']`);
  }

  public async expectVisible(n: number) {
    await expect(this.toasts).toHaveCount(n);
  }
}

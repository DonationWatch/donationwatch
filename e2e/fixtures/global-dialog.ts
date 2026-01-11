import { LocatorObject } from "../util/locator";
import { PageObject } from "../util/page";

export class DialogLocator extends LocatorObject {
  public readonly closeButton = this.locator.getByRole("button", {
    name: this.translations.actions.close,
  });
  public readonly title = this.locator.getByRole("heading", { level: 2 });
}

export class GlobalDialog extends PageObject {}

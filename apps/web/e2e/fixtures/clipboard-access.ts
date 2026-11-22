import { PageObject } from "../util/page";

export class ClipboardAccess extends PageObject {
  public async register() {
    await this.props.context.grantPermissions([
      "clipboard-read",
      "clipboard-write",
    ]);
  }

  public async read(): Promise<string> {
    return this.page.evaluate(() => navigator.clipboard.readText());
  }
}

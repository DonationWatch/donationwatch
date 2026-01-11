import { PageObject } from "../util/page";

export class HistoryPage extends PageObject {
  public readonly tableRows = this.page.locator("table tbody tr");
}

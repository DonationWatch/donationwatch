import { PageObject } from "../util/page";
import { Table } from "./components/donation-history-table";

export class DonorPage extends PageObject {
  public readonly wikiQuote = this.page.getByTestId("wiki-quote");
  public readonly donorName = this.page.getByRole("heading", { level: 1 });
  public readonly changesTable = new Table(
    this.page.getByRole("table"),
    this.props,
  );
  public readonly pageTitle = this.page.locator("#sec-donor-overview");
}

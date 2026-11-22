import { PageObject } from "../util/page";
import { Chart } from "./components/chart";
import { Table } from "./components/donation-history-table";

export class DonorPage extends PageObject {
  public readonly wikiQuote = this.page.getByTestId("wiki-quote");
  public readonly donorName = this.page.getByRole("heading", { level: 1 });
  public readonly changesTable = new Table(
    this.page.getByRole("table"),
    this.props,
  );
  public readonly pageTitle = this.page.locator("#sec-donor-overview");
  public readonly uboText = this.page.locator(
    'section[aria-labelledby="ubo-heading"] p',
  );
  public readonly donationTypes = this.page.locator(
    'section[aria-labelledby="sec-donor-donation-types"]',
  );
  public readonly donationTypeSankey = new Chart(
    "sankey",
    this.donationTypes.getByTestId("chart"),
    this.props,
  );
}

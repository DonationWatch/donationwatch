import { PageObject } from "../util/page";
import { Chart } from "./components/chart";
import { RankingItem } from "./components/ranking-item";

export class DonorsPage extends PageObject {
  public readonly rankingItems = this.page
    .locator('[aria-labelledby="sec-donor-list"]')
    .getByTestId("ranking-item");
  public readonly pageTitle = this.page.getByRole("heading", {
    level: 1,
    name: this.translations("donors.title"),
  });
  public readonly histogramSection = this.page
    .locator('[aria-labelledby="sec-histogram"]')
    .describe("Histogram section");
  public readonly histogramChart = new Chart(
    "bar",
    this.histogramSection.getByTestId("chart"),
    this.props,
  );
  public readonly histogramRankingItems =
    this.histogramSection.getByTestId("ranking-item");
  public readonly donorList = this.page
    .locator('[aria-labelledby="sec-donor-list"]')
    .describe("Donor list");
  public readonly search = this.donorList.getByRole("searchbox");

  public getRankingItemByIndex(index: number) {
    return new RankingItem(this.rankingItems.nth(index), this.props);
  }
}

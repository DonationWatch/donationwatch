import { PageObject } from "../util/page";
import { Chart } from "./components/chart";
import { RankingItem } from "./components/ranking-item";
import { YearsHeader } from "./components/years-header";

export class OriginPage extends PageObject {
  public readonly yearsHeader = new YearsHeader(
    this.page.locator(".card", {
      has: this.page.getByRole("heading", {
        name: this.translations("years.title"),
        exact: true,
      }),
    }),
    this.props,
  );
  public readonly originMap = new Chart(
    "map",
    this.page.getByTestId("chart"),
    this.props,
  );
  public readonly stateRankingItems = this.page
    .locator('[aria-labelledby="sec-current-country"]')
    .getByTestId("ranking-item");
  public readonly countryRankingItems = this.page
    .locator('[aria-labelledby="sec-other-country"]')
    .getByTestId("ranking-item");

  public getStateRankingItemByIndex(index: number) {
    return new RankingItem(this.stateRankingItems.nth(index), this.props);
  }

  public getCountryRankingItemByIndex(index: number) {
    return new RankingItem(this.countryRankingItems.nth(index), this.props);
  }
}

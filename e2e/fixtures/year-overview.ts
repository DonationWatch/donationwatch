import { PageObject } from "../util/page";
import { RankingItem } from "./components/ranking-item";
import { YearsHeader } from "./components/years-header";

export class YearOverviewPage extends PageObject {
  public readonly yearsHeader = new YearsHeader(
    this.page.locator(".card", {
      has: this.page.getByRole("heading", {
        name: this.translations("years.title"),
        exact: true,
      }),
    }),
    this.props,
  );
  public readonly rankingItems = this.page.getByTestId("ranking-item");

  public getRankingItemByIndex(index: number) {
    return new RankingItem(this.rankingItems.nth(index), this.props);
  }
}

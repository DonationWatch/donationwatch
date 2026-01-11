import { LocatorObject } from "../util/locator";
import { PageObject } from "../util/page";

class SearchDialog extends LocatorObject {
  public readonly input = this.locator.getByRole("searchbox");
  public readonly partyResults = this.locator
    .getByRole("group", { name: this.translations.search.parties })
    .getByRole("treeitem");
  public readonly yearResults = this.locator
    .getByRole("group", { name: this.translations.search.years, exact: true })
    .getByRole("treeitem");
  public readonly legislativeYearsResults = this.locator
    .getByRole("group", {
      name: this.translations.search.legislative_years,
      exact: true,
    })
    .getByRole("treeitem");
  public readonly donorResults = this.locator
    .getByRole("group", {
      name: this.translations.search.donors,
      exact: true,
    })
    .getByRole("treeitem");
}

export class GlobalSearch extends PageObject {
  public readonly searchDialog = new SearchDialog(
    this.page.getByTestId("search-dialog"),
    this.props,
  );
  public readonly openSearchButton = this.page.getByRole("button", {
    name: this.translations.search.filter_description,
  });
}

import { PageObject } from "../util/page";
import { DonorTypeSection } from "./components/donor-type-section";
import { YearsHeader } from "./components/years-header";

export class PartyPage extends PageObject {
  public readonly yearsHeader = new YearsHeader(
    this.page.locator("section", {
      has: this.page.getByRole("heading", {
        name: this.translations.years.title,
        exact: true,
      }),
    }),
    this.props,
  );
  public readonly partyName = this.yearsHeader.locator.locator("h3");
  public readonly wikiQuote = this.yearsHeader.locator.locator("blockquote p");
  public readonly pageTitle = this.page.getByRole("heading", { level: 1 });
  public readonly donorTypeSection = new DonorTypeSection(
    this.page.getByRole("region", {
      name: this.translations.party.donor_types.title,
    }),
    this.props,
  );
}

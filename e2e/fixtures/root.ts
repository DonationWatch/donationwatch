import { PageObject } from "../util/page";

export class RootPage extends PageObject {
  public readonly heading = this.page.getByRole("heading", { level: 1 });

  public readonly detectedCountryIndicator =
    this.page.getByTestId("detected-country");

  public readonly countryLinks = this.page
    .getByLabel(this.translations("header.country_selection"))
    .locator("a");

  public readonly singleDonations = this.page.locator(
    "#sec-global-single-donations",
  );

  public readonly topDonors = this.page.locator("#sec-global-top-donors");
}

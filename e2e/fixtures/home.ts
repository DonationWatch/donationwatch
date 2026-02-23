import { PageObject } from "../util/page";
import { YearsHeader } from "./components/years-header";

export class HomePage extends PageObject {
  public readonly currentLegislativePeriod = new YearsHeader(
    this.page.locator(".card", {
      has: this.page.getByRole("heading", {
        name: this.translations("home.last_period"),
        exact: true,
      }),
    }),
    this.props,
  );
  public readonly mostRecentDonations = this.page.locator(".card", {
    has: this.page.getByRole("heading", {
      name: this.translations("home.most_recent"),
      exact: true,
    }),
  });
  public readonly partiesList = this.page.locator("section", {
    has: this.page.getByRole("heading", {
      name: this.translations("home.parties.title"),
      exact: true,
    }),
  });
  public readonly pastLegislativePeriods = this.page.locator("section", {
    has: this.page.getByRole("heading", {
      name: this.translations("home.list.title"),
      exact: true,
    }),
  });
  public readonly detectedCountryIndicator =
    this.page.getByTestId("detected-country");
  public readonly biggestDonations = this.page.getByTestId("biggest-donations");

  public async getPastLegislativeYearsHeader(): Promise<YearsHeader[]> {
    const periods = await this.pastLegislativePeriods.all();

    return periods.map((p) => new YearsHeader(p, this.props));
  }
}

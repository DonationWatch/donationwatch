import { PageObject } from "../util/page";
import { Chart } from "./components/chart";
import { YearsHeader } from "./components/years-header";

export class TimelinePage extends PageObject {
  public readonly yearsHeader = new YearsHeader(
    this.page.locator(".card", {
      has: this.page.getByRole("heading", {
        name: this.translations.years.title,
        exact: true,
      }),
    }),
    this.props,
  );
  public readonly timelineSection = this.page
    .locator('[aria-labelledby="sec-timeline"]')
    .describe("Years timeline section");
  public readonly perMonthSection = this.page
    .locator('[aria-labelledby="sec-per-month"]')
    .describe("Years per month section");
  public readonly perYearSection = this.page
    .locator('[aria-labelledby="sec-per-year"]')
    .describe("Years per year section");
  public readonly timelineChart = new Chart(
    "line",
    this.timelineSection.getByTestId("chart"),
    this.props,
  );
  public readonly monthChart = new Chart(
    "bar",
    this.perMonthSection.getByTestId("chart"),
    this.props,
  );
  public readonly yearChart = new Chart(
    "bar",
    this.perYearSection.getByTestId("chart"),
    this.props,
  );
}

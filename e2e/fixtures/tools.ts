import { LocatorObject } from "../util/locator";
import { PageObject } from "../util/page";

class DataExportTool extends LocatorObject {
  public downloadCSV = this.locator.getByText(
    this.translations("common.download_format", { format: "CSV" }),
  );
  public downloadJSON = this.locator.getByText(
    this.translations("common.download_format", { format: "JSON" }),
  );
}
class BarChartRaceTool extends LocatorObject {
  public get legislativeYearsFieldset() {
    return this.locator.locator("fieldset").filter({
      has: this.locator
        .page()
        .getByText(this.translations("search.legislative_years"), {
          exact: true,
        }),
    });
  }

  public get individualYearsFieldset() {
    return this.locator.locator("fieldset").filter({
      has: this.locator
        .page()
        .getByText(this.translations("bar_chart_race.individual_years"), {
          exact: true,
        }),
    });
  }

  public legislativeYearButton(range: string) {
    return this.legislativeYearsFieldset.getByRole("button", { name: range });
  }

  public individualYearButton(year: number) {
    return this.individualYearsFieldset.getByRole("button", {
      name: year.toString(),
    });
  }

  public get groupByFieldset() {
    return this.locator.locator("fieldset").filter({
      has: this.locator
        .page()
        .getByText(this.translations("bar_chart_race.group_by.label"), {
          exact: true,
        }),
    });
  }

  public get donorButton() {
    return this.groupByFieldset.getByRole("button", {
      name: this.translations("bar_chart_race.group_by.donor"),
    });
  }

  public get receiverButton() {
    return this.groupByFieldset.getByRole("button", {
      name: this.translations("bar_chart_race.group_by.receiver"),
    });
  }

  public get animationDurationFieldset() {
    return this.locator.locator("fieldset").filter({
      has: this.locator
        .page()
        .getByText(this.translations("bar_chart_race.animation_duration"), {
          exact: true,
        }),
    });
  }

  public animationDurationButton(duration: "10s" | "30s" | "60s") {
    return this.animationDurationFieldset.getByRole("button", {
      name: duration,
    });
  }

  public get advancedSection() {
    return this.locator.locator("details");
  }

  public get advancedSummary() {
    return this.advancedSection.locator("summary");
  }

  public get fromYearDropdown() {
    return this.advancedSection.getByLabel(
      this.translations("bar_chart_race.from"),
    );
  }

  public get toYearDropdown() {
    return this.advancedSection.getByLabel(
      this.translations("bar_chart_race.to"),
    );
  }

  public fromYearOption(year: number) {
    return this.locator.page().getByRole("menuitem", {
      name: year.toString(),
      exact: true,
    });
  }

  public toYearOption(year: number) {
    return this.locator.page().getByRole("menuitem", {
      name: year.toString(),
      exact: true,
    });
  }

  public get playButton() {
    return this.locator.getByRole("button", {
      name: this.translations("actions.play"),
    });
  }

  public get pauseButton() {
    return this.locator.getByRole("button", {
      name: this.translations("actions.pause"),
    });
  }

  public get restartButton() {
    return this.locator.getByRole("button", {
      name: this.translations("actions.restart"),
    });
  }

  public get downloadVideoButton() {
    return this.locator.getByRole("button", {
      name: this.translations("bar_chart_race.download_video"),
    });
  }
}

export class Tools extends PageObject {
  public readonly dataExport = new DataExportTool(
    this.page.getByRole("main"),
    this.props,
  );
  public readonly barChartRaceTool = new BarChartRaceTool(
    this.page.getByRole("main"),
    this.props,
  );
}

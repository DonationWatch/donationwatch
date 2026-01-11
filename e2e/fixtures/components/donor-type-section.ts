import { Chart } from "./chart";
import { LocatorObject } from "../../util/locator";

export class DonorTypeSection extends LocatorObject {
  public readonly treemap: Chart = new Chart(
    "treemap",
    this.locator.getByTestId("chart"),
    this.props,
  );
  public readonly typeList = this.locator.getByRole("list");
}

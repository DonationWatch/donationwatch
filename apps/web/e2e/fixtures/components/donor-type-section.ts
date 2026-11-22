import { LocatorObject } from "../../util/locator";
import { Chart } from "./chart";

export class DonorTypeSection extends LocatorObject {
  public readonly treemap: Chart = new Chart(
    "treemap",
    this.locator.getByTestId("chart"),
    this.props,
  );
  public readonly typeList = this.locator.getByRole("list");
}

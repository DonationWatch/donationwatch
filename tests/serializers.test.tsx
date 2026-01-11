import { expect, test } from "vitest";

import {
  deserializeYears,
  isSameYearRange,
  serializeYears,
} from "../src/utils/serializers";

test("deserializeYears", () => {
  (
    [
      ["2019", ["2019"]],
      ["2019-2020", ["2019", "2020"]],
      ["2019-2021", ["2019", "2020", "2021"]],
      ["aaa", []],
      ["aaa-bbb", []],
      ["2019-bbb", []],
    ] as [string, string[]][]
  ).forEach(([years, expected]) => {
    expect(deserializeYears(years)).toEqual(expected);
  });
});

test("yearsPathParam", () => {
  (
    [
      [["2019"], "2019"],
      [["2019", "2020"], "2019-2020"],
      [["2019", "2020", "2021"], "2019-2021"],
    ] as [string[], string][]
  ).forEach(([years, expected]) => {
    expect(serializeYears(years)).toEqual(expected);
  });
});

test("isSameYearRange", () => {
  (
    [
      ["2019", false],
      ["2019-2019", true],
      ["2019-2020", false],
      ["2019-2020-2021", false],
    ] as [string, boolean][]
  ).forEach(([years, expected]) => {
    expect(isSameYearRange(years), years).toEqual(expected);
  });
});

import { expect, test, describe } from "vitest";

import { currencyConversion } from "../tasks/load-data/hr/hr-loader";

describe("currencyConversion", () => {
  test("it doesn't convert entries after 2024", () => {
    const tests: [
      [year: string, date: string, amount: number],
      expected: number,
    ][] = [
      [["2024", "2024-01-01", 1000], 1000],
      [["2024", "2024-12-31", 1000], 1000],
      [["2024", "2025-01-01", 1000], 1000],
    ];

    tests.forEach(([[year, date, amount], expected]) => {
      expect(currencyConversion(year, date, amount)).toBeCloseTo(expected);
    });
  });

  test("it convert entries before 2024", () => {
    const tests: [
      [year: string, date: string, amount: number],
      expected: number,
    ][] = [
      [["2019", "2019-01-01", 1000], 134.0],
      [["2019", "2019-07-01", 1000], 134.1],
      [["2020", "2020-01-01", 1000], 133.5],
      [["2020", "2020-07-01", 1000], 133.8],
      [["2021", "2021-01-01", 1000], 133.2],
      [["2021", "2021-07-01", 1000], 133.4],
      [["2022", "2022-01-01", 1000], 132.9],
      [["2022", "2022-07-01", 1000], 132.7],
      [["2023", "2023-01-01", 1000], 132.6],
      [["2023", "2023-07-01", 1000], 132.8],
    ];

    tests.forEach(([[year, date, amount], expected]) => {
      expect(currencyConversion(year, date, amount)).toBeCloseTo(expected);
    });
  });
});

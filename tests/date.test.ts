import { expect, test, describe } from "vitest";

import { adjustDays } from "../src/utils/date";

import type { IsoDate } from "../src/utils/types";

describe("adjustDays", () => {
  test(`works`, async () => {
    const tests: [given: IsoDate, delta: number, expected: IsoDate][] = [
      ["2020-01-01", -1, "2019-12-31"],
      ["2020-01-01", +1, "2020-01-02"],
      ["2020-01-31", +1, "2020-02-01"],
    ];

    tests.forEach(([given, delta, expected]) => {
      expect(adjustDays(given, delta)).toEqual(expected);
    });
  });
});

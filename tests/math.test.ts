import { expect, test } from "vitest";

import { numbersAvg, numbersMedian, numbersSum } from "../src/utils/math";

type NumbersTest = [number[], number];

test("numbersSum", () => {
  (
    [
      [[1, 2, 3, 4], 10],
      [[], 0],
      [[0], 0],
    ] as NumbersTest[]
  ).forEach(([given, expected]) => {
    expect(numbersSum(given)).toEqual(expected);
  });
});

test("numbersAvg", () => {
  (
    [
      [[1, 2, 3, 4], 2.5],
      [[], 0],
      [[0], 0],
    ] as NumbersTest[]
  ).forEach(([given, expected]) => {
    expect(numbersAvg(given)).toEqual(expected);
  });
});

test("numbersMedian", () => {
  (
    [
      [[1, 2, 3, 4], 2.5],
      [[1, 2, 3], 2],
      [[], 0],
      [[0], 0],
    ] as NumbersTest[]
  ).forEach(([given, expected]) => {
    expect(numbersMedian(given)).toEqual(expected);
  });
});

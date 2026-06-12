import type { PartyYearsSums } from "./loader/party-years-sums";

import { PartyStatField } from "./loader/party-years-sums";

export const numbersSum = (numbers: number[]): number =>
  numbers.reduce((sum, value) => sum + value, 0);

export const numbersMedian = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;

  const mid = Math.floor(numbers.length / 2);
  const nums = numbers.toSorted((a, b) => a - b);

  return numbers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

export const numbersAvg = (
  numbers: number[],
  length: number = numbers.length,
): number => {
  if (length === 0) return 0;

  return numbersSum(numbers) / length;
};

export const sumPartySums = (sums: PartyYearsSums) => {
  let sum = 0;

  Object.values(sums ?? {}).forEach((yearSums) => {
    Object.values(yearSums).forEach((partySums) => {
      sum += partySums[PartyStatField.Sum];
    });
  });

  return sum;
};

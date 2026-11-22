export const isNotNullandNotUndefined = <T>(
  value: null | undefined | T,
): value is T => {
  return value !== null && value !== undefined;
};

export type NonEmptyArray<T> = [T, ...T[]];

export const firstItem = <T>(array: NonEmptyArray<T>): T => {
  return array[0];
};

export const lastItem = <T>(array: NonEmptyArray<T>): T => {
  return array[array.length - 1];
};

export function assertNonEmptyArray<T>(
  arr: T[],
): asserts arr is NonEmptyArray<T> {
  if (arr.length === 0) {
    throw new Error("Assertion failed: The array is empty.");
  }
}

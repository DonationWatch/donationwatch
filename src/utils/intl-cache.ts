/* eslint-disable @typescript-eslint/no-explicit-any */
type FactoryFunction<T> = (...args: any[]) => T;

export const createIntlCache = <T>(factory: FactoryFunction<T>) => {
  const cache: Record<string, T> = {};

  return (...args: any[]) => {
    const cacheKey = args.join("-");

    let formatter = cache[cacheKey];
    if (!formatter) {
      formatter = factory(...args);
      cache[cacheKey] = formatter;
    }

    return formatter;
  };
};

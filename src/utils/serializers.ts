import type { CountryConfig } from "./countries";

const YEAR_DELIMITER = "-";

export const isSameYearRange = (years: string = ""): boolean => {
  const yearsSplit = (years ?? "").split(YEAR_DELIMITER);

  if (!(yearsSplit.length > 1)) return false;

  return yearsSplit.at(0) === yearsSplit.at(1);
};

export const hasKnownYearRange = (
  years: string[],
  country: CountryConfig,
): boolean => {
  const yearsSet = new Set(years);

  return country.years.some((year) => yearsSet.has(year));
};

export const deserializeYears = (years: string = ""): string[] => {
  const yearsSplit = (years ?? "").split(YEAR_DELIMITER);

  if (yearsSplit.length !== 2) {
    const maybeFirstYear = parseInt(yearsSplit.at(0) ?? "", 10);
    if (Number.isNaN(maybeFirstYear)) return [];

    return [`${maybeFirstYear}`];
  }

  const from = parseInt(yearsSplit.at(0) ?? "", 10);
  const to = parseInt(yearsSplit.at(-1) ?? "", 10);

  if (Number.isNaN(from)) return [];
  if (Number.isNaN(to)) return [];

  const deserializedYears: string[] = [];

  for (let i = from; i <= to; i++) {
    // if (!knownYears.has(`${i}`)) continue;

    deserializedYears.push(`${i}`);
  }

  return deserializedYears;
};

export const serializeYears = (years: string[]) => {
  const first = years.at(0);
  const last = years.at(-1);

  if (first === last) return `${first}`;

  return [first, last].filter(Boolean).join(YEAR_DELIMITER);
};

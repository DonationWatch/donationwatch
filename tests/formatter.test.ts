import { expect, test } from "vitest";

import type { BrowserBasedLocale } from "@/utils/locales";

import { makeBrand } from "@/utils/brand";
import { Country } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { dateDiffInDays } from "@/utils/date";
import {
  formatCountryCurrency,
  formatDate,
  formatPercentFormat,
  formatRelativeDate,
  formatTwoDigitDate,
  formatYearsRange,
} from "@/utils/formatter";

// Static locales branded as BrowserBasedLocale for unit testing formatters.
const EN = makeBrand<BrowserBasedLocale>("en");
const DE = makeBrand<BrowserBasedLocale>("de");

test("format EUR", async () => {
  const countryConfig = await getCountryConfig(Country.germany);

  expect(formatCountryCurrency(EN, 0, countryConfig)).toBe("€0.00");
  expect(formatCountryCurrency(EN, 100, countryConfig)).toBe("€100.00");

  expect(formatCountryCurrency(DE, 1, countryConfig)).toBe("1,00 €");
  expect(formatCountryCurrency(DE, 200, countryConfig)).toBe("200,00 €");
});

test("format CHF", async () => {
  const countryConfig = await getCountryConfig(Country.switzerland);

  expect(formatCountryCurrency(EN, 0, countryConfig)).toBe("CHF 0.00");
  expect(formatCountryCurrency(EN, 100, countryConfig)).toBe("CHF 100.00");

  expect(formatCountryCurrency(DE, 1, countryConfig)).toBe("1,00 CHF");
  expect(formatCountryCurrency(DE, 200, countryConfig)).toBe("200,00 CHF");
});

test("formatDate", () => {
  const date1 = new Date("2023-11-15T08:31:57.418Z");
  const date2 = new Date("2023-11-11T08:31:57.418Z").getTime();

  expect(formatDate(EN, date1)).toBe("November 15, 2023");
  expect(formatDate(EN, date2)).toBe("November 11, 2023");

  expect(formatDate(DE, date1)).toBe("15. November 2023");
  expect(formatDate(DE, date2)).toBe("11. November 2023");
});

test("formatTwoDigitDate", () => {
  const date1 = new Date("2023-11-15T08:31:57.418Z");
  const date2 = new Date("2023-11-11T08:31:57.418Z").getTime();

  expect(formatTwoDigitDate(EN, date1)).toBe("11/15/23");
  expect(formatTwoDigitDate(EN, date2)).toBe("11/11/23");

  expect(formatTwoDigitDate(DE, date1)).toBe("15.11.23");
  expect(formatTwoDigitDate(DE, date2)).toBe("11.11.23");
});

test("formatRelativeDate", () => {
  const date1 = new Date("2023-11-15T08:31:57.418Z");
  const date2 = new Date("2023-11-11T08:31:57.418Z");
  const diff = dateDiffInDays(date1, date2);

  expect(formatRelativeDate(EN, diff, "days")).toBe("4 days ago");

  expect(formatRelativeDate(DE, diff, "days")).toBe("vor 4 Tagen");
});

test("formatRelativeDate today", () => {
  const date1 = new Date("2023-11-15T08:31:57.418Z");
  const date2 = new Date("2023-11-15T12:31:57.418Z");
  const diff = dateDiffInDays(date1, date2);

  expect(formatRelativeDate(EN, diff, "days")).toBe("");
  expect(formatRelativeDate(DE, diff, "days")).toBe("");
});

test("formatPercentFormat", () => {
  expect(formatPercentFormat(EN, 0.5)).toBe("50%");
  expect(formatPercentFormat(EN, 0.25)).toBe("25%");

  expect(formatPercentFormat(DE, 0.5)).toBe("50 %");
  expect(formatPercentFormat(DE, 0.25)).toBe("25 %");
});

test("formatYearsRange", () => {
  expect(formatYearsRange([])).toBe("");
  expect(formatYearsRange(["2010"])).toBe("2010");
  expect(formatYearsRange(["2010", "2011"])).toBe("2010 - 2011");
  expect(formatYearsRange(["2010", "2011", "2012"])).toBe("2010 - 2012");
});

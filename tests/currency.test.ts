import { expect, test } from "vitest";

import {
  convertToEur,
  CURRENCY_RATES_DATE,
  CURRENCY_TO_EUR_RATES,
  getCurrencyRatesSummary,
} from "@/utils/currency";
import { getGlobalBiggestDonations } from "@/utils/loader/global-biggest-donations";

test("convertToEur converts currencies using defined rates", () => {
  expect(convertToEur(100, "EUR")).toBe(100);
  expect(convertToEur(100, "GBP")).toBeCloseTo(116.83);
  expect(convertToEur(1000, "CZK")).toBeCloseTo(41.162);
  expect(convertToEur(100, "AUD")).toBeCloseTo(61.721);
});

test("CURRENCY_RATES_DATE and summary are defined", () => {
  expect(CURRENCY_RATES_DATE).toBe("2026-09-15");
  expect(getCurrencyRatesSummary()).toContain("2026-09-15");
  expect(getCurrencyRatesSummary()).toContain("GBP");
});

test("CURRENCY_TO_EUR_RATES contains rates for all currencies", () => {
  expect(CURRENCY_TO_EUR_RATES.EUR).toBe(1);
  expect(CURRENCY_TO_EUR_RATES.GBP).toBeGreaterThan(1);
  expect(CURRENCY_TO_EUR_RATES.CHF).toBeGreaterThan(1);
  expect(CURRENCY_TO_EUR_RATES.AUD).toBeGreaterThan(0);
});

test("getGlobalBiggestDonations loads precomputed donations", async () => {
  const donations = await getGlobalBiggestDonations();
  expect(donations).toBeDefined();
  expect(donations.length).toBeGreaterThanOrEqual(1);
  expect(donations.length).toBeLessThanOrEqual(10);

  // Verify elements have required fields
  const first = donations[0];
  expect(first).toHaveProperty("id");
  expect(first).toHaveProperty("donor");
  expect(first).toHaveProperty("donorId");
  expect(first).toHaveProperty("country");
  expect(first).toHaveProperty("party");
  expect(first).toHaveProperty("amount");
  expect(first).toHaveProperty("currency");
  expect(first).toHaveProperty("amountInEur");
  expect(first).toHaveProperty("date");

  // Sorted descending by amountInEur
  for (let i = 1; i < donations.length; i++) {
    expect(donations[i - 1].amountInEur).toBeGreaterThanOrEqual(
      donations[i].amountInEur,
    );
  }
});

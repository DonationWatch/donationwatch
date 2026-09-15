import type { Currency } from "./countries";

// EUR per 1 unit of currency.
// Sources: ECB reference rates 2026-09-14 (inverted); RSD/GEL/UAH mid-market 2026-09-15.
// Captured 2026-09-15 — re-check before relying on these.
export const CURRENCY_TO_EUR_RATES: Record<Currency, number> = {
  EUR: 1,
  CHF: 1.0603, // EUR/CHF 0.9431
  GBP: 1.1683, // EUR/GBP 0.85598
  CZK: 0.041162, // EUR/CZK 24.294
  AUD: 0.61721, // EUR/AUD 1.6202
  RSD: 0.008521, // EUR/RSD ~117.36
  CAD: 0.6234, // EUR/CAD 1.6041
  GEL: 0.3322, // EUR/GEL ~3.01
  NOK: 0.092876, // EUR/NOK 10.767
  UAH: 0.019376, // EUR/UAH ~51.61
  SEK: 0.088645, // EUR/SEK 11.2810
  ZAR: 0.053278, // EUR/ZAR 18.7695
};

export const CURRENCY_RATES_DATE = "2026-09-15";

export const getCurrencyRatesSummary = (header?: string): string => {
  const title = header ?? `Exchange rates (as of ${CURRENCY_RATES_DATE}):`;
  const lines = Object.entries(CURRENCY_TO_EUR_RATES)
    .filter(([currency]) => currency !== "EUR")
    .map(([currency, rate]) => `1 ${currency} = ${rate} EUR`);
  return `${title}\n${lines.join("\n")}`;
};

export const convertToEur = (amount: number, currency: Currency): number => {
  const rate = CURRENCY_TO_EUR_RATES[currency] ?? 1;
  return amount * rate;
};

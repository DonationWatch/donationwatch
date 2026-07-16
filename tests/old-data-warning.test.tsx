import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";

import type { CountryConfig } from "@/types/country-config";

import { OldDataWarning, checkOldData } from "@/components/old-data-warning";
import { OLD_DATA_MONTHS_THRESHOLD } from "@/utils/config";

// Mock hooks completely without calling importOriginal to avoid "client-only" errors
vi.mock("@/hooks/use-browser-based-locale", () => {
  return {
    useBrowserBasedLocale: () => "en",
  };
});

vi.mock("@/hooks/use-client-translations", () => {
  return {
    useClientTranslations: (namespace: string) => {
      return (key: string, vars?: Record<string, string | number>) => {
        if (namespace === "old_data_warning") {
          if (key === "description") {
            return `The most recent donation recorded for ${vars?.country} in this dataset was on ${vars?.date} (published by ${vars?.source}). Due to publication delays, this view might not reflect more recent donations.`;
          }
        }
        return key;
      };
    },
  };
});

// Mock utils/countries by extending the original module
vi.mock("@/utils/countries", async (importOriginal) => {
  // oxlint-disable-next-line typescript/no-explicit-any
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    getCountryName: () => "Australia",
  };
});

describe("OldDataWarning date logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Freeze time on July 16, 2026
    vi.setSystemTime(new Date("2026-07-16T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should identify data as old if last donation is older than threshold", () => {
    // OLD_DATA_MONTHS_THRESHOLD months ago is old. Let's calculate a date older than it.
    const olderDate = new Date("2026-07-16T12:00:00Z");
    olderDate.setMonth(olderDate.getMonth() - (OLD_DATA_MONTHS_THRESHOLD + 2));
    const olderDateStr = olderDate.toISOString().slice(0, 10);

    const result = checkOldData(olderDateStr);
    expect(result.isOld).toBe(true);
    expect(result.lastDonationDate).toBe(olderDateStr);
  });

  test("should identify data as recent if last donation is within threshold", () => {
    // 1 month ago is not old (assuming threshold is >= 2 months)
    const result = checkOldData("2026-06-16");
    expect(result.isOld).toBe(false);
  });

  test("should handle year-only date format by treating it as Dec 31st of that year", () => {
    // Current date: July 2026.
    // Last donation: "2025" -> becomes Dec 31, 2025.
    // If threshold is 6 months, Dec 31, 2025 is ~6.5 months ago, so it is old.
    const result = checkOldData("2025");
    expect(result.isOld).toBe(true);

    // Last donation: "2026" -> Dec 31, 2026 (future relative to current time), so not old
    const resultFuture = checkOldData("2026");
    expect(resultFuture.isOld).toBe(false);
  });

  test("should return isOld: false for missing or invalid dates", () => {
    expect(checkOldData(undefined).isOld).toBe(false);
    expect(checkOldData("invalid-date").isOld).toBe(false);
  });
});

describe("OldDataWarning Rendering", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-16T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockCountryConfig: CountryConfig = {
    id: "australia",
    name: "Australia",
    currency: "AUD",
    source: {
      name: "AEC",
      url: "https://www.aec.gov.au",
    },
    lastDonationDate: "2025-06-30",
    // oxlint-disable-next-line typescript/no-explicit-any
  } as any;

  test("renders warning banner if dataset is older than threshold", () => {
    const { container } = render(
      <OldDataWarning countryConfig={mockCountryConfig} />,
    );

    expect(container.innerHTML).toContain(
      "The most recent donation recorded for Australia in this dataset was on June 30, 2025 (published by AEC)",
    );
  });

  test("returns null and renders nothing if dataset is recent", () => {
    const recentConfig = {
      ...mockCountryConfig,
      lastDonationDate: "2026-06-30", // 16 days ago relative to fake time
    };

    const { container } = render(
      <OldDataWarning countryConfig={recentConfig} />,
    );

    expect(container.firstChild).toBeNull();
  });
});

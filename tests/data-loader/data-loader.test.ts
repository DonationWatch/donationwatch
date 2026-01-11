import fs from "fs/promises";

import { expect, test, beforeEach, afterEach, describe } from "vitest";

import { Country } from "../../src/utils/countries";
import { DataLoader } from "../../tasks/load-data/data-loader";

import type { CountryCode } from "../../src/utils/countries";
import type {
  ExtractedYearData,
  PartyConfig,
} from "../../tasks/load-data/data-loader";
import type { DonorMetaDefinition, ReceiverId } from "@/utils/types";

import { ANONYMIZED_DONOR_KEYWORD } from "@/utils/config";
import { AddressField, DonationField, DonorType } from "@/utils/types";

const TEST_PARTIES: Record<string, PartyConfig> = {
  "Party Alpha": {
    color: "#ff0000",
    code: "ALPHA",
    short: "PA",
    name: "Party Alpha",
  },
  "Party Beta": {
    color: "#0000ff",
    code: "BETA",
    short: "PB",
    name: "Party Beta",
  },
};

class TestDataLoader extends DataLoader {
  parties = TEST_PARTIES;
  donorMeta: DonorMetaDefinition = { donors: {} };

  cacheFile(_year: string): string {
    return `/tmp/test-cache-${_year}.json`;
  }

  async loadYearDataToCache(): Promise<void> {
    // no-op for testing
  }

  async extractYearData(): Promise<ExtractedYearData[]> {
    return [];
  }

  constructor() {
    super("DE" as CountryCode, Country.germany);
  }

  /**
   * Expose setting of anonymized donors for testing.
   */
  setAnonymizedDonors(donors: string[]) {
    this.anonymizedDonors = donors;
  }

  getAnonymizedDonors(): string[] {
    return this.anonymizedDonors;
  }

  getAnonymizedDonorsPath(): string {
    return this.anonymizedDonorsPath;
  }

  async testLoadAnonymizedDonors(): Promise<void> {
    return this.loadAnonymizedDonors();
  }
}

function createDonation(
  overrides: Partial<ExtractedYearData> = {},
): ExtractedYearData {
  return {
    idx: "0",
    [DonationField.Amount]: 50_000,
    [DonationField.DonorName]: "Test Donor",
    [DonationField.Date]: "2024-06-15",
    [DonationField.Receiver]: "Party Alpha" as ReceiverId,
    [DonationField.Address]: {
      [AddressField.Country]: "DE",
      [AddressField.State]: "BY",
    },
    ...overrides,
  };
}

let loader: TestDataLoader;

beforeEach(() => {
  loader = new TestDataLoader();
});

describe("data loader", () => {
  test("anonymization of donors via optional anonymized-donors.json works", () => {
    const donations: ExtractedYearData[] = [
      createDonation({
        idx: "1",
        [DonationField.DonorName]: "Secret Donor",
        [DonationField.Amount]: 100_000,
        [DonationField.Address]: {
          [AddressField.Country]: "DE",
          [AddressField.State]: "NW",
        },
      }),
      createDonation({
        idx: "2",
        [DonationField.DonorName]: "Public Donor",
        [DonationField.Amount]: 50_000,
      }),
      createDonation({
        idx: "3",
        [DonationField.DonorName]: "Another Secret Donor",
        [DonationField.Amount]: 75_000,
        [DonationField.Receiver]: "Party Beta" as ReceiverId,
      }),
    ];

    loader.setAnonymizedDonors(["Secret Donor", "Another Secret Donor"]);

    const result = loader.processYearData(donations);

    const anonymized = result.donations.filter(
      (d) => d[DonationField.DonorName] === ANONYMIZED_DONOR_KEYWORD,
    );
    const nonAnonymized = result.donations.filter(
      (d) => d[DonationField.DonorName] !== ANONYMIZED_DONOR_KEYWORD,
    );

    expect(anonymized).toHaveLength(2);
    expect(nonAnonymized).toHaveLength(1);
    expect(nonAnonymized[0][DonationField.DonorName]).toBe("Public Donor");

    // anonymized donors should have their type set and state removed
    for (const donation of anonymized) {
      expect(donation[DonationField.DonorType]).toBe(DonorType.AnonymizedDonor);
      expect(
        donation[DonationField.Address][AddressField.State],
      ).toBeUndefined();
    }
  });

  test("non-anonymized donors retain their state", () => {
    const donations: ExtractedYearData[] = [
      createDonation({
        idx: "1",
        [DonationField.DonorName]: "Normal Donor",
        [DonationField.Amount]: 50_000,
        [DonationField.Address]: {
          [AddressField.Country]: "DE",
          [AddressField.State]: "BY",
        },
      }),
    ];

    loader.setAnonymizedDonors([]);

    const result = loader.processYearData(donations);

    expect(result.donations).toHaveLength(1);
    expect(result.donations[0][DonationField.DonorName]).toBe("Normal Donor");
    expect(result.donations[0][DonationField.Address][AddressField.State]).toBe(
      "BY",
    );
    expect(result.donations[0][DonationField.DonorType]).toBeUndefined();
  });

  test("anonymization replaces all occurrences of same donor name", () => {
    const donations: ExtractedYearData[] = [
      createDonation({
        idx: "1",
        [DonationField.DonorName]: "Repeat Donor",
        [DonationField.Amount]: 40_000,
      }),
      createDonation({
        idx: "2",
        [DonationField.DonorName]: "Repeat Donor",
        [DonationField.Amount]: 60_000,
        [DonationField.Date]: "2024-07-01",
      }),
    ];

    loader.setAnonymizedDonors(["Repeat Donor"]);

    const result = loader.processYearData(donations);

    expect(result.donations).toHaveLength(2);
    for (const donation of result.donations) {
      expect(donation[DonationField.DonorName]).toBe(ANONYMIZED_DONOR_KEYWORD);
      expect(donation[DonationField.DonorType]).toBe(DonorType.AnonymizedDonor);
    }
  });

  test("processYearData generates correct party data", () => {
    const donations: ExtractedYearData[] = [
      createDonation({
        idx: "1",
        [DonationField.DonorName]: "Donor A",
        [DonationField.Amount]: 100_000,
        [DonationField.Receiver]: "Party Alpha" as ReceiverId,
      }),
      createDonation({
        idx: "2",
        [DonationField.DonorName]: "Donor B",
        [DonationField.Amount]: 200_000,
        [DonationField.Receiver]: "Party Beta" as ReceiverId,
      }),
    ];

    const result = loader.processYearData(donations);

    expect(result.donationData.parties).toHaveLength(2);
    expect(result.donationData.parties[0].id).toBe("BETA");
    expect(result.donationData.parties[0].sum).toBe(200_000);
    expect(result.donationData.parties[1].id).toBe("ALPHA");
    expect(result.donationData.parties[1].sum).toBe(100_000);
  });

  test("processYearData assigns unique ids per donation", () => {
    const donations: ExtractedYearData[] = [
      createDonation({
        idx: "1",
        [DonationField.DonorName]: "Donor X",
        [DonationField.Amount]: 50_000,
      }),
      createDonation({
        idx: "2",
        [DonationField.DonorName]: "Donor Y",
        [DonationField.Amount]: 60_000,
      }),
      createDonation({
        idx: "3",
        [DonationField.DonorName]: "Donor Z",
        [DonationField.Amount]: 70_000,
      }),
    ];

    const result = loader.processYearData(donations);

    const ids = result.donations.map((d) => d[DonationField.Id]);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  describe("anonymized-donors.json file loading", () => {
    let tempFilePath: string;
    let fileCreated = false;

    afterEach(async () => {
      if (fileCreated) {
        await fs.unlink(tempFilePath).catch(() => {});
        fileCreated = false;
      }
    });

    test("loads anonymized donors from config file when it exists", async () => {
      tempFilePath = loader.getAnonymizedDonorsPath();
      const expectedDonors = ["Donor One", "Donor Two", "Donor Three"];

      await fs.writeFile(tempFilePath, JSON.stringify(expectedDonors), "utf-8");
      fileCreated = true;

      await loader.testLoadAnonymizedDonors();

      expect(loader.getAnonymizedDonors()).toEqual(expectedDonors);
    });

    test("defaults to empty list when config file does not exist", async () => {
      // Pre-set some donors to confirm they get cleared
      loader.setAnonymizedDonors(["Should Be Cleared"]);

      await loader.testLoadAnonymizedDonors();

      expect(loader.getAnonymizedDonors()).toEqual([]);
    });
  });
});

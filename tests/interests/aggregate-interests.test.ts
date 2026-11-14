import { describe, expect, it } from "vitest";

import type { DonorInterestMap } from "@/types/interests";
import type { Countries } from "@/utils/countries";
import type { Donation, ReceiverId } from "@/utils/types";

import {
  AttributionRole,
  PolicyMacroDomain,
  PolicyInterestTag,
} from "@/types/interests";
import {
  aggregateDonationInterests,
  aggregateInterestUnion,
  aggregateMacroDomainStats,
  aggregateSingleTagStats,
  getActiveMacroDomainStats,
  getActiveTagStats,
  groupTagStatsByMacroDomain,
} from "@/utils/interests/aggregate-interests";
import { AddressField, DonationField } from "@/utils/types";

// Helper to construct test donations
const createDonation = (
  donorName: string,
  amount: number,
  id = `don-${Math.random()}`,
): Donation => ({
  [DonationField.Id]: id,
  [DonationField.Amount]: amount,
  [DonationField.DonorName]: donorName,
  [DonationField.Date]: "2024-01-01",
  [DonationField.Address]: {
    [AddressField.Country]: "australia" as Countries,
  },
  [DonationField.Receiver]: "ALP" as ReceiverId,
});

describe("aggregate-interests (24-Tag International Taxonomy & Set-Union Logic)", () => {
  const testInterestMap: DonorInterestMap = {
    // Multi-sector peak body with multiple partial interests
    "Australian Hotels Association": [
      { tag: PolicyInterestTag.HospitalityTourism, role: AttributionRole.core },
      {
        tag: PolicyInterestTag.GamblingWagering,
        role: AttributionRole.partial,
      },
      {
        tag: PolicyInterestTag.AlcoholBeverages,
        role: AttributionRole.partial,
      },
    ],
    // Pure core gambling operator
    Tabcorp: [
      { tag: PolicyInterestTag.GamblingWagering, role: AttributionRole.core },
      {
        tag: PolicyInterestTag.HospitalityTourism,
        role: AttributionRole.partial,
      },
    ],
    // Core mining company
    "Mineralogy Pty Ltd": [
      { tag: PolicyInterestTag.MiningMetals, role: AttributionRole.core },
    ],
    // Core banking operator
    "Commonwealth Bank of Australia": [
      { tag: PolicyInterestTag.BankingLending, role: AttributionRole.core },
    ],
    // Multi-tag partial only
    "Multi Sector Group": [
      {
        tag: PolicyInterestTag.GamblingWagering,
        role: AttributionRole.partial,
      },
      {
        tag: PolicyInterestTag.AlcoholBeverages,
        role: AttributionRole.partial,
      },
    ],
  };

  it("calculates single tag stats with metadata, core, partial, and exposure sums", () => {
    const donations: Donation[] = [
      createDonation("Australian Hotels Association", 100_000), // Hospitality: core, Gambling: partial, Alcohol: partial
      createDonation("Tabcorp", 50_000), // Gambling: core, Hospitality: partial
      createDonation("Mineralogy Pty Ltd", 300_000), // Mining: core
      createDonation("Independent Citizen", 50_000), // Untagged
    ];

    const totalPartyDonations = 500_000;

    // Test GamblingWagering Tag
    const gamblingStats = aggregateSingleTagStats(
      PolicyInterestTag.GamblingWagering,
      donations,
      testInterestMap,
      totalPartyDonations,
    );

    // Tabcorp is core ($50,000), AHA is partial ($100,000)
    expect(gamblingStats.coreAmount).toBe(50_000);
    expect(gamblingStats.partialAmount).toBe(100_000);
    expect(gamblingStats.totalExposureAmount).toBe(150_000);
    expect(gamblingStats.uniqueDonorsCount).toBe(2);
    expect(gamblingStats.macroDomain).toBe(PolicyMacroDomain.RegulatedConsumer);
    expect(gamblingStats.macroDomainLabel).toBe("Regulated Consumer");
    expect(gamblingStats.color).toBe("#be123c");

    // Share of total party donations = 150,000 / 500,000 = 0.30 (30%)
    expect(gamblingStats.shareOfTotalPartyDonations).toBeCloseTo(0.3);
    // Core share of total party donations = 50,000 / 500,000 = 0.10 (10%)
    expect(gamblingStats.coreShareOfTotalPartyDonations).toBeCloseTo(0.1);
  });

  it("ensures shareOfTotalPartyDonations divides strictly by deduplicated party total, never sum of tag totals", () => {
    // When AHA gives 100k, it appears in HospitalityTourism, GamblingWagering, and AlcoholBeverages.
    // Naive sum of categories would be 100k + 100k + 100k = 300k.
    // But party received only 100k!
    const donations: Donation[] = [
      createDonation("Australian Hotels Association", 100_000),
    ];

    const result = aggregateDonationInterests(donations, testInterestMap);

    expect(result.totalPartyDonations).toBe(100_000);

    const gambling = result.tagStats.find(
      (t) => t.tag === PolicyInterestTag.GamblingWagering,
    )!;
    const hospitality = result.tagStats.find(
      (t) => t.tag === PolicyInterestTag.HospitalityTourism,
    )!;
    const alcohol = result.tagStats.find(
      (t) => t.tag === PolicyInterestTag.AlcoholBeverages,
    )!;

    expect(gambling.totalExposureAmount).toBe(100_000);
    expect(hospitality.totalExposureAmount).toBe(100_000);
    expect(alcohol.totalExposureAmount).toBe(100_000);

    // Each individual category share is 100% of the party total, NOT 33.3%
    expect(gambling.shareOfTotalPartyDonations).toBe(1.0);
    expect(hospitality.shareOfTotalPartyDonations).toBe(1.0);
    expect(alcohol.shareOfTotalPartyDonations).toBe(1.0);
  });

  it("deduplicates multi-tag donors when multiple tags are selected simultaneously (Set-Union)", () => {
    // Donor tagged with both gambling and alcohol (AHA)
    const donations: Donation[] = [
      createDonation("Australian Hotels Association", 100_000),
      createDonation("Other Donor", 100_000),
    ];

    const totalPartyDonations = 200_000;

    // Select both Gambling AND Alcohol
    const unionStats = aggregateInterestUnion(
      [PolicyInterestTag.GamblingWagering, PolicyInterestTag.AlcoholBeverages],
      donations,
      testInterestMap,
      totalPartyDonations,
    );

    // AHA is tagged with both Gambling and Alcohol.
    // In set-union, AHA MUST be counted exactly once: $100,000 total exposure, NOT $200,000!
    expect(unionStats.totalExposureAmount).toBe(100_000);
    expect(unionStats.partialAmount).toBe(100_000);
    expect(unionStats.coreAmount).toBe(0);
    expect(unionStats.matchedDonorsCount).toBe(1);
    expect(unionStats.shareOfTotalPartyDonations).toBeCloseTo(0.5); // 100k / 200k = 50%
  });

  it("classifies multi-tag union match as 'core' if donor has 'core' in at least one selected tag", () => {
    // AHA has: hospitality (core), gambling (partial), alcohol (partial)
    const donations: Donation[] = [
      createDonation("Australian Hotels Association", 100_000),
    ];

    const totalPartyDonations = 100_000;

    // 1. Union of Gambling and Alcohol: AHA has only partial in both -> partial
    const partialUnion = aggregateInterestUnion(
      [PolicyInterestTag.GamblingWagering, PolicyInterestTag.AlcoholBeverages],
      donations,
      testInterestMap,
      totalPartyDonations,
    );
    expect(partialUnion.coreAmount).toBe(0);
    expect(partialUnion.partialAmount).toBe(100_000);
    expect(partialUnion.totalExposureAmount).toBe(100_000);

    // 2. Union of Gambling and Hospitality: AHA is core in Hospitality -> promoted to 'core' in the union
    const coreUnion = aggregateInterestUnion(
      [
        PolicyInterestTag.GamblingWagering,
        PolicyInterestTag.HospitalityTourism,
      ],
      donations,
      testInterestMap,
      totalPartyDonations,
    );
    expect(coreUnion.coreAmount).toBe(100_000);
    expect(coreUnion.partialAmount).toBe(0);
    expect(coreUnion.totalExposureAmount).toBe(100_000);
  });

  it("handles complex mixed donor set across multiple macro-domains", () => {
    const donations: Donation[] = [
      createDonation("Australian Hotels Association", 100_000), // HospitalityTourism (core), GamblingWagering (partial), AlcoholBeverages (partial)
      createDonation("Tabcorp", 80_000), // GamblingWagering (core), HospitalityTourism (partial)
      createDonation("Mineralogy Pty Ltd", 200_000), // MiningMetals (core)
      createDonation("Commonwealth Bank of Australia", 150_000), // BankingLending (core)
      createDonation("Multi Sector Group", 20_000), // GamblingWagering (partial), AlcoholBeverages (partial)
      createDonation("Unrelated Donor", 100_000), // untagged
    ];

    const totalPartyDonations = 650_000;

    // Union of Gambling, Mining, and Banking across domains
    // - AHA: Gambling partial -> partial ($100k)
    // - Tabcorp: Gambling core -> core ($80k)
    // - Mineralogy: Mining core -> core ($200k)
    // - CBA: Banking core -> core ($150k)
    // - Multi Sector: Gambling partial -> partial ($20k)
    // Total core: 80k + 200k + 150k = 430k
    // Total partial: 100k + 20k = 120k
    // Total exposure: 550k (out of 650k = 84.6%)
    const unionStats = aggregateInterestUnion(
      [
        PolicyInterestTag.GamblingWagering,
        PolicyInterestTag.MiningMetals,
        PolicyInterestTag.BankingLending,
      ],
      donations,
      testInterestMap,
      totalPartyDonations,
    );

    expect(unionStats.coreAmount).toBe(430_000);
    expect(unionStats.partialAmount).toBe(120_000);
    expect(unionStats.totalExposureAmount).toBe(550_000);
    expect(unionStats.matchedDonorsCount).toBe(5);
    expect(unionStats.shareOfTotalPartyDonations).toBeCloseTo(550 / 650);
  });

  it("filters active tag stats and groups by macro-domain correctly", () => {
    const donations: Donation[] = [
      createDonation("Commonwealth Bank of Australia", 100_000),
      createDonation("Tabcorp", 50_000),
    ];

    const result = aggregateDonationInterests(donations, testInterestMap);
    expect(result.tagStats).toHaveLength(24);

    const activeExposure = getActiveTagStats(result.tagStats, "exposure");
    // Tabcorp is GamblingWagering (core) & HospitalityTourism (partial), CBA is BankingLending (core)
    expect(activeExposure.length).toBeGreaterThanOrEqual(2);
    expect(activeExposure[0].totalExposureAmount).toBeGreaterThanOrEqual(
      activeExposure[1].totalExposureAmount,
    );

    const activeCore = getActiveTagStats(result.tagStats, "core");
    // In core mode, HospitalityTourism has 0 core, so it should not appear in activeCore
    expect(
      activeCore.find((t) => t.tag === PolicyInterestTag.HospitalityTourism),
    ).toBeUndefined();

    const domainGroups = groupTagStatsByMacroDomain(activeExposure);
    expect(domainGroups.length).toBeGreaterThan(0);
    for (const group of domainGroups) {
      expect(group.domainLabel).toBeDefined();
      expect(group.totalExposureAmount).toBeGreaterThan(0);
    }
  });

  it("handles edge cases gracefully (empty list, zero total)", () => {
    const emptyResult = aggregateDonationInterests([], testInterestMap);
    expect(emptyResult.totalPartyDonations).toBe(0);
    expect(emptyResult.tagStats).toHaveLength(24);
    for (const tag of emptyResult.tagStats) {
      expect(tag.totalExposureAmount).toBe(0);
      expect(tag.shareOfTotalPartyDonations).toBe(0);
    }

    const emptyUnion = aggregateInterestUnion(
      [PolicyInterestTag.GamblingWagering],
      [],
      testInterestMap,
      0,
    );
    expect(emptyUnion.totalExposureAmount).toBe(0);
    expect(emptyUnion.shareOfTotalPartyDonations).toBe(0);
  });

  it("deduplicates donors within each macro-domain in aggregateMacroDomainStats", () => {
    // AHA has Hospitality (core), Gambling (partial), Alcohol (partial) — all in RegulatedConsumer.
    // Tabcorp has Gambling (core), Hospitality (partial) — also RegulatedConsumer.
    // Multi Sector Group has Gambling (partial), Alcohol (partial) — also RegulatedConsumer.
    const donations: Donation[] = [
      createDonation("Australian Hotels Association", 100_000),
      createDonation("Tabcorp", 50_000),
      createDonation("Multi Sector Group", 25_000),
      createDonation("Commonwealth Bank of Australia", 25_000),
    ];

    const totalPartyDonations = 200_000;
    const domainStats = aggregateMacroDomainStats(
      donations,
      testInterestMap,
      totalPartyDonations,
    );
    expect(domainStats).toHaveLength(6);

    const regulated = domainStats.find(
      (d) => d.domain === PolicyMacroDomain.RegulatedConsumer,
    );
    expect(regulated).toBeDefined();
    // Deduplicated: 100k + 50k + 25k = 175k (NOT summed across 3 tags)
    expect(regulated!.coreAmount).toBe(150_000);
    expect(regulated!.partialAmount).toBe(25_000);
    expect(regulated!.totalExposureAmount).toBe(175_000);
    expect(regulated!.uniqueDonorsCount).toBe(3);

    const active = getActiveMacroDomainStats(domainStats, "exposure");
    expect(active).toHaveLength(2);
    expect(active[0].domain).toBe(PolicyMacroDomain.RegulatedConsumer);
    expect(active[1].domain).toBe(PolicyMacroDomain.FinanceAdvisory);
  });
});

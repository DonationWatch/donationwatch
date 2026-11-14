import type {
  DonorInterestAttribution,
  DonorInterestMap,
  InterestAggregationResult,
  MacroDomainExposureStats,
  MultiTagUnionStats,
  PolicyInterestTag,
  PolicyMacroDomain,
  TagExposureStats,
} from "@/types/interests";
import type { Donation } from "@/utils/types";

import {
  ALL_POLICY_INTEREST_TAGS,
  ALL_POLICY_MACRO_DOMAINS,
  AttributionRole,
  POLICY_INTEREST_TAG_METADATA,
  POLICY_MACRO_DOMAIN_COLORS,
  POLICY_MACRO_DOMAIN_DESCRIPTIONS,
  POLICY_MACRO_DOMAIN_LABELS,
  POLICY_MACRO_DOMAIN_SLUGS,
} from "@/types/interests";
import { sha1Sync } from "@/utils/hash";
import { DonationField } from "@/utils/types";

/**
 * Expands a name-keyed donor interest map so every donor can also be looked up
 * by its SHA-1 donor ID hash.
 */
export const buildDonorInterestLookup = (
  byName: DonorInterestMap,
): DonorInterestMap => {
  const map: DonorInterestMap = {};
  for (const [name, attributions] of Object.entries(byName)) {
    map[name] = attributions;
    map[sha1Sync(name)] = attributions;
  }
  return map;
};

/**
 * Helper to retrieve interest attributions for a donor from the map,
 * checking by donor name or donor ID hash.
 */
export const getDonorInterests = (
  donorKey: string,
  interestMap: DonorInterestMap,
): DonorInterestAttribution[] => {
  return interestMap[donorKey] ?? [];
};

/**
 * Pure aggregation function for a single policy interest tag.
 *
 * For any single tag, returns:
 * - coreAmount: Sum of donations from donors with role === 'core' for that tag
 * - partialAmount: Sum of donations from donors with role === 'partial' for that tag
 * - totalExposureAmount: coreAmount + partialAmount
 * - shareOfTotalPartyDonations: Divided strictly by the deduplicated total donations received by the recipient
 */
export const aggregateSingleTagStats = (
  tag: PolicyInterestTag,
  donations: readonly Donation[],
  interestMap: DonorInterestMap,
  totalPartyDonations: number,
): TagExposureStats => {
  let coreAmount = 0;
  let partialAmount = 0;
  let coreCount = 0;
  let partialCount = 0;
  const uniqueDonors = new Set<string>();

  const meta = POLICY_INTEREST_TAG_METADATA[tag];

  for (const donation of donations) {
    const donorName = donation[DonationField.DonorName];
    const amount = donation[DonationField.Amount] || 0;
    const attributions = getDonorInterests(donorName, interestMap);

    const match = attributions.find((a) => a.tag === tag);
    if (!match) continue;

    uniqueDonors.add(donorName);
    if (match.role === AttributionRole.core) {
      coreAmount += amount;
      coreCount++;
    } else {
      partialAmount += amount;
      partialCount++;
    }
  }

  const totalExposureAmount = coreAmount + partialAmount;
  const shareOfTotalPartyDonations =
    totalPartyDonations > 0 ? totalExposureAmount / totalPartyDonations : 0;
  const coreShareOfTotalPartyDonations =
    totalPartyDonations > 0 ? coreAmount / totalPartyDonations : 0;

  return {
    tag,
    label: meta.label,
    slug: meta.slug,
    description: meta.description,
    macroDomain: meta.macroDomain,
    macroDomainLabel: meta.macroDomainLabel,
    color: meta.color,
    coreAmount,
    partialAmount,
    totalExposureAmount,
    coreCount,
    partialCount,
    uniqueDonorsCount: uniqueDonors.size,
    shareOfTotalPartyDonations,
    coreShareOfTotalPartyDonations,
  };
};

/**
 * Pure aggregation function that filters transactions by multiple tags simultaneously
 * using set-union logic.
 *
 * Deduplicates by transaction/donor so a multi-tag donor is counted once in the combined total.
 * If a donor has 'core' in at least one selected tag, classify the deduplicated match as 'core',
 * otherwise 'partial'.
 */
export const aggregateInterestUnion = (
  selectedTags: readonly PolicyInterestTag[],
  donations: readonly Donation[],
  interestMap: DonorInterestMap,
  totalPartyDonations: number,
): MultiTagUnionStats => {
  if (selectedTags.length === 0) {
    return {
      selectedTags: [],
      coreAmount: 0,
      partialAmount: 0,
      totalExposureAmount: 0,
      matchedDonorsCount: 0,
      shareOfTotalPartyDonations: 0,
      coreShareOfTotalPartyDonations: 0,
    };
  }

  const tagSet = new Set(selectedTags);
  let coreAmount = 0;
  let partialAmount = 0;
  const matchedDonors = new Set<string>();

  for (const donation of donations) {
    const donorName = donation[DonationField.DonorName];
    const amount = donation[DonationField.Amount] || 0;
    const attributions = getDonorInterests(donorName, interestMap);

    // Find all matching attributions among selected tags
    const matchingRoles: AttributionRole[] = [];
    for (const attr of attributions) {
      if (tagSet.has(attr.tag)) {
        matchingRoles.push(attr.role);
      }
    }

    if (matchingRoles.length === 0) {
      continue;
    }

    matchedDonors.add(donorName);

    // If a donor has 'core' in at least one selected tag, classify match as 'core'
    const isCore = matchingRoles.includes(AttributionRole.core);
    if (isCore) {
      coreAmount += amount;
    } else {
      partialAmount += amount;
    }
  }

  const totalExposureAmount = coreAmount + partialAmount;
  const shareOfTotalPartyDonations =
    totalPartyDonations > 0 ? totalExposureAmount / totalPartyDonations : 0;
  const coreShareOfTotalPartyDonations =
    totalPartyDonations > 0 ? coreAmount / totalPartyDonations : 0;

  return {
    selectedTags: [...selectedTags],
    coreAmount,
    partialAmount,
    totalExposureAmount,
    matchedDonorsCount: matchedDonors.size,
    shareOfTotalPartyDonations,
    coreShareOfTotalPartyDonations,
  };
};

/**
 * Filter and sort tag stats by active view mode amount descending.
 * Returns only tags with non-zero amounts so empty categories never clutter the UI.
 */
export const getActiveTagStats = (
  tagStats: readonly TagExposureStats[],
  viewMode: "exposure" | "core",
): TagExposureStats[] => {
  return tagStats
    .filter((t) =>
      viewMode === "exposure" ? t.totalExposureAmount > 0 : t.coreAmount > 0,
    )
    .sort((a, b) => {
      const valA =
        viewMode === "exposure" ? a.totalExposureAmount : a.coreAmount;
      const valB =
        viewMode === "exposure" ? b.totalExposureAmount : b.coreAmount;
      return valB - valA;
    });
};

export interface MacroDomainGroupStats {
  domain: PolicyMacroDomain;
  domainLabel: string;
  totalExposureAmount: number;
  coreAmount: number;
  tagStats: TagExposureStats[];
}

/**
 * Groups active tag stats by their high-level PolicyMacroDomain.
 */
export const groupTagStatsByMacroDomain = (
  tagStats: readonly TagExposureStats[],
): MacroDomainGroupStats[] => {
  const map = new Map<PolicyMacroDomain, MacroDomainGroupStats>();

  for (const stat of tagStats) {
    if (!map.has(stat.macroDomain)) {
      map.set(stat.macroDomain, {
        domain: stat.macroDomain,
        domainLabel: POLICY_MACRO_DOMAIN_LABELS[stat.macroDomain],
        totalExposureAmount: 0,
        coreAmount: 0,
        tagStats: [],
      });
    }
    const group = map.get(stat.macroDomain)!;
    group.totalExposureAmount += stat.totalExposureAmount;
    group.coreAmount += stat.coreAmount;
    group.tagStats.push(stat);
  }

  return Array.from(map.values()).sort(
    (a, b) => b.totalExposureAmount - a.totalExposureAmount,
  );
};

/**
 * Aggregates deduplicated donation stats for each of the 6 high-level PolicyMacroDomains
 * using set-union logic across each domain's member tags.
 */
export const aggregateMacroDomainStats = (
  donations: readonly Donation[],
  interestMap: DonorInterestMap,
  totalPartyDonations: number,
): MacroDomainExposureStats[] => {
  return ALL_POLICY_MACRO_DOMAINS.map((domain) => {
    const domainTags = ALL_POLICY_INTEREST_TAGS.filter(
      (tag) => POLICY_INTEREST_TAG_METADATA[tag].macroDomain === domain,
    );
    const union = aggregateInterestUnion(
      domainTags,
      donations,
      interestMap,
      totalPartyDonations,
    );

    return {
      domain,
      label: POLICY_MACRO_DOMAIN_LABELS[domain],
      slug: POLICY_MACRO_DOMAIN_SLUGS[domain],
      description: POLICY_MACRO_DOMAIN_DESCRIPTIONS[domain],
      color: POLICY_MACRO_DOMAIN_COLORS[domain],
      coreAmount: union.coreAmount,
      partialAmount: union.partialAmount,
      totalExposureAmount: union.totalExposureAmount,
      uniqueDonorsCount: union.matchedDonorsCount,
      shareOfTotalPartyDonations: union.shareOfTotalPartyDonations,
      coreShareOfTotalPartyDonations: union.coreShareOfTotalPartyDonations,
    };
  });
};

/**
 * Filter and sort macro-domain stats by active view mode amount descending.
 */
export const getActiveMacroDomainStats = (
  domainStats: readonly MacroDomainExposureStats[],
  viewMode: "exposure" | "core",
): MacroDomainExposureStats[] => {
  return domainStats
    .filter((d) =>
      viewMode === "exposure" ? d.totalExposureAmount > 0 : d.coreAmount > 0,
    )
    .sort((a, b) => {
      const valA =
        viewMode === "exposure" ? a.totalExposureAmount : a.coreAmount;
      const valB =
        viewMode === "exposure" ? b.totalExposureAmount : b.coreAmount;
      return valB - valA;
    });
};

/**
 * Main aggregation entry point: accepts a list of donations, interest lookup map,
 * and optional selected tags. Returns stats for all controlled interest tags and
 * optional multi-tag union stats.
 */
export const aggregateDonationInterests = (
  donations: readonly Donation[],
  interestMap: DonorInterestMap,
  selectedTags?: readonly PolicyInterestTag[],
): InterestAggregationResult => {
  const totalPartyDonations = donations.reduce(
    (sum, d) => sum + (d[DonationField.Amount] || 0),
    0,
  );

  const tagStats = ALL_POLICY_INTEREST_TAGS.map((tag) =>
    aggregateSingleTagStats(tag, donations, interestMap, totalPartyDonations),
  );

  const unionStats =
    selectedTags && selectedTags.length > 0
      ? aggregateInterestUnion(
          selectedTags,
          donations,
          interestMap,
          totalPartyDonations,
        )
      : undefined;

  return {
    totalPartyDonations,
    tagStats,
    unionStats,
  };
};

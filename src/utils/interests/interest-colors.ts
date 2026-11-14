import type { PolicyInterestTag, PolicyMacroDomain } from "@/types/interests";

import {
  POLICY_INTEREST_TAG_METADATA,
  POLICY_MACRO_DOMAIN_COLORS,
} from "@/types/interests";

export const UNTRACKED_DONOR_COLOR = "#52525b"; // Zinc 600

/**
 * Returns a deterministic, hierarchical color for any PolicyInterestTag.
 * Uses a Domain-Hue + Stepped-Shade palette so tags in the same Macro-Domain
 * share a recognizable color family while remaining distinct.
 */
export const interestColorFor = (tag: PolicyInterestTag): string => {
  return POLICY_INTEREST_TAG_METADATA[tag]?.color ?? UNTRACKED_DONOR_COLOR;
};

/**
 * Returns the representative color for a high-level PolicyMacroDomain.
 */
export const macroDomainColorFor = (domain: PolicyMacroDomain): string => {
  return POLICY_MACRO_DOMAIN_COLORS[domain] ?? UNTRACKED_DONOR_COLOR;
};

/**
 * Alias for backward compatibility with existing prototype imports
 */
export const policyInterestColor = interestColorFor;

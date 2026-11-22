/**
 * International Macro-Domains for policy interest & lobby group tracking.
 * Groups 24 granular policy interest tags into 6 overarching policy areas.
 */
export const enum PolicyMacroDomain {
  EnergyResources = 1,
  BuiltEnvironment = 2,
  FinanceAdvisory = 3,
  RegulatedConsumer = 4,
  HealthTechIndustry = 5,
  LaborAdvocacy = 6,
}

export const ALL_POLICY_MACRO_DOMAINS: PolicyMacroDomain[] = [
  PolicyMacroDomain.EnergyResources,
  PolicyMacroDomain.BuiltEnvironment,
  PolicyMacroDomain.FinanceAdvisory,
  PolicyMacroDomain.RegulatedConsumer,
  PolicyMacroDomain.HealthTechIndustry,
  PolicyMacroDomain.LaborAdvocacy,
];

export const POLICY_MACRO_DOMAIN_LABELS: Record<PolicyMacroDomain, string> = {
  [PolicyMacroDomain.EnergyResources]: "Energy & Resources",
  [PolicyMacroDomain.BuiltEnvironment]: "Built Environment",
  [PolicyMacroDomain.FinanceAdvisory]: "Finance & Advisory",
  [PolicyMacroDomain.RegulatedConsumer]: "Regulated Consumer",
  [PolicyMacroDomain.HealthTechIndustry]: "Health, Tech & Industry",
  [PolicyMacroDomain.LaborAdvocacy]: "Labor & Advocacy",
};

export const POLICY_MACRO_DOMAIN_SLUGS: Record<PolicyMacroDomain, string> = {
  [PolicyMacroDomain.EnergyResources]: "energy-resources",
  [PolicyMacroDomain.BuiltEnvironment]: "built-environment",
  [PolicyMacroDomain.FinanceAdvisory]: "finance-advisory",
  [PolicyMacroDomain.RegulatedConsumer]: "regulated-consumer",
  [PolicyMacroDomain.HealthTechIndustry]: "health-tech-industry",
  [PolicyMacroDomain.LaborAdvocacy]: "labor-advocacy",
};

export const POLICY_MACRO_DOMAIN_COLORS: Record<PolicyMacroDomain, string> = {
  [PolicyMacroDomain.EnergyResources]: "#d97706", // Amber 600
  [PolicyMacroDomain.BuiltEnvironment]: "#0f766e", // Teal 700
  [PolicyMacroDomain.FinanceAdvisory]: "#1d4ed8", // Blue 700
  [PolicyMacroDomain.RegulatedConsumer]: "#e11d48", // Rose 600
  [PolicyMacroDomain.HealthTechIndustry]: "#7e22ce", // Purple 700
  [PolicyMacroDomain.LaborAdvocacy]: "#047857", // Emerald 700
};

export const POLICY_MACRO_DOMAIN_DESCRIPTIONS: Record<
  PolicyMacroDomain,
  string
> = {
  [PolicyMacroDomain.EnergyResources]:
    "Fossil fuels, mining, renewables, agriculture, and forestry",
  [PolicyMacroDomain.BuiltEnvironment]:
    "Property development, construction, infrastructure, and transport",
  [PolicyMacroDomain.FinanceAdvisory]:
    "Banking, superannuation, insurance, consulting, legal, and fintech",
  [PolicyMacroDomain.RegulatedConsumer]:
    "Gambling, alcohol, tobacco, supermarkets, and hospitality",
  [PolicyMacroDomain.HealthTechIndustry]:
    "Pharma, private healthcare, tech, media, defense, and manufacturing",
  [PolicyMacroDomain.LaborAdvocacy]:
    "Trade unions, political fundraising trusts, and issue advocacy",
};

/**
 * 24 granular policy interest tags across 6 Macro-Domains.
 * Uses a numeric const enum (1 to 24) for compact transport serialization.
 */
export const enum PolicyInterestTag {
  // Domain 1: Energy & Resources
  FossilFuels = 1,
  MiningMetals = 2,
  RenewablesCleantech = 3,
  AgricultureForestry = 4,

  // Domain 2: Built Environment
  PropertyDevelopment = 5,
  ConstructionInfrastructure = 6,
  AviationTransport = 7,

  // Domain 3: Finance & Advisory
  BankingLending = 8,
  WealthSuperInsurance = 9,
  ConsultingAccountingLegal = 10,
  CryptoFintech = 11,

  // Domain 4: Regulated Consumer
  GamblingWagering = 12,
  AlcoholBeverages = 13,
  TobaccoNicotine = 14,
  FoodSupermarkets = 15,
  HospitalityTourism = 16,

  // Domain 5: Health, Tech & Industry
  PharmaBiotech = 17,
  PrivateHealthCare = 18,
  TechTelecomPlatforms = 19,
  MediaBroadcasting = 20,
  DefenseAerospace = 21,
  ManufacturingAutomotive = 22,

  // Domain 6: Labor & Advocacy
  TradeUnions = 23,
  IdeologicalIssueAdvocacy = 24,
}

export const ALL_POLICY_INTEREST_TAGS: PolicyInterestTag[] = [
  PolicyInterestTag.FossilFuels,
  PolicyInterestTag.MiningMetals,
  PolicyInterestTag.RenewablesCleantech,
  PolicyInterestTag.AgricultureForestry,
  PolicyInterestTag.PropertyDevelopment,
  PolicyInterestTag.ConstructionInfrastructure,
  PolicyInterestTag.AviationTransport,
  PolicyInterestTag.BankingLending,
  PolicyInterestTag.WealthSuperInsurance,
  PolicyInterestTag.ConsultingAccountingLegal,
  PolicyInterestTag.CryptoFintech,
  PolicyInterestTag.GamblingWagering,
  PolicyInterestTag.AlcoholBeverages,
  PolicyInterestTag.TobaccoNicotine,
  PolicyInterestTag.FoodSupermarkets,
  PolicyInterestTag.HospitalityTourism,
  PolicyInterestTag.PharmaBiotech,
  PolicyInterestTag.PrivateHealthCare,
  PolicyInterestTag.TechTelecomPlatforms,
  PolicyInterestTag.MediaBroadcasting,
  PolicyInterestTag.DefenseAerospace,
  PolicyInterestTag.ManufacturingAutomotive,
  PolicyInterestTag.TradeUnions,
  PolicyInterestTag.IdeologicalIssueAdvocacy,
];

export interface PolicyInterestTagMeta {
  tag: PolicyInterestTag;
  label: string;
  slug: string;
  description: string;
  macroDomain: PolicyMacroDomain;
  macroDomainLabel: string;
  color: string;
}

export const POLICY_INTEREST_TAG_METADATA: Record<
  PolicyInterestTag,
  PolicyInterestTagMeta
> = {
  // Domain 1: Energy & Resources (Amber/Yellow family)
  [PolicyInterestTag.FossilFuels]: {
    tag: PolicyInterestTag.FossilFuels,
    label: "Fossil Fuels & Thermal Power",
    slug: "fossil-fuels",
    description: "Coal, oil, gas extraction, and thermal power generation",
    macroDomain: PolicyMacroDomain.EnergyResources,
    macroDomainLabel: "Energy & Resources",
    color: "#b45309", // Amber 700
  },
  [PolicyInterestTag.MiningMetals]: {
    tag: PolicyInterestTag.MiningMetals,
    label: "Mining & Metals",
    slug: "mining-metals",
    description: "Iron ore, gold, lithium, and critical minerals extraction",
    macroDomain: PolicyMacroDomain.EnergyResources,
    macroDomainLabel: "Energy & Resources",
    color: "#d97706", // Amber 600
  },
  [PolicyInterestTag.RenewablesCleantech]: {
    tag: PolicyInterestTag.RenewablesCleantech,
    label: "Renewables & Clean Tech",
    slug: "renewables-cleantech",
    description: "Solar, wind, battery storage, and green hydrogen technology",
    macroDomain: PolicyMacroDomain.EnergyResources,
    macroDomainLabel: "Energy & Resources",
    color: "#eab308", // Yellow 500
  },
  [PolicyInterestTag.AgricultureForestry]: {
    tag: PolicyInterestTag.AgricultureForestry,
    label: "Agriculture & Forestry",
    slug: "agriculture-forestry",
    description: "Agribusiness, pastoral, livestock, timber, and water rights",
    macroDomain: PolicyMacroDomain.EnergyResources,
    macroDomainLabel: "Energy & Resources",
    color: "#ca8a04", // Yellow 600
  },

  // Domain 2: Built Environment (Teal/Cyan family)
  [PolicyInterestTag.PropertyDevelopment]: {
    tag: PolicyInterestTag.PropertyDevelopment,
    label: "Property Development",
    slug: "property-development",
    description: "Residential & commercial property developers and REITs",
    macroDomain: PolicyMacroDomain.BuiltEnvironment,
    macroDomainLabel: "Built Environment",
    color: "#0f766e", // Teal 700
  },
  [PolicyInterestTag.ConstructionInfrastructure]: {
    tag: PolicyInterestTag.ConstructionInfrastructure,
    label: "Construction & Infrastructure",
    slug: "construction-infrastructure",
    description: "Civil engineering, commercial builders, and toll roads",
    macroDomain: PolicyMacroDomain.BuiltEnvironment,
    macroDomainLabel: "Built Environment",
    color: "#14b8a6", // Teal 500
  },
  [PolicyInterestTag.AviationTransport]: {
    tag: PolicyInterestTag.AviationTransport,
    label: "Aviation & Transport",
    slug: "aviation-transport",
    description:
      "Airlines, airports, sea ports, rail, and road freight logistics",
    macroDomain: PolicyMacroDomain.BuiltEnvironment,
    macroDomainLabel: "Built Environment",
    color: "#0891b2", // Cyan 600
  },

  // Domain 3: Finance & Advisory (Blue/Indigo family)
  [PolicyInterestTag.BankingLending]: {
    tag: PolicyInterestTag.BankingLending,
    label: "Banking & Lending",
    slug: "banking-lending",
    description: "Retail and commercial banks, and mortgage lenders",
    macroDomain: PolicyMacroDomain.FinanceAdvisory,
    macroDomainLabel: "Finance & Advisory",
    color: "#1d4ed8", // Blue 700
  },
  [PolicyInterestTag.WealthSuperInsurance]: {
    tag: PolicyInterestTag.WealthSuperInsurance,
    label: "Wealth, Super & Insurance",
    slug: "wealth-super-insurance",
    description: "Asset managers, superannuation funds, and general insurers",
    macroDomain: PolicyMacroDomain.FinanceAdvisory,
    macroDomainLabel: "Finance & Advisory",
    color: "#3b82f6", // Blue 500
  },
  [PolicyInterestTag.ConsultingAccountingLegal]: {
    tag: PolicyInterestTag.ConsultingAccountingLegal,
    label: "Consulting, Accounting & Legal",
    slug: "consulting-accounting-legal",
    description:
      "Big 4 accounting, management consultancies, and commercial law firms",
    macroDomain: PolicyMacroDomain.FinanceAdvisory,
    macroDomainLabel: "Finance & Advisory",
    color: "#4338ca", // Indigo 700
  },
  [PolicyInterestTag.CryptoFintech]: {
    tag: PolicyInterestTag.CryptoFintech,
    label: "Crypto & Fintech",
    slug: "crypto-fintech",
    description:
      "Digital asset exchanges, blockchain platforms, and payment fintechs",
    macroDomain: PolicyMacroDomain.FinanceAdvisory,
    macroDomainLabel: "Finance & Advisory",
    color: "#6366f1", // Indigo 500
  },

  // Domain 4: Regulated Consumer (Rose/Red family)
  [PolicyInterestTag.GamblingWagering]: {
    tag: PolicyInterestTag.GamblingWagering,
    label: "Gambling & Wagering",
    slug: "gambling-wagering",
    description:
      "Casinos, sports betting, lotteries, and gaming machines (pokies)",
    macroDomain: PolicyMacroDomain.RegulatedConsumer,
    macroDomainLabel: "Regulated Consumer",
    color: "#be123c", // Rose 700
  },
  [PolicyInterestTag.AlcoholBeverages]: {
    tag: PolicyInterestTag.AlcoholBeverages,
    label: "Alcohol & Beverages",
    slug: "alcohol-beverages",
    description: "Breweries, distillers, wineries, and retail liquor licensing",
    macroDomain: PolicyMacroDomain.RegulatedConsumer,
    macroDomainLabel: "Regulated Consumer",
    color: "#e11d48", // Rose 600
  },
  [PolicyInterestTag.TobaccoNicotine]: {
    tag: PolicyInterestTag.TobaccoNicotine,
    label: "Tobacco & Nicotine",
    slug: "tobacco-nicotine",
    description:
      "Tobacco manufacturers and nicotine/vape distribution networks",
    macroDomain: PolicyMacroDomain.RegulatedConsumer,
    macroDomainLabel: "Regulated Consumer",
    color: "#991b1b", // Red 800
  },
  [PolicyInterestTag.FoodSupermarkets]: {
    tag: PolicyInterestTag.FoodSupermarkets,
    label: "Food & Supermarkets",
    slug: "food-supermarkets",
    description:
      "Supermarket chains, fast-food conglomerates, and packaged food",
    macroDomain: PolicyMacroDomain.RegulatedConsumer,
    macroDomainLabel: "Regulated Consumer",
    color: "#f43f5e", // Rose 500
  },
  [PolicyInterestTag.HospitalityTourism]: {
    tag: PolicyInterestTag.HospitalityTourism,
    label: "Hospitality & Tourism",
    slug: "hospitality-tourism",
    description: "Hotels, pubs, licensed clubs, resorts, and tourism operators",
    macroDomain: PolicyMacroDomain.RegulatedConsumer,
    macroDomainLabel: "Regulated Consumer",
    color: "#db2777", // Pink 600
  },

  // Domain 5: Health, Tech & Industry (Violet/Purple family)
  [PolicyInterestTag.PharmaBiotech]: {
    tag: PolicyInterestTag.PharmaBiotech,
    label: "Pharma & Biotech",
    slug: "pharma-biotech",
    description:
      "Prescription drug developers, biotechnology, and medical devices",
    macroDomain: PolicyMacroDomain.HealthTechIndustry,
    macroDomainLabel: "Health, Tech & Industry",
    color: "#6d28d9", // Violet 700
  },
  [PolicyInterestTag.PrivateHealthCare]: {
    tag: PolicyInterestTag.PrivateHealthCare,
    label: "Private Health Care",
    slug: "private-healthcare",
    description:
      "Private hospitals, community pharmacy bodies, and private health insurers",
    macroDomain: PolicyMacroDomain.HealthTechIndustry,
    macroDomainLabel: "Health, Tech & Industry",
    color: "#8b5cf6", // Violet 500
  },
  [PolicyInterestTag.TechTelecomPlatforms]: {
    tag: PolicyInterestTag.TechTelecomPlatforms,
    label: "Tech & Telecom Platforms",
    slug: "tech-telecom-platforms",
    description:
      "Software, cloud services, telecom carriers, and digital platforms",
    macroDomain: PolicyMacroDomain.HealthTechIndustry,
    macroDomainLabel: "Health, Tech & Industry",
    color: "#7e22ce", // Purple 700
  },
  [PolicyInterestTag.MediaBroadcasting]: {
    tag: PolicyInterestTag.MediaBroadcasting,
    label: "Media & Broadcasting",
    slug: "media-broadcasting",
    description: "Television networks, print publishing, and commercial radio",
    macroDomain: PolicyMacroDomain.HealthTechIndustry,
    macroDomainLabel: "Health, Tech & Industry",
    color: "#a855f7", // Purple 500
  },
  [PolicyInterestTag.DefenseAerospace]: {
    tag: PolicyInterestTag.DefenseAerospace,
    label: "Defense & Aerospace",
    slug: "defense-aerospace",
    description:
      "Weapons systems, naval shipbuilding, and military contracting",
    macroDomain: PolicyMacroDomain.HealthTechIndustry,
    macroDomainLabel: "Health, Tech & Industry",
    color: "#581c87", // Purple 900
  },
  [PolicyInterestTag.ManufacturingAutomotive]: {
    tag: PolicyInterestTag.ManufacturingAutomotive,
    label: "Manufacturing & Automotive",
    slug: "manufacturing-automotive",
    description:
      "Industrial manufacturing, paper/packaging, and vehicle distribution",
    macroDomain: PolicyMacroDomain.HealthTechIndustry,
    macroDomainLabel: "Health, Tech & Industry",
    color: "#9333ea", // Purple 600
  },

  // Domain 6: Labor & Advocacy (Emerald/Green family)
  [PolicyInterestTag.TradeUnions]: {
    tag: PolicyInterestTag.TradeUnions,
    label: "Trade Unions",
    slug: "trade-unions",
    description: "Public and private sector employee trade unions",
    macroDomain: PolicyMacroDomain.LaborAdvocacy,
    macroDomainLabel: "Labor & Advocacy",
    color: "#047857", // Emerald 700
  },
  [PolicyInterestTag.IdeologicalIssueAdvocacy]: {
    tag: PolicyInterestTag.IdeologicalIssueAdvocacy,
    label: "Ideological & Issue Advocacy",
    slug: "ideological-issue-advocacy",
    description:
      "Political fundraising trusts, think tanks, and issue campaigns",
    macroDomain: PolicyMacroDomain.LaborAdvocacy,
    macroDomainLabel: "Labor & Advocacy",
    color: "#10b981", // Emerald 500
  },
};

/**
 * - 'core': Primary commercial revenue or sole lobbying mandate is this interest
 * - 'partial': Multi-sector entity or umbrella peak body where this interest is one of several activities
 */
export const enum AttributionRole {
  core,
  partial,
}

export interface DonorInterestAttribution {
  tag: PolicyInterestTag;
  role: AttributionRole;
}

export type DonorInterestMap = Record<string, DonorInterestAttribution[]>;

export interface TagExposureStats {
  tag: PolicyInterestTag;
  label: string;
  slug: string;
  description: string;
  macroDomain: PolicyMacroDomain;
  macroDomainLabel: string;
  color: string;
  coreAmount: number;
  partialAmount: number;
  totalExposureAmount: number;
  coreCount: number;
  partialCount: number;
  uniqueDonorsCount: number;
  shareOfTotalPartyDonations: number;
  coreShareOfTotalPartyDonations: number;
}

export interface MacroDomainExposureStats {
  domain: PolicyMacroDomain;
  label: string;
  slug: string;
  description: string;
  color: string;
  coreAmount: number;
  partialAmount: number;
  totalExposureAmount: number;
  uniqueDonorsCount: number;
  shareOfTotalPartyDonations: number;
  coreShareOfTotalPartyDonations: number;
}

export interface MultiTagUnionStats {
  selectedTags: PolicyInterestTag[];
  coreAmount: number;
  partialAmount: number;
  totalExposureAmount: number;
  matchedDonorsCount: number;
  shareOfTotalPartyDonations: number;
  coreShareOfTotalPartyDonations: number;
}

export interface InterestAggregationResult {
  totalPartyDonations: number;
  tagStats: TagExposureStats[];
  unionStats?: MultiTagUnionStats;
}

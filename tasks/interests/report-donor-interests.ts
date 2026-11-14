import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

import type { CountryConfig } from "../../src/types/country-config";
import type {
  DonorInterestAttribution,
  DonorInterestMap,
} from "../../src/types/interests";
import type { BigDonor } from "../../src/utils/loader/biggest-donors";

import {
  AttributionRole,
  POLICY_INTEREST_TAG_METADATA,
  POLICY_MACRO_DOMAIN_LABELS,
} from "../../src/types/interests";
import { promptCountries } from "../utils";

type ReportMode = "all" | "biggest" | "mapped" | "unmapped";

const DATA_DIR = path.resolve(process.cwd(), "src/data");

const parseArgs = () => {
  const args = process.argv.slice(2);
  const getFlag = (name: string): string | undefined => {
    const prefix = `--${name}=`;
    const found = args.find((a) => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : undefined;
  };

  const country = getFlag("country") ?? process.env.COUNTRY;
  const topRaw = getFlag("top") ?? process.env.TOP;
  const top = topRaw ? Math.max(1, Number.parseInt(topRaw, 10)) : undefined;
  const modeRaw = (getFlag("mode") ?? process.env.MODE ?? "all").toLowerCase();
  const mode: ReportMode =
    modeRaw === "biggest" ||
    modeRaw === "mapped" ||
    modeRaw === "unmapped" ||
    modeRaw === "all"
      ? modeRaw
      : "all";

  return { country, top, mode };
};

const importDataModule = async <T>(filePath: string): Promise<T | null> => {
  if (!fs.existsSync(filePath)) return null;
  const mod = (await import(pathToFileURL(filePath).href)) as { default: T };
  return mod.default;
};

const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
};

const formatRole = (role: AttributionRole | number): string => {
  return role === AttributionRole.core || Number(role) === 0
    ? "core"
    : "partial";
};

const formatAttributions = (
  attributions: DonorInterestAttribution[],
  includeDomain = false,
): string => {
  if (!attributions.length) return "UNMAPPED";
  const sorted = [...attributions].sort((a, b) => {
    const aCore =
      a.role === AttributionRole.core || Number(a.role) === 0 ? 0 : 1;
    const bCore =
      b.role === AttributionRole.core || Number(b.role) === 0 ? 0 : 1;
    if (aCore !== bCore) return aCore - bCore;
    return Number(a.tag) - Number(b.tag);
  });

  return sorted
    .map((attr) => {
      const meta = POLICY_INTEREST_TAG_METADATA[attr.tag];
      const role = formatRole(attr.role);
      if (!meta) return `${role}: unknown_tag(${attr.tag})`;
      const domain = POLICY_MACRO_DOMAIN_LABELS[meta.macroDomain];
      return includeDomain
        ? `${role}: ${meta.label} [${domain}]`
        : `${role}: ${meta.label}`;
    })
    .join("; ");
};

const summarizePartyYears = (
  donor: BigDonor,
): { years: string; topParties: string } => {
  const years = Object.keys(donor.partyYearSums).sort();
  const yearRange =
    years.length === 0
      ? "n/a"
      : years.length === 1
        ? years[0]
        : `${years[0]}-${years[years.length - 1]}`;

  const partyTotals = new Map<string, number>();
  for (const yearData of Object.values(donor.partyYearSums)) {
    for (const [partyId, entry] of Object.entries(yearData)) {
      const amount = entry[0] ?? 0;
      partyTotals.set(partyId, (partyTotals.get(partyId) ?? 0) + amount);
    }
  }

  const topParties = [...partyTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([partyId]) => partyId)
    .join(", ");

  return { years: yearRange, topParties: topParties || "n/a" };
};

const reportCountry = async (
  countryId: string,
  options: { top?: number; mode: ReportMode },
) => {
  const countryDir = path.join(DATA_DIR, countryId);
  const interests =
    (await importDataModule<DonorInterestMap>(
      path.join(countryDir, "donor-interests.ts"),
    )) ?? {};
  const biggestDonors =
    (await importDataModule<BigDonor[]>(
      path.join(countryDir, "biggest-donors.ts"),
    )) ?? [];
  const countryConfig = await importDataModule<CountryConfig>(
    path.join(countryDir, "country-config.ts"),
  );

  const currency = countryConfig?.currency ?? "USD";
  const topLimit = options.top ?? biggestDonors.length;
  const topDonors = biggestDonors.slice(0, topLimit);

  const biggestByName = new Map<string, BigDonor>();
  for (const donor of biggestDonors) {
    biggestByName.set(donor.name, donor);
  }

  const mappedTopDonors = topDonors.filter(
    (d) => (interests[d.name]?.length ?? 0) > 0,
  );
  const unmappedTopDonors = topDonors.filter(
    (d) => (interests[d.name]?.length ?? 0) === 0,
  );
  const topTotalSum = topDonors.reduce((acc, d) => acc + d.sum, 0);
  const mappedTopSum = mappedTopDonors.reduce((acc, d) => acc + d.sum, 0);
  const mappedPct =
    topTotalSum > 0 ? ((mappedTopSum / topTotalSum) * 100).toFixed(1) : "0.0";

  const configuredEntries = Object.entries(interests);

  console.log(`# Donor Interests Audit Report: ${countryId}`);
  console.log("");
  console.log("## Summary");
  console.log(`- Top biggest donors inspected: ${topDonors.length}`);
  console.log(
    `- Mapped in top ${topDonors.length}: ${mappedTopDonors.length}/${topDonors.length} (${formatAmount(mappedTopSum, currency)} / ${formatAmount(topTotalSum, currency)}, ${mappedPct}%)`,
  );
  console.log(
    `- Unmapped in top ${topDonors.length}: ${unmappedTopDonors.length}`,
  );
  console.log(
    `- Total configured donor-interest entities: ${configuredEntries.length}`,
  );
  console.log("");

  if (
    options.mode === "all" ||
    options.mode === "biggest" ||
    options.mode === "unmapped"
  ) {
    const list = options.mode === "unmapped" ? unmappedTopDonors : topDonors;
    const heading =
      options.mode === "unmapped"
        ? `## Unmapped Biggest Donors (${list.length})`
        : `## Biggest Donors (${list.length})`;
    console.log(heading);
    console.log(
      "Format: <rank>. <donor> | <sum> | <years> | <top_parties> | <role: tag [; ...] | UNMAPPED>",
    );
    topDonors.forEach((donor, idx) => {
      const attrs = interests[donor.name] ?? [];
      if (options.mode === "unmapped" && attrs.length > 0) return;
      const { years, topParties } = summarizePartyYears(donor);
      console.log(
        `${idx + 1}. ${donor.name} | ${formatAmount(donor.sum, currency)} | ${years} | ${topParties} | ${formatAttributions(attrs)}`,
      );
    });
    console.log("");
  }

  if (options.mode === "all" || options.mode === "mapped") {
    const sortedConfigured = [...configuredEntries].sort(([a], [b]) => {
      const sumA = biggestByName.get(a)?.sum ?? -1;
      const sumB = biggestByName.get(b)?.sum ?? -1;
      if (sumA !== sumB) return sumB - sumA;
      return a.localeCompare(b);
    });

    console.log(
      `## Configured Donor-Interest Entities (${sortedConfigured.length})`,
    );
    console.log(
      "Format: - <entity> (<sum_if_in_biggest_donors>) -> <role: tag [macro_domain]>",
    );
    for (const [name, attrs] of sortedConfigured) {
      const big = biggestByName.get(name);
      const sumLabel = big
        ? formatAmount(big.sum, currency)
        : "not in biggest-donors";
      console.log(
        `- ${name} (${sumLabel}) -> ${formatAttributions(attrs, true)}`,
      );
    }
    console.log("");
  }
};

const main = async () => {
  const { country, top, mode } = parseArgs();
  const targets = country
    ? [country]
    : await promptCountries("What country to report donor interests for?");

  for (const target of targets) {
    const countryDir = path.join(DATA_DIR, target);
    if (!fs.existsSync(countryDir)) {
      console.error(
        `No data directory found for "${target}" at ${countryDir}.`,
      );
      process.exit(1);
    }
    await reportCountry(target, { top, mode });
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import fs from "fs";
import path from "path";
import readline from "readline";
import unzipper from "unzipper";
import { fileURLToPath } from "url";

import {
  CONDUIT_COMMITTEES,
  EXCLUDED_COMMITTEES,
  PAC_AFFILIATIONS,
  PAC_AUDIT_THRESHOLD,
} from "./pac-affiliations";
import { getCycleForYear, getCycleShort } from "./us-loader";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface UnmappedCommitteeViolation {
  cycle: string;
  id: string;
  name: string;
  type: string;
  sum: number;
  count: number;
}

/**
 * Discovers unmapped Super PACs (Type U/O) and Joint Fundraising Committees (Type J)
 * in FEC cycles that received contributions reaching or exceeding the audit threshold.
 *
 * Exits with status 1 if any unmapped committees exceed the threshold, making repeated
 * audit runs deterministic and reproducible.
 *
 * Usage:
 *   pnpm run us:discover-pacs                      # Audits all cached cycles (default >= $5M)
 *   THRESHOLD=10000000 pnpm run us:discover-pacs  # Audits with custom threshold
 *   YEAR=2026 pnpm run us:discover-pacs            # Audits a specific cycle
 */
async function analyzeCycle(
  cacheDir: string,
  cycle: string,
  threshold: number,
): Promise<UnmappedCommitteeViolation[]> {
  const cycle2 = getCycleShort(cycle);
  const cmPath = path.join(cacheDir, "cm", `cm${cycle2}.txt`);
  const zipPath = path.join(cacheDir, "zips", `indiv${cycle2}.zip`);

  if (!fs.existsSync(cmPath)) {
    console.error(`Missing committee master file: ${cmPath}`);
    console.error(
      `Run data:rebuild first or download cm${cycle2}.zip from FEC.`,
    );
    return [];
  }

  if (!fs.existsSync(zipPath)) {
    console.error(`Missing bulk individual donations archive: ${zipPath}`);
    console.error(
      `Run data:rebuild first or place indiv${cycle2}.zip in ${path.join(cacheDir, "zips")}/`,
    );
    return [];
  }

  console.log(
    `Analyzing FEC cycle ${cycle} (cm${cycle2}.txt & indiv${cycle2}.zip)...`,
  );

  // Parse committee master
  const cmMap = new Map<
    string,
    { name: string; type: string; party: string }
  >();
  const cmLines = fs.readFileSync(cmPath, "utf-8").split("\n");
  for (const line of cmLines) {
    if (!line) continue;
    const parts = line.split("|");
    const id = parts[0]?.trim();
    if (id) {
      cmMap.set(id, {
        name: parts[1]?.trim() || "UNKNOWN",
        type: parts[8]?.trim() || "?",
        party: parts[10]?.trim() || "",
      });
    }
  }

  const directory = await unzipper.Open.file(zipPath);
  const file = directory.files.find(
    (f) => !f.path.includes("/") && f.path.toLowerCase().endsWith(".txt"),
  );
  if (!file) {
    console.error("No top-level .txt file found inside " + zipPath);
    return [];
  }

  const rl = readline.createInterface({
    input: file.stream(),
    crlfDelay: Infinity,
  });

  const unmapped = new Map<string, { sum: number; count: number }>();

  for await (const line of rl) {
    if (!line) continue;
    const cols = line.split("|");
    if (cols.length < 15) continue;

    const cmteId = cols[0]?.trim();
    const memoCd = cols[18]?.trim();
    const tp = cols[5]?.trim();
    const amt = parseFloat(cols[14]?.trim());

    if (memoCd === "X" || isNaN(amt) || Math.abs(amt) < 10000) continue;
    if (
      CONDUIT_COMMITTEES.has(cmteId) ||
      EXCLUDED_COMMITTEES.has(cmteId) ||
      tp === "24T"
    ) {
      continue;
    }

    const cmte = cmMap.get(cmteId);
    if (!cmte) continue;
    const hasOfficialParty = ["DEM", "REP", "LIB", "GRE"].includes(cmte.party);
    const hasManualParty = Boolean(PAC_AFFILIATIONS[cmteId]);

    if (!hasOfficialParty && !hasManualParty) {
      const current = unmapped.get(cmteId) || { sum: 0, count: 0 };
      current.sum += amt;
      current.count += 1;
      unmapped.set(cmteId, current);
    }
  }

  const violations: UnmappedCommitteeViolation[] = [];
  for (const [id, stats] of unmapped.entries()) {
    if (stats.sum >= threshold) {
      const cmte = cmMap.get(id) || { name: "UNKNOWN", type: "?", party: "" };
      violations.push({
        cycle,
        id,
        name: cmte.name,
        type: cmte.type,
        sum: stats.sum,
        count: stats.count,
      });
    }
  }

  violations.sort((a, b) => b.sum - a.sum);

  if (violations.length === 0) {
    console.log(
      `✅ Cycle ${cycle}: All committees with receipts >= $${threshold.toLocaleString("en-US")} are mapped.\n`,
    );
    return [];
  }

  console.log(
    "\n==========================================================================",
  );
  console.log(
    `Found ${violations.length} Unmapped Committee(s) in Cycle ${cycle} (Receipts >= $${threshold.toLocaleString("en-US")})`,
  );
  console.log(
    "==========================================================================\n",
  );

  for (const v of violations) {
    const formattedSum =
      "$" +
      v.sum.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    console.log(
      `${v.id.padEnd(10)} | ${formattedSum.padStart(15)} | Type: ${v.type.padEnd(2)} | ${v.name}`,
    );
  }
  console.log("");
  return violations;
}

async function main() {
  const cacheDir = path.join(__dirname, ".donations-cache");
  const rawTarget = process.env.YEAR || process.env.YEARS || process.env.CYCLE;
  const threshold = process.env.THRESHOLD
    ? parseFloat(process.env.THRESHOLD)
    : PAC_AUDIT_THRESHOLD;

  console.log(
    `Starting PAC discovery audit (threshold: >= $${threshold.toLocaleString("en-US")})...\n`,
  );

  let cycles: string[] = [];
  if (rawTarget && rawTarget.toLowerCase() !== "all") {
    const uniqueCycles = new Set(
      rawTarget
        .split(",")
        .map((y) => y.trim())
        .filter(Boolean)
        .map((y) => getCycleForYear(y)),
    );
    cycles = Array.from(uniqueCycles).sort();
  } else {
    const zipsDir = path.join(cacheDir, "zips");
    if (fs.existsSync(zipsDir)) {
      cycles = fs
        .readdirSync(zipsDir)
        .map((f) => /^indiv(\d{2})\.zip$/i.exec(f))
        .filter((m): m is RegExpExecArray => Boolean(m))
        .map((m) => `20${m[1]}`)
        .sort();
    }
    if (cycles.length === 0) {
      console.error(`No cached indiv*.zip archives found in ${zipsDir}.`);
      process.exit(1);
    }
  }

  const allViolations: UnmappedCommitteeViolation[] = [];
  for (const cycle of cycles) {
    const violations = await analyzeCycle(cacheDir, cycle, threshold);
    allViolations.push(...violations);
  }

  if (allViolations.length > 0) {
    console.error(
      `❌ [PAC Audit Failed] Found ${allViolations.length} unmapped committee(s) with receipts >= $${threshold.toLocaleString("en-US")}.`,
    );
    console.error(
      "Please categorize them in tasks/load-data/us/pac-affiliations.ts (or add to EXCLUDED_COMMITTEES / CONDUIT_COMMITTEES).\n",
    );
    process.exit(1);
  }

  console.log(
    `✨ [PAC Audit Passed] All committees with receipts >= $${threshold.toLocaleString("en-US")} are categorized!\n`,
  );
}

main().catch(console.error);

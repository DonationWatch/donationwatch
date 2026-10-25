import type { ReadableStream } from "stream/web";

import fs, { createReadStream, createWriteStream } from "fs";
import fsPromises from "fs/promises";
import path from "path";
import readline from "readline";
import { Readable } from "stream";
import { finished } from "stream/promises";
import unzipper from "unzipper";

import type { ExtractedDonationAddress, ReceiverId } from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField, DonorType } from "@/utils/types";

import type {
  ExtractedYearData,
  PartyConfig,
  ProcessedDonationData,
} from "../data-loader";
import type { PacAffiliationConfig } from "./pac-affiliations";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";
import { buildUsDonorAliasMap, cleanUsDonorName } from "./donor-normalizer";
import {
  CONDUIT_COMMITTEES,
  EXCLUDED_COMMITTEES,
  PAC_AFFILIATIONS,
  PAC_AUDIT_THRESHOLD,
} from "./pac-affiliations";

// Map FEC 2-year cycles from single calendar years
export function getCycleForYear(year: string): string {
  const y = parseInt(year, 10);
  const cycleYear = y % 2 === 0 ? y : y + 1;
  return String(cycleYear);
}

export function getCycleShort(cycle: string): string {
  return cycle.slice(-2);
}

export function parseFecDate(dateStr: string): string | null {
  if (!dateStr || dateStr.length !== 8) return null;
  // Format is MMDDYYYY
  const m = dateStr.slice(0, 2);
  const d = dateStr.slice(2, 4);
  const y = dateStr.slice(4, 8);
  if (
    isNaN(parseInt(y, 10)) ||
    isNaN(parseInt(m, 10)) ||
    isNaN(parseInt(d, 10))
  ) {
    return null;
  }
  return `${y}-${m}-${d}`;
}

export interface FecParseContext {
  committeePartyMap: Map<string, string>;
  committeeNames?: Map<string, string>;
  trackedCommitteeNames?: Set<string>;
  priorYear: string;
  cycleYear: string;
}

// FEC refund transaction types:
// 20Y: Nonfederal refund
// 21Y: Native American Tribe refund
// 22Y: Contribution refund to individual, partnership, or LLC
// 22Z: Contribution refund to candidate or committee
// 28L: Refund of bundled contribution
// 40Y: Convention Account refund to individual
// 41Y: Headquarters Account refund to individual
// 42Y: Recount Account refund to individual
export const FEC_REFUND_TRANSACTION_TYPES = new Set([
  "20Y",
  "21Y",
  "22Y",
  "22Z",
  "28L",
  "40Y",
  "41Y",
  "42Y",
]);

export function isFecRefund(transactionTp?: string): boolean {
  if (!transactionTp) return false;
  return (
    FEC_REFUND_TRANSACTION_TYPES.has(transactionTp) ||
    transactionTp.startsWith("22") ||
    transactionTp.endsWith("Y")
  );
}

export function parseFecRow(
  cols: string[],
  context: FecParseContext,
  rowCounter = 0,
): { row: ExtractedYearData; isPrior: boolean; dedupKey: string } | null {
  if (cols.length < 15) return null;

  // Position 1: CMTE_ID
  const cmteId = cols[0]?.trim();
  // Position 6: TRANSACTION_TP (15 = Contribution, 15C = Candidate contribution, 16C = Candidate loan)
  const transactionTp = cols[5]?.trim();
  // Position 7: ENTITY_TP (IND = Individual, ORG = Organization, PAC = Political Action Committee, etc.)
  const entityTp = cols[6]?.trim();
  // Position 8: NAME
  const donorName = cols[7]?.trim();
  // Position 10: STATE
  const state = cols[9]?.trim();
  // Position 11: ZIP_CODE
  const zipCode = cols[10]?.trim()?.slice(0, 5);
  // Position 14: TRANSACTION_DT (MMDDYYYY)
  const dtStr = cols[13]?.trim();
  // Position 15: TRANSACTION_AMT
  const amtStr = cols[14]?.trim();
  // Position 16: OTHER_ID (FEC ID of contributing committee, if any)
  const otherId = cols[15]?.trim();
  // Position 19: MEMO_CD ('X' indicates memo entry e.g. conduit pass-through)
  const memoCd = cols[18]?.trim();
  // Position 20: MEMO_TEXT / transaction description
  const memoText = (cols[19]?.trim() || "").toUpperCase();

  let amt = parseFloat(amtStr);
  if (isNaN(amt) || Math.abs(amt) < 10000) return null;

  // In FEC bulk files, refund amounts are recorded as positive numbers;
  // negate them so that returned/refunded contributions offset receipts.
  if (isFecRefund(transactionTp)) {
    amt = -Math.abs(amt);
  }

  // Candidate self-funding exclusion
  if (
    transactionTp === "15C" ||
    transactionTp === "16C" ||
    transactionTp === "16L"
  ) {
    return null;
  }

  // Skip all memo records (MEMO_CD = 'X'): In FEC filings, memo entries are informational
  // and not counted toward total receipts to avoid double-counting (e.g. conduit summaries
  // from WinRed/ActBlue, partnership attributions, reattributions, etc.).
  if (memoCd === "X") {
    return null;
  }

  // Conduits (WinRed, ActBlue) act as intermediate processors forwarding earmarked
  // contributions to candidate/party committees. The actual recipient committees report
  // these contributions under transaction type 15E. Exclude conduit forwarding lines (24T),
  // direct conduit receipts, and explicitly excluded committees to avoid double-counting or bogus filings.
  if (
    CONDUIT_COMMITTEES.has(cmteId) ||
    EXCLUDED_COMMITTEES.has(cmteId) ||
    transactionTp === "24T"
  ) {
    return null;
  }

  // Super PAC-to-Super PAC & Inter-Committee Transfer Exclusions:
  // Exclude transfers between political committees to prevent double-counting
  // capital already counted upon entering the initial committee.
  // 1. Transaction types representing inter-committee transfers or committee in-kind contributions:
  //    - 24G: Transfer to affiliated committee
  //    - 24Z: In-kind contribution made to registered committee
  //    - 15Z: In-kind contribution from a political committee
  if (
    transactionTp === "24G" ||
    transactionTp === "24Z" ||
    (transactionTp === "15Z" &&
      (otherId ||
        entityTp === "PAC" ||
        entityTp === "COM" ||
        entityTp === "CCM"))
  ) {
    return null;
  }

  // 2. Contributions from tracked FEC committees:
  //    If OTHER_ID is an FEC committee ID already tracked in our dataset (e.g. party committee,
  //    JFC, or Super PAC), drop this transaction to avoid double-counting.
  //    Note: On earmarked individual contributions (15E), OTHER_ID denotes the forwarding conduit,
  //    not the donor, so 15E rows from individuals are preserved.
  if (
    transactionTp !== "15E" &&
    otherId &&
    context.committeePartyMap.has(otherId)
  ) {
    return null;
  }

  // 3. Name-based committee transfer exclusion:
  //    When OTHER_ID was omitted by the filing treasurer, but the contributing entity is marked
  //    as a committee (PAC, COM, CCM) and matches a tracked political committee name or acronym.
  if (
    (entityTp === "PAC" || entityTp === "COM" || entityTp === "CCM") &&
    donorName
  ) {
    const upperDonor = donorName.toUpperCase();
    if (
      context.trackedCommitteeNames?.has(upperDonor) ||
      context.trackedCommitteeNames?.has(
        cleanUsDonorName(donorName).toUpperCase(),
      )
    ) {
      return null;
    }
  }

  // Exclude non-donation entries under Transaction Type 10 (Line 17 - Other Receipts):
  // - Asset/crypto/stock liquidations (e.g. stock or crypto sold via exchange with purchaser unknown)
  // - Bank interest & dividend income
  // - List rental or sublet income
  // - Commercial vendor refunds or deposit returns
  if (transactionTp === "10") {
    if (
      memoText.includes("PURCHASER UNKNOWN") ||
      memoText.includes("SOLD VIA") ||
      memoText.includes("SOLD THROUGH") ||
      memoText.includes("INTEREST") ||
      memoText.includes("DIVIDEND") ||
      memoText.includes("RENT") ||
      memoText.includes("VENDOR REFUND") ||
      memoText.includes("REFUND OF DEPOSIT") ||
      memoText.includes("OVERPAYMENT")
    ) {
      return null;
    }
  }

  const date = parseFecDate(dtStr);
  if (!date) return null;

  const isPrior = date.startsWith(context.priorYear);
  const isCycle = date.startsWith(context.cycleYear);
  if (!isPrior && !isCycle) return null;

  // Check party affiliation
  const party = context.committeePartyMap.get(cmteId);
  if (!party) return null;

  const committeeName = context.committeeNames?.get(cmteId);
  const receiver = committeeName || party;

  const donorType =
    entityTp === "IND"
      ? DonorType.Individual
      : entityTp === "COM" || entityTp === "PAC"
        ? DonorType.RegisteredPoliticalParty
        : DonorType.Company;

  const address: ExtractedDonationAddress = {
    [AddressField.Country]: "US",
    ...(state ? { [AddressField.State]: state } : {}),
    ...(zipCode ? { [AddressField.Zip]: zipCode } : {}),
  };

  // Position 17: TRAN_ID
  const tranId = cols[16]?.trim();

  const row: ExtractedYearData = {
    idx: tranId ? `fec-${cmteId}-${tranId}` : `fec-${cmteId}-${rowCounter}`,
    [DonationField.Amount]: Math.round(amt),
    [DonationField.DonorName]: donorName,
    [DonationField.Date]: date as `${string}-${string}-${string}`,
    [DonationField.Address]: address,
    [DonationField.Receiver]: receiver as ReceiverId,
    [DonationField.DonorType]: donorType,
    ...(committeeName
      ? { [DonationField.OriginalReceiver]: committeeName }
      : {}),
  };

  const dedupKey = tranId
    ? `${cmteId}|${tranId}`
    : `${cmteId}|${party}|${donorName}|${Math.round(amt)}|${date}|${state || ""}|${zipCode || ""}`;

  return { row, isPrior, dedupKey };
}

export function validatePacAffiliationEntry(
  cmteId: string,
  config: PacAffiliationConfig,
  actualName?: string,
  officialParty?: string,
): void {
  const isCompatibleParty =
    officialParty === config.party ||
    (config.party === "NON" &&
      ["IND", "OTH", "NNE", "NON"].includes(officialParty || ""));

  if (officialParty && !isCompatibleParty) {
    throw new Error(
      `Party conflict for committee ${cmteId} ("${actualName || ""}"): ` +
        `official FEC party is "${officialParty}", but manual affiliation is "${config.party}". ` +
        `Manual affiliations must never contradict official FEC records!`,
    );
  }

  if (actualName && config.expectedNames?.length) {
    const matchesName = config.expectedNames.some((expected) =>
      actualName.toUpperCase().includes(expected.toUpperCase()),
    );
    if (!matchesName) {
      throw new Error(
        `Committee name mismatch for ${cmteId}: ` +
          `FEC records committee "${actualName}", which does not match expected name(s): ` +
          `[${config.expectedNames.join(", ")}]. Check for a committee ID typo!`,
      );
    }
  }
}

export class UsLoader extends DataLoader {
  constructor() {
    super("US", Country.unitedstates);
    for (const config of Object.values(PAC_AFFILIATIONS)) {
      if (config.expectedNames) {
        for (const expectedName of config.expectedNames) {
          this.registerCommitteeName(expectedName, config.party);
        }
      }
    }
  }

  donorMeta = donorMeta;

  parties: Record<string, PartyConfig> = {
    DEM: {
      code: "DEM",
      short: "Democrats",
      name: "Democratic Party & Aligned PACs",
      color: "#0044C9",
      wiki: 5043544,
    },
    REP: {
      code: "GOP",
      short: "Republicans",
      name: "Republican Party & Aligned PACs",
      color: "#DE0100",
      wiki: 32070,
    },
    LIB: {
      code: "LP",
      short: "Libertarians",
      name: "Libertarian Party",
      color: "#FFD100",
      wiki: 32044,
    },
    GRE: {
      code: "GPUS",
      short: "Greens",
      name: "Green Party of the United States",
      color: "#17AA5C",
      wiki: 30696,
    },
    NON: {
      code: "NON",
      short: "Bipartisan & Nonpartisan PACs",
      name: "Bipartisan & Nonpartisan Super PACs",
      color: "#64748B",
    },
  };

  cacheFile(year: string): string {
    return path.join(this.cacheDir, `filtered-${year}.json`);
  }

  private committeePartyMap: Map<string, string> = new Map();
  private committeeNames: Map<string, string> = new Map();
  private committeeNameToParty: Map<string, string> = new Map();

  public registerCommitteeName(name: string, party: string): void {
    const cleaned = name
      .trim()
      .replace(/^"(.+)"$/, "$1")
      .replace(/,$/, "")
      .replace(/\s+/g, " ")
      .trim()
      .normalize("NFKC");
    if (cleaned) {
      this.committeeNameToParty.set(cleaned, party);
    }
  }

  public getTrackedCommitteeNames(
    cycleNames?: Map<string, string>,
  ): Set<string> {
    const set = new Set<string>();

    for (const config of Object.values(PAC_AFFILIATIONS)) {
      if (config.expectedNames) {
        for (const name of config.expectedNames) {
          const upper = name.trim().toUpperCase();
          set.add(upper);
          set.add(cleanUsDonorName(upper).toUpperCase());
        }
      }
    }

    if (cycleNames) {
      for (const [cmteId, cmteName] of cycleNames.entries()) {
        if (this.committeePartyMap.has(cmteId)) {
          const upper = cmteName.trim().toUpperCase();
          set.add(upper);
          set.add(cleanUsDonorName(upper).toUpperCase());
        }
      }
    }

    return set;
  }

  private async loadCommitteeMaster(
    cycle: string,
    forceReload = false,
  ): Promise<Map<string, string>> {
    const cycle2 = getCycleShort(cycle);
    const cmCacheDir = path.join(this.cacheDir, "cm");
    await fsPromises.mkdir(cmCacheDir, { recursive: true });
    const cmTxtPath = path.join(cmCacheDir, `cm${cycle2}.txt`);

    if (forceReload || !fs.existsSync(cmTxtPath)) {
      const cmZipUrl = `https://www.fec.gov/files/bulk-downloads/${cycle}/cm${cycle2}.zip`;
      console.log(
        `Downloading FEC committee master for cycle ${cycle} from ${cmZipUrl}...`,
      );
      const response = await fetch(cmZipUrl);
      if (!response.ok || !response.body) {
        throw new Error(
          `Failed to download ${cmZipUrl}: ${response.statusText}`,
        );
      }
      const zipPath = path.join(cmCacheDir, `cm${cycle2}.zip`);
      const partPath = `${zipPath}.part`;
      const fileStream = createWriteStream(partPath);
      await finished(
        Readable.fromWeb(
          response.body as unknown as ReadableStream<Uint8Array>,
        ).pipe(fileStream),
      );
      await fsPromises.rename(partPath, zipPath);

      // Extract cm.txt
      const zip = fs
        .createReadStream(zipPath)
        .pipe(unzipper.Parse({ forceStream: true }));
      for await (const entry of zip) {
        const fileEntry = entry as unzipper.Entry;
        const fileName = fileEntry.path;
        if (fileName.toLowerCase().endsWith(".txt")) {
          await finished(fileEntry.pipe(createWriteStream(cmTxtPath)));
        } else {
          fileEntry.autodrain();
        }
      }
    }

    const cmteNames = new Map<string, string>();
    const cmteOfficialParties = new Map<string, string>();

    if (fs.existsSync(cmTxtPath)) {
      const rl = readline.createInterface({
        input: createReadStream(cmTxtPath, "utf-8"),
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (!line) continue;
        const parts = line.split("|");
        // CMTE_ID is column 0, CMTE_NM is column 1, CMTE_PTY_AFFILIATION is column 10
        const cmteId = parts[0]?.trim();
        const cmteNm = parts[1]?.trim();
        const pty = parts[10]?.trim();
        if (cmteId) {
          if (cmteNm) {
            cmteNames.set(cmteId, cmteNm);
            this.committeeNames.set(cmteId, cmteNm);
          }
          if (pty) {
            cmteOfficialParties.set(cmteId, pty);
            if (["DEM", "REP", "LIB", "GRE"].includes(pty)) {
              this.committeePartyMap.set(cmteId, pty);
            }
          }
        }
      }
    }

    // Merge and validate manual PAC / JFC affiliations
    for (const [cmteId, config] of Object.entries(PAC_AFFILIATIONS)) {
      const officialPty = cmteOfficialParties.get(cmteId);
      const actualName = cmteNames.get(cmteId);

      validatePacAffiliationEntry(cmteId, config, actualName, officialPty);

      this.committeePartyMap.set(cmteId, config.party);
    }

    // Register all mapped committee names for normalizeReceiver
    for (const [cmteId, cmteNm] of cmteNames.entries()) {
      const party = this.committeePartyMap.get(cmteId);
      if (party) {
        this.registerCommitteeName(cmteNm, party);
      }
    }

    return cmteNames;
  }

  private cycleLoadPromises: Map<string, Promise<void>> = new Map();
  private loadedCyclesInSession: Set<string> = new Set();

  async loadYearDataToCache(year: string): Promise<void> {
    const cycle = getCycleForYear(year);
    if (this.loadedCyclesInSession.has(cycle)) {
      return;
    }

    const existing = this.cycleLoadPromises.get(cycle);
    if (existing) {
      return existing;
    }

    const promise = this.loadCycleDataToCache(cycle)
      .then(() => {
        this.loadedCyclesInSession.add(cycle);
      })
      .finally(() => {
        this.cycleLoadPromises.delete(cycle);
      });
    this.cycleLoadPromises.set(cycle, promise);
    return promise;
  }

  private async loadCycleDataToCache(cycle: string): Promise<void> {
    const cycle2 = getCycleShort(cycle);
    const cycleNames = await this.loadCommitteeMaster(cycle, true);

    const zipsDir = path.join(this.cacheDir, "zips");
    await fsPromises.mkdir(zipsDir, { recursive: true });
    const zipPath = path.join(zipsDir, `indiv${cycle2}.zip`);

    const zipUrl = `https://www.fec.gov/files/bulk-downloads/${cycle}/indiv${cycle2}.zip`;
    console.log(
      `Downloading FEC individual contributions archive for cycle ${cycle} from ${zipUrl}...`,
    );
    const response = await fetch(zipUrl);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to download ${zipUrl}: ${response.statusText}`);
    }
    const partPath = `${zipPath}.part`;
    const fileStream = createWriteStream(partPath);
    await finished(
      Readable.fromWeb(
        response.body as unknown as ReadableStream<Uint8Array>,
      ).pipe(fileStream),
    );
    await fsPromises.rename(partPath, zipPath);

    await this.extractCycleFromZipToCache(cycle, cycleNames);
  }

  public async extractCycleFromZipToCache(
    cycle: string,
    existingCycleNames?: Map<string, string>,
  ): Promise<void> {
    const cycle2 = getCycleShort(cycle);
    const cycleYearNum = parseInt(cycle, 10);
    const priorYear = String(cycleYearNum - 1);
    const cycleYear = cycle;

    const priorYearPath = this.cacheFile(priorYear);
    const cycleYearPath = this.cacheFile(cycleYear);

    const cycleNames =
      existingCycleNames ?? (await this.loadCommitteeMaster(cycle, false));
    const zipPath = path.join(this.cacheDir, "zips", `indiv${cycle2}.zip`);

    try {
      // Stream lines directly from the zip without uncompressing the full 20GB to disk
      const zipStream = createReadStream(zipPath).pipe(
        unzipper.Parse({ forceStream: true }),
      );

      const priorYearRows = new Map<string, ExtractedYearData>();
      const cycleYearRows = new Map<string, ExtractedYearData>();
      const unmappedCommitteeTotals = new Map<string, number>();
      let count = 0;

      for await (const entry of zipStream) {
        const fileEntry = entry as unzipper.Entry;
        // Only read top-level itcont.txt; skip duplicate by_date/* splits
        if (
          !fileEntry.path.includes("/") &&
          fileEntry.path.toLowerCase().endsWith(".txt")
        ) {
          const rl = readline.createInterface({
            input: fileEntry,
            crlfDelay: Infinity,
          });

          const context: FecParseContext = {
            committeePartyMap: this.committeePartyMap,
            committeeNames: cycleNames,
            trackedCommitteeNames: this.getTrackedCommitteeNames(cycleNames),
            priorYear,
            cycleYear,
          };

          for await (const line of rl) {
            if (!line) continue;
            const cols = line.split("|");
            count++;

            // Audit unmapped committees with high receipts (>= $10k per donation)
            const cmteId = cols[0]?.trim();
            const memoCd = cols[18]?.trim();
            const tp = cols[5]?.trim();
            const amt = parseFloat(cols[14]?.trim());
            if (
              memoCd !== "X" &&
              !isNaN(amt) &&
              Math.abs(amt) >= 10000 &&
              !CONDUIT_COMMITTEES.has(cmteId) &&
              !EXCLUDED_COMMITTEES.has(cmteId) &&
              tp !== "24T" &&
              cycleNames.has(cmteId) &&
              !this.committeePartyMap.has(cmteId)
            ) {
              const currentTotal = unmappedCommitteeTotals.get(cmteId) || 0;
              unmappedCommitteeTotals.set(cmteId, currentTotal + amt);
            }

            const parsed = parseFecRow(cols, context, count);
            if (!parsed) continue;

            if (parsed.isPrior) {
              priorYearRows.set(parsed.dedupKey, parsed.row);
            } else {
              cycleYearRows.set(parsed.dedupKey, parsed.row);
            }
          }
        } else {
          fileEntry.autodrain();
        }
      }

      // Audit check: alert if unmapped PACs exceeded audit threshold in receipts
      const highUnmapped = Array.from(unmappedCommitteeTotals.entries())
        .filter(([, sum]) => sum >= PAC_AUDIT_THRESHOLD)
        .sort((a, b) => b[1] - a[1]);

      if (highUnmapped.length > 0) {
        console.warn(
          `\n⚠️  [US Loader Audit] Found ${highUnmapped.length} unmapped committee(s) in cycle ${cycle} with >= $${PAC_AUDIT_THRESHOLD.toLocaleString()} receipts:`,
        );
        for (const [id, sum] of highUnmapped) {
          const name = this.committeeNames.get(id) || "UNKNOWN";
          const formatted = "$" + Math.round(sum).toLocaleString("en-US");
          console.warn(`   - ${id} (${formatted}): ${name}`);
        }
        console.warn(
          `   Run 'YEAR=${cycle} pnpm run us:discover-pacs' to inspect and categorize them in pac-affiliations.ts.\n`,
        );
      }

      const priorRows = Array.from(priorYearRows.values());
      console.log(
        `Writing ${priorRows.length} deduplicated transactions for year ${priorYear}...`,
      );
      await fsPromises.writeFile(
        priorYearPath,
        JSON.stringify(priorRows, null, 2),
        "utf-8",
      );

      const cycleRows = Array.from(cycleYearRows.values());
      console.log(
        `Writing ${cycleRows.length} deduplicated transactions for year ${cycleYear}...`,
      );
      await fsPromises.writeFile(
        cycleYearPath,
        JSON.stringify(cycleRows, null, 2),
        "utf-8",
      );
    } catch (err) {
      console.error(`Error processing zip file ${zipPath}:`, err);
      throw err;
    }
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const cachePath = this.cacheFile(year);
    if (!fs.existsSync(cachePath)) {
      return [];
    }
    const cycleNames = await this.loadCommitteeMaster(getCycleForYear(year));
    const raw = await fsPromises.readFile(cachePath, "utf-8");
    const rows = JSON.parse(raw) as ExtractedYearData[];

    for (const row of rows) {
      const match = /^fec-(C\d+)-/.exec(row.idx);
      if (!match) continue;
      const cmteId = match[1];
      const cmteName =
        cycleNames.get(cmteId) ?? this.committeeNames.get(cmteId);
      const party =
        this.committeePartyMap.get(cmteId) ?? row[DonationField.Receiver];
      if (cmteName && party) {
        this.registerCommitteeName(cmteName, party);
        row[DonationField.Receiver] = cmteName as ReceiverId;
        row[DonationField.OriginalReceiver] = cmteName;
      }
    }

    return rows;
  }

  override normalizeReceiver(receiver: string): string {
    const normalized = super.normalizeReceiver(receiver);
    return this.committeeNameToParty.get(normalized) ?? normalized;
  }

  private aliasMap = new Map<string, string>();

  override normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    const cleaned = cleanUsDonorName(donor);
    const aliased = this.aliasMap.get(cleaned) || cleaned;
    return super.normalizeDonor(aliased, address);
  }

  public override processYearData(
    extractedData: ExtractedYearData[],
  ): ProcessedDonationData {
    this.aliasMap = buildUsDonorAliasMap(extractedData);
    if (this.aliasMap.size > 0) {
      console.log(
        `Applying ${this.aliasMap.size} unified US donor alias mappings...`,
      );
    }

    return super.processYearData(extractedData);
  }
}

import type { ReadableStream } from "stream/web";

import { parse as parseStream } from "csv-parse";
import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import unzipper from "unzipper";

import { DonationField } from "@/utils/types";

import type { ExtractedYearData } from "../data-loader";

import { Deferred } from "../util";

export const getCompaniesHouseDumpUrls = (): string[] => {
  const urls: string[] = [];
  const now = new Date();
  for (let offset = 0; offset < 3; offset++) {
    const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    urls.push(
      `https://download.companieshouse.gov.uk/BasicCompanyDataAsOneFile-${year}-${month}-01.zip`,
    );
  }
  return urls;
};

export const normalizeUkCompanyNumber = (raw: string): string | undefined => {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length === 0) return undefined;

  const match = cleaned.match(/^([A-Z]*)(\d+)$/);
  if (!match) return cleaned;

  const [, prefix, digits] = match;
  const targetDigitsLength = 8 - prefix.length;

  if (targetDigitsLength > 0 && digits.length < targetDigitsLength) {
    return `${prefix}${digits.padStart(targetDigitsLength, "0")}`;
  }

  return cleaned;
};

// Known typos in Electoral Commission data mapped to correct Companies House CRNs
export const crnOverrides: Record<string, string> = {
  // Liskeard Liberal Club Company Ltd: reported 00129450, actual is 00129430
  "00129450": "00129430",
  // Midland Computer Services: reported 03299742, actual is 03277942
  "03299742": "03277942",
  // Romiley Liberal Club & Hall Co Ltd: reported 00012011, actual is 00120011
  "00012011": "00120011",
  // Yorkshire Water Services Ltd: reported 00023666, actual is 02366682
  "00023666": "02366682",
};

let cachedValidCrns: Set<string> | null = null;
const onlineVerifiedCrns = new Map<string, boolean>();

const getValidCrnsFile = (cacheDir: string) =>
  path.join(cacheDir, "valid-company-numbers.txt");

export const prepareCompaniesHouseCache = async (
  cacheDir: string,
  log: (msg: string, ...args: unknown[]) => void = console.log,
): Promise<void> => {
  const validCrnsFile = getValidCrnsFile(cacheDir);

  try {
    await fs.access(validCrnsFile);
    log("Companies House cache exists, skipping download.");
    return;
  } catch {
    // Cache file doesn't exist, proceed with download
  }

  const dumpUrls = getCompaniesHouseDumpUrls();
  let res: Response | null = null;
  let successfulUrl = "";

  for (const url of dumpUrls) {
    log(`Checking Companies House dump at ${url}...`);
    try {
      const response = await fetch(url);
      if (response.ok && response.body) {
        res = response;
        successfulUrl = url;
        break;
      }
    } catch (err) {
      log(`Failed to fetch ${url}`, err);
    }
  }

  if (!res || !res.body) {
    log("Unable to download Companies House bulk dump from candidate URLs.");
    return;
  }

  log(`Streaming and extracting company numbers from ${successfulUrl}...`);

  const writeStream = fsSync.createWriteStream(validCrnsFile, {
    encoding: "utf8",
  });
  const csvInZipStream = Readable.fromWeb(
    res.body as unknown as ReadableStream<Uint8Array>,
  ).pipe(unzipper.ParseOne());

  const parser = parseStream({
    delimiter: ",",
    fromLine: 2,
    relax_column_count: true,
  });

  const deferred = new Deferred<void>();

  parser.on("readable", () => {
    let record: string[] | null;
    while ((record = parser.read()) !== null) {
      if (!record || !record[1]) continue;
      const companyName = record[0]?.trim();
      const companyNumber = record[1]?.trim();
      if (companyNumber) {
        writeStream.write(
          companyName
            ? `${companyNumber}\t${companyName}\n`
            : `${companyNumber}\n`,
        );
      }
    }
  });

  parser.on("end", () => {
    writeStream.end();
    deferred.resolve();
  });

  parser.on("error", (err) => {
    writeStream.end();
    deferred.reject(err);
  });

  csvInZipStream.pipe(parser);

  await deferred.promise;
  log("Companies House company numbers cached successfully.");
};

export const loadValidCrns = async (
  cacheDir: string,
  log: (msg: string, ...args: unknown[]) => void = console.log,
): Promise<Set<string>> => {
  if (cachedValidCrns) return cachedValidCrns;

  cachedValidCrns = new Set<string>();
  const validCrnsFile = getValidCrnsFile(cacheDir);

  try {
    const content = await fs.readFile(validCrnsFile, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const [crn] = trimmed.split("\t");
      if (crn) {
        cachedValidCrns.add(crn);
      }
    }
    log(
      `Loaded ${cachedValidCrns.size} verified Companies House registration numbers from cache.`,
    );
  } catch {
    log("No Companies House cache found; skipping local verification.");
  }
  return cachedValidCrns;
};

export const verifyExtractedCompanyNumbers = async (
  donations: ExtractedYearData[],
  cacheDir: string,
  log: (msg: string, ...args: unknown[]) => void = console.log,
): Promise<void> => {
  const validCrns = await loadValidCrns(cacheDir, log);
  if (validCrns.size === 0) return;

  const unverifiedCrns = new Map<string, string[]>();

  for (const donation of donations) {
    const crn = donation[DonationField.DonorRegistrationNumber];
    if (crn && !validCrns.has(crn)) {
      const donorName = donation[DonationField.DonorName];
      if (!unverifiedCrns.has(crn)) {
        unverifiedCrns.set(crn, []);
      }
      const list = unverifiedCrns.get(crn)!;
      if (!list.includes(donorName)) {
        list.push(donorName);
      }
    }
  }

  if (unverifiedCrns.size > 0) {
    const missingCrns = new Map<string, string[]>();

    // For any numbers missing from the live dump, check if they exist on the portal (e.g. dissolved companies)
    for (const [crn, donors] of unverifiedCrns.entries()) {
      let isValid = onlineVerifiedCrns.get(crn);

      if (isValid === undefined) {
        try {
          const res = await fetch(
            `https://find-and-update.company-information.service.gov.uk/company/${crn}`,
            { method: "HEAD" },
          );
          isValid = res.status === 200;
        } catch {
          isValid = false;
        }
        onlineVerifiedCrns.set(crn, isValid);
      }

      if (isValid) {
        // Add to in-memory set so future year extractions treat it as valid
        validCrns.add(crn);
      } else {
        missingCrns.set(crn, donors);
      }
    }

    if (missingCrns.size > 0) {
      const missingList = Array.from(missingCrns.entries())
        .map(([crn, donors]) => `${crn} (${donors.join(", ")})`)
        .join(", ");
      log(
        `Found ${missingCrns.size} invalid company registration numbers (not found on Companies House): ${missingList}`,
      );
    }
  }
};

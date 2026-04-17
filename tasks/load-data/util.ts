"use strict";

import type { Page } from "@playwright/test";

import { chromium } from "@playwright/test";
import { createHash } from "node:crypto";
import { access } from "node:fs/promises";

import type {
  DonationsDocument,
  DonationsDocumentWithoutDonorIds,
} from "@/lib/api/donations-document";
import type { Donation } from "@/utils/types";

import { DonationField } from "@/utils/types";

export const RANDOM_COLOR_MARKER = "#FF00FF";

export const assertNoDuplicateIds = (
  donations: { [DonationField.Id]: string }[],
): void => {
  const ids = new Set();
  donations.forEach((donation) => {
    if (ids.has(donation[DonationField.Id])) {
      throw new Error(
        `Duplicate donation ${donation[DonationField.Id]}, ${JSON.stringify(donation)}`,
      );
    }
    ids.add(donation[DonationField.Id]);
  });
};

export const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const hashCache: Record<string, string> = {};
export const hash = (input: string): string => {
  if (hashCache[input]) return hashCache[input];

  const hashed = createHash("sha1").update(input).digest("hex");
  hashCache[input] = hashed;
  return hashed;
};

export const exists = async (path: string): Promise<boolean> => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

export class Deferred<T> {
  public promise: Promise<T>;
  public resolve: (value: T) => void = () => {};
  public reject: (error: Error) => void = () => {};

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

export const containsWords = (string: string, words: string): boolean => {
  return words
    .split(" ")
    .every((word) => string.toLowerCase().includes(word.toLowerCase()));
};

export const donationsToDonationsDocumentWithoutDonorIds = (
  donations: Donation[],
): DonationsDocumentWithoutDonorIds => {
  const document = donationsToDonationsDocument(donations);
  return {
    donors: document.donors.map(([donorName, ubos]) => [donorName, ubos]),
    donations: document.donations,
  };
};

export const donationsToDonationsDocumentWithDonorIds = (
  donations: Donation[],
): DonationsDocument => {
  return donationsToDonationsDocument(donations);
};

const donationsToDonationsDocument = (
  donations: Donation[],
): DonationsDocument => {
  const donorIds: Record<string, string> = {};
  const donorUBOs: Record<string, Set<string>> = {};

  donations.forEach((donation) => {
    const donorName = donation[DonationField.DonorName];
    const ubos = donation[DonationField.UBOs];

    donorIds[donorName] = hash(donorName);

    if (ubos?.length) {
      donorUBOs[donorName] ??= new Set([]);
      ubos.forEach((ubo) => donorUBOs[donorName].add(ubo));
    }
  });

  const document: DonationsDocument = {
    donors: Object.entries(donorIds).map(([donorName, donorId]) => [
      donorName,
      donorUBOs[donorName] ? [...donorUBOs[donorName]] : null,
      donorId,
    ]),
    donations: [],
  };
  const donorNames = Object.keys(donorIds);
  const donorNameToIndex: Record<string, number> = {};
  for (let i = 0; i < donorNames.length; i++) {
    donorNameToIndex[donorNames[i]] = i;
  }

  donations.forEach((donation) => {
    const donorName = donation[DonationField.DonorName];
    const donorIndex = donorNameToIndex[donorName];

    const {
      [DonationField.DonorName]: _1,
      [DonationField.UBOs]: _2,
      ...donationWithStrippedFields
    } = donation;

    document.donations.push({
      ...donationWithStrippedFields,
      [DonationField.DonorIndex]: donorIndex,
    });
  });

  return document;
};

const hslToHex = (h: number, s: number, l: number): `#${string}` => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // Convert to Hex and pad
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

/**
 * This generates a random but consistent color for a party based on some seed, e.g. party id.
 * Note: prefer to hardcode a specific color that's associated with the party (e.g. from their logo) if possible, but this can be used as a fallback.
 * @param seed
 */
export const generatePartyColor = (seed: string): `#${string}` => {
  // 1. Simple, fast string hashing algorithm (djb2)
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // 2. Map the hash to a Hue (0 to 359)
  const hue = hash % 360;

  // 3. Lock Saturation and Lightness
  const saturation = 65;
  const lightness = 45;

  // 4. Convert and return as HEX
  return hslToHex(hue, saturation, lightness);
};

export const spawnBrowser = async <T>(
  callback: (page: Page) => Promise<T>,
): Promise<T> => {
  const before = performance.now();
  try {
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: {
        width: 1080,
        height: 1024,
      },
    });
    const page = await context.newPage();

    try {
      return await callback(page);
    } finally {
      await page.close();
      await context.close();
      await browser.close();
    }
  } finally {
    const after = performance.now();
    console.log(`spawning browser took ${after - before}`);
  }
};

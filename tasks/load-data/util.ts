"use strict";

import { createHash } from "node:crypto";
import { access } from "node:fs/promises";

import { DonationField } from "../../src/utils/types";

import type { Donation } from "../../src/utils/types";
import type {
  DonationsDocument,
  DonationsDocumentWithoutDonorIds,
} from "@/lib/api/donations-document";

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

import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, test } from "vitest";

import type { Donation } from "@/utils/types";

import { PartyField } from "@/types/party";
import { COUNTRIES } from "@/utils/countries";
import { getParties } from "@/utils/loader/parties";
import { getWikiArticles } from "@/utils/loader/wiki";
import { DonationField } from "@/utils/types";

import { getDonations } from "../tasks/data/load-donations";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const countryConfigs = await Promise.all(
  [...COUNTRIES].map(async (country) => {
    const [parties, wikipediaArticles] = await Promise.all([
      getParties(country),
      getWikiArticles(country),
    ]);
    return {
      country,
      parties,
      wikipediaArticles,
      donationsPromise: getDonations(country),
    };
  }),
);

describe.each(countryConfigs)(
  `country $country`,
  ({ country, parties, wikipediaArticles, donationsPromise }) => {
    let donations: Donation[];
    const articles = new Set(Object.keys(wikipediaArticles.articles));

    beforeAll(async () => {
      donations = await donationsPromise;
    });

    test("there's no year with 0 donations from the first to the last year", async () => {
      expect(donations.length).toBeGreaterThan(0);

      const years = new Set(
        donations.map((d) =>
          parseInt(d[DonationField.Date].substring(0, 4), 10),
        ),
      );

      const yearsArray = Array.from(years);
      const minYear = Math.min(...yearsArray);
      const maxYear = Math.max(...yearsArray);

      for (let year = minYear; year <= maxYear; year++) {
        expect(years.has(year), `Missing data for year ${year}`).toBe(true);
      }
    });

    test.describe("parties", () => {
      test.each(parties)(
        `$${PartyField.Short} has wikipedia articles loaded`,
        async (party) => {
          const name = party[PartyField.Short];
          const wiki = party[PartyField.Wiki];

          if (!wiki) return;

          expect(articles.has(`${wiki}`), `Missing article for ${name}`).toBe(
            true,
          );

          await expect(
            fs.access(
              path.join(
                __dirname,
                `../public/data/${country}/wikipedia/by-pageId/${wiki}.json`,
              ),
            ),
          ).resolves.not.toThrow();
        },
      );
    });

    test(`has valid donation fields`, () => {
      const validDates = new Set<string>();

      for (const donation of donations) {
        if (donation[DonationField.DonorName].length === 0) {
          expect.fail("Donor name is empty");
        }

        if (
          donation[DonationField.Amount] === 0 ||
          Number.isNaN(donation[DonationField.Amount])
        ) {
          expect.fail(
            `Donation amount must be non-zero, got ${donation[DonationField.Amount]}`,
          );
        }

        if (donation[DonationField.Receiver].length === 0) {
          expect.fail("Receiver is empty");
        }

        const date = donation[DonationField.Date];
        if (!validDates.has(date)) {
          if (date.length > "2020-01-01".length) {
            expect.fail(`Date has invalid iso8601 length: ${date}`);
          }
          if (Number.isNaN(new Date(date).getTime())) {
            expect.fail(`${date} is not a valid date`);
          }
          validDates.add(date);
        }
      }
    });

    test(`has unique donors and ids`, () => {
      const foundDonations = new Map<string, string>();
      const seenDonorNames = new Set<string>();
      const foundDonationIds = new Set<string>();

      for (const donation of donations) {
        const id = donation[DonationField.Id];
        if (foundDonationIds.has(id)) {
          expect.fail(`Duplicate donation id ${id}`);
        }
        foundDonationIds.add(id);

        const donorName = donation[DonationField.DonorName];
        if (seenDonorNames.has(donorName)) continue;
        seenDonorNames.add(donorName);

        const donorKey = donorName.replace(/[^\p{L}\p{N}]/gu, "").toUpperCase();

        const existingDonorName = foundDonations.get(donorKey);
        if (existingDonorName && existingDonorName !== donorName) {
          console.log(
            `Found similar donors: ${donorName} and ${existingDonorName}`,
          );
          expect(donorName).toBe(existingDonorName);
        }

        foundDonations.set(donorKey, donorName);
      }
    });
  },
);

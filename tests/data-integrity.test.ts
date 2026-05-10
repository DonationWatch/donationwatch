import fs from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { beforeAll, describe, expect, test } from "vitest";

import type { Donation } from "@/utils/types";

import { PartyField } from "@/types/party";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getWikiArticles } from "@/utils/loader/wiki";
import { DonationField } from "@/utils/types";

import { getDonations } from "../tasks/data/load-donations";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const countryConfigs = await Promise.all(
  [...COUNTRIES].map(async (country) => ({
    country,
    countryConfig: await getCountryConfig(country),
    wikipediaArticles: await getWikiArticles(country),
  })),
);

describe.each(countryConfigs)(
  `country $country`,
  ({ country, countryConfig, wikipediaArticles }) => {
    let donations: Donation[];
    const articles = new Set(Object.keys(wikipediaArticles.articles));

    beforeAll(async () => {
      [donations] = await Promise.all([getDonations(country)]);
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
      test.each(countryConfig.parties)(
        `$${PartyField.Name} has wikipedia articles loaded`,
        async (party) => {
          const name = party[PartyField.Name];
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

    test(`has valid donation fields`, async () => {
      donations.every((donation) => {
        expect(
          donation[DonationField.DonorName].length,
          "Donor name is not empty",
        ).toBeGreaterThan(0);

        expect(
          donation[DonationField.Amount],
          "Donation amount is greater than 0",
        ).toBeGreaterThan(0);

        expect(
          donation[DonationField.Receiver].length,
          "Receiver is not empty",
        ).toBeGreaterThan(0);

        expect(
          donation[DonationField.Date].length,
          "Date has correct iso8601 length",
        ).toBeLessThanOrEqual("2020-01-01".length);

        expect(
          new Date(donation[DonationField.Date]).getTime(),
          `${donation[DonationField.Date]} is a valid date `,
        ).not.toBeNaN();
      });
    });

    test(`has unique donors and ids`, async () => {
      const foundDonations: Record<string, string> = {};
      const foundDonationIds = new Set<string>();

      donations.forEach((donation) => {
        expect(
          foundDonationIds.has(donation[DonationField.Id]),
          `Duplicate donation id ${donation[DonationField.Id]}`,
        ).toBeFalsy();
        foundDonationIds.add(donation[DonationField.Id]);

        const donorKey = donation[DonationField.DonorName]
          .replace(/[^\p{L}\p{N}]/gu, "")
          .replace(/\./g, "")
          .toUpperCase();

        if (
          foundDonations[donorKey] &&
          foundDonations[donorKey] !== donation[DonationField.DonorName]
        ) {
          console.log(
            `Found similar donors: ${donation[DonationField.DonorName]} and ${foundDonations[donorKey]}`,
          );
          expect(donation[DonationField.DonorName]).toBe(
            foundDonations[donorKey],
          );
        }

        foundDonations[donorKey] = donation[DonationField.DonorName];
      });

      // just let test pass
      expect(true).toBe(true);
    });
  },
);

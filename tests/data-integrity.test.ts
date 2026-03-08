import { expect, test, beforeAll, describe } from "vitest";

import { COUNTRIES } from "../src/utils/countries";
import { getCountryConfig } from "../src/utils/data/get-country-config";
import { getWikiArticles } from "../src/utils/loader/wiki";
import { DonationField } from "../src/utils/types";
import { getDonations } from "../tasks/data/load-donations";

import type { CountryConfig } from "../src/utils/countries";
import type { Donation } from "../src/utils/types";

describe.each([...COUNTRIES].map((country) => ({ country })))(
  `country $country`,
  ({ country }) => {
    let donations: Donation[];
    let wikipediaArticles: { articles: Record<number, string> };
    let countryConfig: CountryConfig;

    beforeAll(async () => {
      [donations, wikipediaArticles, countryConfig] = await Promise.all([
        getDonations(country),
        getWikiArticles(country),
        getCountryConfig(country),
      ]);
    });

    test("has wikipedia articles loaded", async () => {
      const articles = Object.keys(wikipediaArticles.articles);

      countryConfig.parties.every(({ name, wiki }) => {
        if (!wiki) return;

        expect(
          articles.includes(`${wiki}`),
          `Missing article for ${name}`,
        ).toBe(true);
      });
    });

    test(`has valid dates`, async () => {
      donations.every((donation) => {
        expect(donation[DonationField.Date].length).toBeLessThanOrEqual(
          "2020-01-01".length,
        );
        expect(
          new Date(donation[DonationField.Date]).getTime(),
          `Given date ${donation[DonationField.Date]}`,
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

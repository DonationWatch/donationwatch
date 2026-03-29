import { beforeAll, describe, expect, test } from "vitest";

import type { CountryConfig } from "@/types/country-config";
import type { Donation } from "@/utils/types";

import { PartyField } from "@/types/party";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getWikiArticles } from "@/utils/loader/wiki";
import { DonationField } from "@/utils/types";

import { getDonations } from "../tasks/data/load-donations";

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

      countryConfig.parties.every((party) => {
        const name = party[PartyField.Name];
        const wiki = party[PartyField.Wiki];

        if (!wiki) return;

        expect(
          articles.includes(`${wiki}`),
          `Missing article for ${name}`,
        ).toBe(true);
      });
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

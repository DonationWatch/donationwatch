import { describe, test, expect } from "vitest";

import en from "../src/messages/en";
import { COUNTRIES } from "../src/utils/countries";
import { getCountryConfig } from "../src/utils/data/get-country-config";
import { AddressField, DonationField } from "../src/utils/types";
import { getDonations } from "../tasks/data/load-donations";

describe("Party countries are translated", () => {
  COUNTRIES.forEach((country) => {
    test(`for ${country}`, async () => {
      const countries = new Set<string>();
      const donations = await getDonations(country);
      donations.forEach((donation) => {
        countries.add(donation[DonationField.Address][AddressField.Country]);
      });

      countries.forEach((country) => {
        expect(
          (en.countries as Record<string, string>)[country],
          `Has translation for country ${country} (${country.length})`,
        ).toBeTruthy();
      });
    });
  });
});

describe("Party config fields are unique", () => {
  COUNTRIES.forEach((country) => {
    test(`for ${country}`, async () => {
      const ids = new Set<string>();
      const colors = new Set<string>();
      const shortNames = new Set<string>();
      const names = new Set<string>();
      const countryConfig = await getCountryConfig(country);

      countryConfig.parties.forEach((party) => {
        expect(
          ids.has(party.id),
          `Duplicate id ${party.id} in ${country}`,
        ).toBe(false);
        ids.add(party.id);

        expect(
          colors.has(party.color),
          `Duplicate color ${party.color} in ${country}`,
        ).toBe(false);
        colors.add(party.color);

        expect(
          shortNames.has(party.short),
          `Duplicate short name ${party.short} in ${country}`,
        ).toBe(false);
        shortNames.add(party.short);

        expect(
          names.has(party.name),
          `Duplicate name ${party.name} in ${country}`,
        ).toBe(false);
        names.add(party.name);
      });
    });
  });
});

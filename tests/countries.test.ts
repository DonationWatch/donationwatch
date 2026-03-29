import { describe, expect, test } from "vitest";

import { PartyField } from "@/types/party";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { AddressField, DonationField } from "@/utils/types";

import en from "../src/messages/en.json";
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
          ids.has(party[PartyField.Id]),
          `Duplicate id ${party[PartyField.Id]} in ${country}`,
        ).toBe(false);
        ids.add(party[PartyField.Id]);

        expect(
          colors.has(party[PartyField.Color]),
          `Duplicate color ${party[PartyField.Color]} in ${country}`,
        ).toBe(false);
        colors.add(party[PartyField.Color]);

        expect(
          shortNames.has(party[PartyField.Short]),
          `Duplicate short name ${party[PartyField.Short]} in ${country}`,
        ).toBe(false);
        shortNames.add(party[PartyField.Short]);

        expect(
          names.has(party[PartyField.Name]),
          `Duplicate name ${party[PartyField.Name]} in ${country}`,
        ).toBe(false);
        names.add(party[PartyField.Name]);
      });
    });
  });
});

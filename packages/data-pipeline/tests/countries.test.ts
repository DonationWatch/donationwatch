import { PartyField } from "@donationwatch/core/types/party";
import { COUNTRIES } from "@donationwatch/core/utils/countries";
import { getLongName } from "@donationwatch/core/utils/party";
import { AddressField, DonationField } from "@donationwatch/core/utils/types";
import { getParties } from "@donationwatch/data/loader/parties";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

import { getDonations } from "../src/load-donations";
import { WEB_MESSAGES_DIR } from "../src/paths";

const en = JSON.parse(
  fs.readFileSync(path.join(WEB_MESSAGES_DIR, "en.json"), "utf8"),
) as { countries: Record<string, string> };

describe("Party countries are translated", () => {
  COUNTRIES.forEach((country) => {
    test.concurrent(`for ${country}`, async () => {
      const countries = new Set<string>();
      const donations = await getDonations(country);
      for (const donation of donations) {
        countries.add(donation[DonationField.Address][AddressField.Country]);
      }

      for (const c of countries) {
        expect(
          en.countries[c],
          `Has translation for country ${c} (${c.length})`,
        ).toBeTruthy();
      }
    });
  });
});

describe("Party config fields are unique", () => {
  COUNTRIES.forEach((country) => {
    test.concurrent(`for ${country}`, async () => {
      const ids = new Set<string>();
      const colors = new Set<string>();
      const shortNames = new Set<string>();
      const names = new Set<string>();
      const parties = await getParties(country);

      parties.forEach((party) => {
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
          names.has(getLongName(party)),
          `Duplicate name ${getLongName(party)} in ${country}`,
        ).toBe(false);
        names.add(getLongName(party));
      });
    });
  });
});

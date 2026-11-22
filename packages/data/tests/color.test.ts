import { PartyField } from "@donationwatch/core/types/party";
import { COUNTRIES } from "@donationwatch/core/utils/countries";
import { getParties } from "@donationwatch/data/loader/parties";
import { describe, expect, test } from "vitest";

describe("Color", () => {
  COUNTRIES.forEach((country) => {
    test(`${country} has a color for each party`, async () => {
      const parties = await getParties(country);
      parties.forEach((party) =>
        expect(party[PartyField.Color]).toBeTypeOf("string"),
      );
    });
  });
});

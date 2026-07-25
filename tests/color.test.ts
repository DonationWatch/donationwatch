import { describe, expect, test } from "vitest";

import { PartyField } from "@/types/party";
import { COUNTRIES } from "@/utils/countries";
import { getParties } from "@/utils/loader/parties";

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

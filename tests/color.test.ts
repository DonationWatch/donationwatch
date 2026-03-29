import { describe, expect, test } from "vitest";

import { PartyField } from "@/types/party";
import { partyColor } from "@/utils/color";
import { COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";

describe("Color", () => {
  COUNTRIES.forEach((country) => {
    test(`${country} has a color for each party`, async () => {
      const countryConfig = await getCountryConfig(country);
      countryConfig.parties.forEach((party) =>
        expect(partyColor(party[PartyField.Id], countryConfig)).toBeTypeOf(
          "string",
        ),
      );
    });
  });
});

import { expect, test, describe } from "vitest";

import { partyColor } from "../src/utils/color";
import { COUNTRIES } from "../src/utils/countries";
import { getCountryConfig } from "../src/utils/data/get-country-config";

describe("Color", () => {
  COUNTRIES.forEach((country) => {
    test(`${country} has a color for each party`, async () => {
      const countryConfig = await getCountryConfig(country);
      countryConfig.parties.forEach((party) =>
        expect(partyColor(party.id, countryConfig)).toBeTypeOf("string"),
      );
    });
  });
});

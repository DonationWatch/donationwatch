import { describe, expect, test } from "vitest";

import {
  icoOverrides,
  isValidCzechIco,
  normalizeCzechIco,
} from "../../tasks/load-data/cz/cz-loader";

describe("icoOverrides", () => {
  test("contains known IČO typo overrides that all resolve to valid Czech IČOs", () => {
    expect(icoOverrides["66473383"]).toBe("06647383");
    expect(icoOverrides["00565686"]).toBe("05656869");
    expect(icoOverrides["02287438"]).toBe("22874381");
    expect(icoOverrides["02604538"]).toBe("26049538");
    expect(icoOverrides["26009228"]).toBe("26090228");
    expect(icoOverrides["07586074"]).toBe("07286074");
    expect(icoOverrides["14614355"]).toBe("14614855");
    expect(icoOverrides["25427959"]).toBe("25427989");

    for (const correctedIco of Object.values(icoOverrides)) {
      expect(isValidCzechIco(correctedIco)).toBe(true);
    }
  });
});

describe("normalizeCzechIco", () => {
  test.each([
    ["60197501", "60197501"],
    [60197501, "60197501"],
    ["5932483", "05932483"],
    [5932483, "05932483"],
    ["05932483", "05932483"],
    ["  60197501  ", "60197501"],
    ["CZ60197501", "60197501"],
    ["", undefined],
    [undefined, undefined],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeCzechIco(input)).toBe(expected);
  });
});

describe("isValidCzechIco", () => {
  test.each([
    // Real valid Czech IČOs
    ["60197501", true], // Slavia pojišťovna a.s.
    ["05932483", true], // 8-digit padded
    ["45244782", true], // O2 Czech Republic
    ["00001350", true], // Škoda Auto a.s.
    ["27082440", true], // Alza.cz a.s.
    // Invalid / corrupt IČOs
    ["60197502", false], // bad check digit
    ["12345678", false], // invalid checksum
    ["00000000", false], // invalid
    ["20314116187", false], // too long (German tax ID)
    ["441243892", false], // too long (Belgian ID)
    ["123", false], // too short
    ["", false],
    [undefined, false],
  ])("validates %s as %s", (input, expected) => {
    expect(isValidCzechIco(input)).toBe(expected);
  });
});

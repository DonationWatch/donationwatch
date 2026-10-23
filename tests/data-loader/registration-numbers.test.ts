import { describe, expect, test } from "vitest";

import {
  isValidBelgianKbo,
  isValidBulgarianUic,
  isValidCzechIco,
  isValidDutchKvk,
  isValidEstonianRegistryCode,
  isValidFinnishBusinessId,
  isValidFrenchSiren,
  isValidLatvianRegistrationNumber,
  isValidLuxembourgRcs,
  normalizeCzechIco,
  normalizeUkCompanyNumber,
} from "../../tasks/load-data/registration-numbers";

describe("Shared registration-numbers validators & normalizers", () => {
  describe("normalizeUkCompanyNumber", () => {
    test.each([
      ["12345", "00012345"],
      ["SC12345", "SC012345"],
      ["00012345", "00012345"],
      ["SC012345", "SC012345"],
      ["  sc 12345  ", "SC012345"],
    ])("normalizeUkCompanyNumber(%s) -> %s", (input, expected) => {
      expect(normalizeUkCompanyNumber(input)).toBe(expected);
    });
  });

  describe("normalizeCzechIco", () => {
    test.each([
      ["12345", "00012345"],
      [12345, "00012345"],
      ["00012345", "00012345"],
      ["", undefined],
      [undefined, undefined],
    ])("normalizeCzechIco(%s) -> %s", (input, expected) => {
      expect(normalizeCzechIco(input)).toBe(expected);
    });
  });

  describe("isValidCzechIco", () => {
    test.each([
      ["06647383", true],
      ["06647384", false],
      ["", false],
      [undefined, false],
    ])("isValidCzechIco(%s) -> %s", (input, expected) => {
      expect(isValidCzechIco(input)).toBe(expected);
    });
  });

  describe("isValidBelgianKbo", () => {
    test.each([
      ["0439652401", true],
      ["0466097866", true],
      ["1030660533", true],
      ["0439652402", false],
    ])("isValidBelgianKbo(%s) -> %s", (input, expected) => {
      expect(isValidBelgianKbo(input)).toBe(expected);
    });
  });

  describe("isValidBulgarianUic", () => {
    test.each([
      ["121575489", true],
      ["121575480", false],
    ])("isValidBulgarianUic(%s) -> %s", (input, expected) => {
      expect(isValidBulgarianUic(input)).toBe(expected);
    });
  });

  describe("isValidFrenchSiren", () => {
    test.each([
      ["795039528", true],
      ["732075312", true],
      ["795039529", false],
    ])("isValidFrenchSiren(%s) -> %s", (input, expected) => {
      expect(isValidFrenchSiren(input)).toBe(expected);
    });
  });

  describe("isValidEstonianRegistryCode", () => {
    test.each([
      ["10137025", true],
      ["10137020", false],
    ])("isValidEstonianRegistryCode(%s) -> %s", (input, expected) => {
      expect(isValidEstonianRegistryCode(input)).toBe(expected);
    });
  });

  describe("isValidFinnishBusinessId", () => {
    test.each([
      ["0245458-3", true],
      ["0245458-4", false],
    ])("isValidFinnishBusinessId(%s) -> %s", (input, expected) => {
      expect(isValidFinnishBusinessId(input)).toBe(expected);
    });
  });

  describe("isValidLuxembourgRcs", () => {
    test.each([
      ["B180022", true],
      ["b180022", true],
      ["B1234567", false],
      ["K180022", false],
    ])("isValidLuxembourgRcs(%s) -> %s", (input, expected) => {
      expect(isValidLuxembourgRcs(input)).toBe(expected);
    });
  });

  describe("isValidLatvianRegistrationNumber", () => {
    test.each([
      ["45403058722", true],
      ["4540305872", false],
      ["454030587221", false],
    ])("isValidLatvianRegistrationNumber(%s) -> %s", (input, expected) => {
      expect(isValidLatvianRegistrationNumber(input)).toBe(expected);
    });
  });

  describe("isValidDutchKvk", () => {
    test.each([
      ["30218840", true],
      ["3021884", false],
      ["302188400", false],
    ])("isValidDutchKvk(%s) -> %s", (input, expected) => {
      expect(isValidDutchKvk(input)).toBe(expected);
    });
  });
});

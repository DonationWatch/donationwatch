import { describe, expect, test } from "vitest";

import {
  extractEuDonorRegistrationNumber,
  inspectEuDonorRegistrationNumber,
  isValidBelgianKbo,
  isValidBulgarianUic,
  isValidDutchKvk,
  isValidEstonianRegistryCode,
  isValidFinnishBusinessId,
  isValidFrenchSiren,
  isValidLatvianRegistrationNumber,
  isValidLuxembourgRcs,
} from "../../tasks/load-data/eu/registration-numbers";

describe("EU registration number validators", () => {
  test.each([
    ["0439652401", true], // Amgen NV
    ["0466097866", true], // AT&T Global Network Services
    ["1030660533", true], // Airbnb Belgium SRL
    ["0439652402", false], // bad checksum
    ["439652401", false], // unpadded 9 digits
    ["", false],
    [undefined, false],
  ])("isValidBelgianKbo(%s) -> %s", (input, expected) => {
    expect(isValidBelgianKbo(input)).toBe(expected);
  });

  test.each([
    ["795039528", true], // Qualcomm France SARL
    ["799760087", true], // QUALCOMM Communications S.A.R.L.
    ["800366072", true], // Fonds de dotation GT Editions
    ["795039529", false], // bad Luhn checksum
    ["12345", false],
    ["", false],
    [undefined, false],
  ])("isValidFrenchSiren(%s) -> %s", (input, expected) => {
    expect(isValidFrenchSiren(input)).toBe(expected);
  });

  test.each([
    ["12749460", true], // Amundsen Travel OÜ
    ["12749461", false], // bad checksum
    ["02749460", false], // invalid prefix
    ["", false],
    [undefined, false],
  ])("isValidEstonianRegistryCode(%s) -> %s", (input, expected) => {
    expect(isValidEstonianRegistryCode(input)).toBe(expected);
  });

  test.each([
    ["3084343-9", true], // Hållbart Initiativ
    ["1897609-5", true], // Vihreiden nuorten ja opiskelijoiden liitto ry
    ["1897609-4", false], // bad checksum
    ["18976095", false], // missing hyphen
    ["", false],
    [undefined, false],
  ])("isValidFinnishBusinessId(%s) -> %s", (input, expected) => {
    expect(isValidFinnishBusinessId(input)).toBe(expected);
  });

  test.each([
    ["130164711", true], // Bluelink Foundation
    ["130164712", false], // bad checksum
    ["", false],
    [undefined, false],
  ])("isValidBulgarianUic(%s) -> %s", (input, expected) => {
    expect(isValidBulgarianUic(input)).toBe(expected);
  });

  test.each([
    ["B180022", true],
    ["F10502", true],
    ["A123", true],
    ["Z12345", false],
    ["180022", false],
    ["", false],
    [undefined, false],
  ])("isValidLuxembourgRcs(%s) -> %s", (input, expected) => {
    expect(isValidLuxembourgRcs(input)).toBe(expected);
  });

  test.each([
    ["45403058722", true],
    ["40008262104", true],
    ["12345", false],
    ["", false],
    [undefined, false],
  ])("isValidLatvianRegistrationNumber(%s) -> %s", (input, expected) => {
    expect(isValidLatvianRegistrationNumber(input)).toBe(expected);
  });

  test.each([
    ["56317441", true],
    ["27272000", true],
    ["1234567", false],
    ["", false],
    [undefined, false],
  ])("isValidDutchKvk(%s) -> %s", (input, expected) => {
    expect(isValidDutchKvk(input)).toBe(expected);
  });
});

describe("extractEuDonorRegistrationNumber", () => {
  test.each([
    // Belgium (KBO)
    ["Amgen NV (0439.652.401)", "BE" as const, "0439652401"],
    ["Amgen NV (BE 0439.652.401)", "BE" as const, "0439652401"],
    [
      "AT&T Global Network Services Belgium Luxembourg BVBA (0466.097.866)",
      "BE" as const,
      "0466097866",
    ],
    [
      "AT&T Global Network Services Belgium Luxembourg (466097866)",
      "BE" as const,
      "0466097866",
    ],
    [
      "Bristol-Myers Squibb Belgium (0403.075.184)",
      "BE" as const,
      "0403075184",
    ],
    ["Eli Lilly Benelux S.A (0406.754.454)", "BE" as const, "0406754454"],
    ["Plastics Europe AISBL (0416.155.338)", "BE" as const, "0416155338"],
    ["Vodafone Belgium NV (0413.652.243)", "BE" as const, "0413652243"],
    // Known APPF typo override: Vodafone Belgium NV with Eli Lilly's KBO
    ["Vodafone Belgium NV (BE 0406.754.454)", "BE" as const, "0413652243"],
    // France (SIREN / SIRET / VAT)
    ["Qualcomm France S.A.R.L (795.039.528)", "FR" as const, "795039528"],
    [
      "QUALCOMM Communications S.A.R.L. (799 760 087 00038)",
      "FR" as const,
      "799760087",
    ],
    ["InterDigital R&D France (FR 25839664273)", "FR" as const, "839664273"],
    // Known APPF typo override: ISSEP with leading "80"
    [
      "Institut des Sciences Sociales, Économiques et Politiques (80834901365)",
      "FR" as const,
      "834901365",
    ],
    // Czech Republic (IČO)
    [
      "European Academy for Democracy (EAD) (41692683)",
      "CZ" as const,
      "41692683",
    ],
    [
      "Institut Aktivniho Obcanstvi - Institute for Active Citizenship (229 02 546)",
      "CZ" as const,
      "22902546",
    ],
    // Estonia
    ["Amundsen Travel (EE 12749460)", "EE" as const, "12749460"],
    // Finland
    [
      "Hållbart Initiativ / Sustainable Initiative ( 3084343-9)",
      "FI" as const,
      "3084343-9",
    ],
    // Bulgaria
    ["Bluelink (130164711)", "BG" as const, "130164711"],
    // Luxembourg
    ["Amazon Europe Core Sarl (B180022)", "LU" as const, "B180022"],
    [
      "FEDERATION EUROPEENNE D'ASSOCIATIONS ET D'INDUSTRIES PHARMACEUTIQUES (EFPIA) (F10502)",
      "LU" as const,
      "F10502",
    ],
    // Latvia
    [
      "Progresīvie - Politiskā partija / The Progressives - Political Party  (40008262104)",
      "LV" as const,
      "40008262104",
    ],
    ["Citra Development (LV45403058722)", "LV" as const, "45403058722"],
    // Netherlands is unsupported (no direct URL format without internal establishment number)
    ["Uber B.V. (56317441)", "NL" as const, undefined],
    ["Stichting Vrienden van de PVV (27272000)", "NL" as const, undefined],
    // Airbus SAS (FR) with Belgian branch KBO in APPF is mapped to French SIREN
    ["Airbus SAS (BE0852.111.841)", "FR" as const, "383474814"],
    // Cross-country mismatch should be ignored
    ["MICROSOFT NV (BE 0437910359)", "IE" as const, undefined],
    [
      "Friedrich Naumann Foundation for Freedom (0850.617.348)",
      "DE" as const,
      undefined,
    ],
    // Unsupported countries or non-registration numbers should return undefined
    [
      "Brumaire Verlag GmbH (HRB 210249 (Berlin-Charlottenburg))",
      "DE" as const,
      undefined,
    ],
    ["Minor Donations (10) from Natural Persons", "??" as const, undefined],
  ])("extracts %s (%s) -> %s", (donorName, country, expected) => {
    expect(extractEuDonorRegistrationNumber(donorName, country)).toBe(expected);
  });

  test("reports unsupported_country when a donor from an unmapped country has a registration number", () => {
    expect(
      inspectEuDonorRegistrationNumber(
        "Brumaire Verlag GmbH (HRB 210249 (Berlin-Charlottenburg))",
        "DE",
      ),
    ).toEqual({
      status: "unsupported_country",
      rawNumber: "HRB 210249 (Berlin-Charlottenburg)",
      cleanDonorName: "Brumaire Verlag GmbH",
      country: "DE",
    });
  });

  test("reports invalid when a donor from a supported country fails checksum or prefix validation", () => {
    expect(
      inspectEuDonorRegistrationNumber("Qualcomm France (795.039.529)", "FR"),
    ).toEqual({
      status: "invalid",
      rawNumber: "795.039.529",
      cleanDonorName: "Qualcomm France",
      country: "FR",
    });

    expect(
      inspectEuDonorRegistrationNumber("Amgen NV (0439.652.402)", "BE"),
    ).toEqual({
      status: "invalid",
      rawNumber: "0439.652.402",
      cleanDonorName: "Amgen NV",
      country: "BE",
    });
  });
});

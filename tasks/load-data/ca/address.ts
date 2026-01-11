// Map first character to province/territory
import { AddressField } from "../../../src/utils/types";

import type { DonationAddress } from "../../../src/utils/types";

const provinceMap: { [key: string]: string } = {
  A: "NL", // Newfoundland and Labrador
  B: "NS", // Nova Scotia
  C: "PE", // Prince Edward Island
  E: "NB", // New Brunswick
  G: "QC",
  H: "QC",
  J: "QC", // Quebec
  K: "ON",
  L: "ON",
  M: "ON",
  N: "ON",
  P: "ON", // Ontario
  R: "MB", // Manitoba
  S: "SK", // Saskatchewan
  T: "AB", // Alberta
  V: "BC", // British Columbia
  Y: "YT", // Yukon
};

const knownProvinces = new Set(Object.values(provinceMap));

export const extractAddress = (
  zip: string,
  province: string,
  city: string,
): DonationAddress => {
  // Remove spaces and make uppercase for standardization
  const pc = zip.replace(/\s+/g, "").toUpperCase();

  // Validate format: Canadian postal codes are in the format A1A1A1
  if (!/^[ABCEGHJKLMNPRSTVXY]\d[A-Z]\d[A-Z]\d$/.test(pc)) {
    console.warn(
      `Invalid Canadian postal code format ${pc}`,
      zip,
      province,
      city,
    );
    return { [AddressField.Country]: "??" };
  }

  if (province && knownProvinces.has(province)) {
    return { [AddressField.Country]: "CA", [AddressField.State]: province };
  }

  // Special cases for Nunavut and Northwest Territories
  const firstThree = pc.substring(0, 3);

  if (["X0A", "X0B", "X0C"].includes(firstThree))
    return { [AddressField.Country]: "CA", [AddressField.State]: "NU" }; // Nunavut
  if (["X1A", "X0E", "X0G"].includes(firstThree))
    return { [AddressField.Country]: "CA", [AddressField.State]: "NT" }; // Northwest Territories

  return {
    [AddressField.Country]: "CA",
    [AddressField.State]: provinceMap[pc[0]],
  };
};

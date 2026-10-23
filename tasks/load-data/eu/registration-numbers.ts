import type { Countries } from "@/utils/countries";

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
} from "../registration-numbers";

export {
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
};

export const SUPPORTED_EU_REGISTRY_COUNTRIES = new Set<Countries>([
  "BE",
  "BG",
  "CZ",
  "EE",
  "FI",
  "FR",
  "LU",
  "LV",
]);

export type EuRegistrationExtractionResult =
  | { status: "extracted"; registrationNumber: string }
  | { status: "none" }
  | {
      status: "unsupported_country";
      rawNumber: string;
      cleanDonorName: string;
      country: Countries;
    }
  | {
      status: "invalid";
      rawNumber: string;
      cleanDonorName: string;
      country: Countries;
    };

export const inspectEuDonorRegistrationNumber = (
  donorName: string,
  country: Countries,
): EuRegistrationExtractionResult => {
  if (/Minor Donations? \(\d+\) from Natural Persons/i.test(donorName)) {
    return { status: "none" };
  }

  const matches = [...donorName.matchAll(/\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g)];
  if (!matches.length) return { status: "none" };

  let lastCandidate: string | undefined;
  let lastCandidateMatch: string | undefined;

  for (let i = matches.length - 1; i >= 0; i--) {
    const rawInside = matches[i][1].trim();
    const digits = rawInside.replace(/\D/g, "");

    // Check Luxembourg RCS pattern before digits length check since it has a letter prefix (e.g. B180022, F10502)
    if (country === "LU") {
      const match = rawInside.match(/^([A-J]\d{1,6})$/i);
      if (match) {
        return {
          status: "extracted",
          registrationNumber: match[1].toUpperCase(),
        };
      }
    }

    if (digits.length < 4) continue;

    if (!lastCandidate) {
      lastCandidate = rawInside;
      lastCandidateMatch = matches[i][0];
    }

    if (!SUPPORTED_EU_REGISTRY_COUNTRIES.has(country)) {
      continue;
    }

    if (country === "FR" && /airbus/i.test(donorName)) {
      // Known discrepancy in APPF data: Airbus SAS (France) reported with its Belgian branch KBO number BE0852.111.841 instead of French SIREN 383474814
      return { status: "extracted", registrationNumber: "383474814" };
    }

    // Only extract when any explicit country prefix matches the donor's country
    const explicitPrefixMatch = rawInside.match(/^([A-Z]{2})\b/i);
    if (
      explicitPrefixMatch &&
      explicitPrefixMatch[1].toUpperCase() !== country
    ) {
      continue;
    }

    if (country === "BE") {
      const padded = digits.length === 9 ? `0${digits}` : digits;
      if (isValidBelgianKbo(padded)) {
        // Known typo in APPF data: Vodafone Belgium NV reported with Eli Lilly's KBO 0406.754.454 instead of 0413.652.243
        if (padded === "0406754454" && /vodafone/i.test(donorName)) {
          return { status: "extracted", registrationNumber: "0413652243" };
        }
        return { status: "extracted", registrationNumber: padded };
      }
    }

    if (country === "BG") {
      if (isValidBulgarianUic(digits)) {
        return { status: "extracted", registrationNumber: digits };
      }
    }

    if (country === "FR") {
      let candidate = digits;
      // French VAT number: FR + 2 check chars + 9-digit SIREN
      if (/^FR[A-Z0-9]{2}\d{9}$/i.test(rawInside.replace(/\s+/g, ""))) {
        candidate = digits.slice(-9);
      } else if (digits.length === 14) {
        // 14-digit SIRET -> first 9 digits are the SIREN
        candidate = digits.slice(0, 9);
      } else if (digits === "80834901365") {
        // Known typo in APPF data: ISSEP reported with extra leading "80" before SIREN 834901365
        candidate = "834901365";
      }
      if (isValidFrenchSiren(candidate)) {
        return { status: "extracted", registrationNumber: candidate };
      }
    }

    if (country === "CZ") {
      const ico = normalizeCzechIco(digits);
      if (ico && isValidCzechIco(ico)) {
        return { status: "extracted", registrationNumber: ico };
      }
    }

    if (country === "EE") {
      if (isValidEstonianRegistryCode(digits)) {
        return { status: "extracted", registrationNumber: digits };
      }
    }

    if (country === "FI") {
      const normalizedFi = rawInside.replace(/\s+/g, "");
      if (isValidFinnishBusinessId(normalizedFi)) {
        return { status: "extracted", registrationNumber: normalizedFi };
      }
    }

    if (country === "LV") {
      if (isValidLatvianRegistrationNumber(digits)) {
        return { status: "extracted", registrationNumber: digits };
      }
    }
  }

  if (!lastCandidate) {
    return { status: "none" };
  }

  const cleanDonorName =
    (lastCandidateMatch
      ? donorName.replace(lastCandidateMatch, "").replace(/\s+/g, " ").trim()
      : undefined) || donorName;

  if (!SUPPORTED_EU_REGISTRY_COUNTRIES.has(country)) {
    return {
      status: "unsupported_country",
      rawNumber: lastCandidate,
      cleanDonorName,
      country,
    };
  }

  return {
    status: "invalid",
    rawNumber: lastCandidate,
    cleanDonorName,
    country,
  };
};

export const extractEuDonorRegistrationNumber = (
  donorName: string,
  country: Countries,
): string | undefined => {
  const result = inspectEuDonorRegistrationNumber(donorName, country);
  return result.status === "extracted" ? result.registrationNumber : undefined;
};

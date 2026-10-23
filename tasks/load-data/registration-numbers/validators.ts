// Belgium (KBO / BCE)
export const isValidBelgianKbo = (kbo: string | undefined): boolean => {
  if (!kbo || !/^[01]\d{9}$/.test(kbo)) return false;
  const base = parseInt(kbo.slice(0, 8), 10);
  const check = parseInt(kbo.slice(8, 10), 10);
  return 97 - (base % 97) === check;
};

// Bulgaria (EIK / UIC)
export const isValidBulgarianUic = (uic: string | undefined): boolean => {
  if (!uic || !/^\d{9}$/.test(uic)) return false;
  const digits = uic.split("").map(Number);
  const w1 = [1, 2, 3, 4, 5, 6, 7, 8];
  let rem =
    digits.slice(0, 8).reduce((acc, d, idx) => acc + d * w1[idx], 0) % 11;
  if (rem < 10) return digits[8] === rem;
  const w2 = [3, 4, 5, 6, 7, 8, 9, 10];
  rem = digits.slice(0, 8).reduce((acc, d, idx) => acc + d * w2[idx], 0) % 11;
  return digits[8] === (rem < 10 ? rem : 0);
};

// Czech Republic (IČO)
export const normalizeCzechIco = (
  raw: number | string | undefined,
): string | undefined => {
  if (raw === undefined || raw === null) return undefined;
  const cleaned = String(raw).replace(/\D/g, "");
  if (cleaned.length === 0) return undefined;
  return cleaned.padStart(8, "0");
};

export const isValidCzechIco = (ico: string | undefined): boolean => {
  if (!ico || !/^\d{8}$/.test(ico)) return false;
  const digits = ico.split("").map(Number);
  const weights = [8, 7, 6, 5, 4, 3, 2];
  const sum = digits
    .slice(0, 7)
    .reduce((acc, digit, idx) => acc + digit * weights[idx], 0);
  const remainder = sum % 11;
  let expectedCheckDigit: number;
  if (remainder === 0) {
    expectedCheckDigit = 1;
  } else if (remainder === 1) {
    expectedCheckDigit = 0;
  } else {
    expectedCheckDigit = 11 - remainder;
  }
  return digits[7] === expectedCheckDigit;
};

// Estonia (e-Business Register / RIK)
export const isValidEstonianRegistryCode = (
  code: string | undefined,
): boolean => {
  if (!code || !/^[1789]\d{7}$/.test(code)) return false;
  const digits = code.split("").map(Number);
  const weights1 = [1, 2, 3, 4, 5, 6, 7];
  let rem =
    digits.slice(0, 7).reduce((acc, d, idx) => acc + d * weights1[idx], 0) % 11;
  if (rem < 10) return digits[7] === rem;
  const weights2 = [3, 4, 5, 6, 7, 8, 9];
  rem =
    digits.slice(0, 7).reduce((acc, d, idx) => acc + d * weights2[idx], 0) % 11;
  return digits[7] === (rem < 10 ? rem : 0);
};

// Finland (Business ID / Y-tunnus)
export const isValidFinnishBusinessId = (id: string | undefined): boolean => {
  if (!id) return false;
  const match = id.match(/^(\d{7})-(\d)$/);
  if (!match) return false;
  const digits = match[1].split("").map(Number);
  const check = Number(match[2]);
  const weights = [7, 9, 10, 5, 8, 4, 2];
  const sum = digits.reduce((acc, d, idx) => acc + d * weights[idx], 0);
  const rem = sum % 11;
  if (rem === 0) return check === 0;
  if (rem === 1) return false;
  return 11 - rem === check;
};

// France (SIREN)
export const isValidFrenchSiren = (siren: string | undefined): boolean => {
  if (!siren || !/^\d{9}$/.test(siren)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(siren[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

// Luxembourg (RCS)
export const isValidLuxembourgRcs = (rcs: string | undefined): boolean => {
  if (!rcs) return false;
  return /^[A-J]\d{1,6}$/i.test(rcs.trim());
};

// Latvia (Enterprise Register)
export const isValidLatvianRegistrationNumber = (
  regNumber: string | undefined,
): boolean => {
  if (!regNumber) return false;
  return /^\d{11}$/.test(regNumber.trim());
};

// Netherlands (KVK Handelsregister)
export const isValidDutchKvk = (kvk: string | undefined): boolean => {
  if (!kvk) return false;
  return /^\d{8}$/.test(kvk.trim());
};

// United Kingdom (Companies House CRN)
export const normalizeUkCompanyNumber = (raw: string): string | undefined => {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (cleaned.length === 0) return undefined;

  const match = cleaned.match(/^([A-Z]*)(\d+)$/);
  if (!match) return cleaned;

  const [, prefix, digits] = match;
  const targetDigitsLength = 8 - prefix.length;

  if (targetDigitsLength > 0 && digits.length < targetDigitsLength) {
    return `${prefix}${digits.padStart(targetDigitsLength, "0")}`;
  }

  return cleaned;
};

export const enum Country {
  germany = "germany",
  austria = "austria",
  switzerland = "switzerland",
  unitedkingdom = "unitedkingdom",
  netherlands = "netherlands",
  europeanunion = "europeanunion",
  estonia = "estonia",
  czechrepublic = "czechrepublic",
  latvia = "latvia",
  australia = "australia",
  serbia = "serbia",
  croatia = "croatia",
  canada = "canada",
  georgia = "georgia",
  norway = "norway",
  ukraine = "ukraine",
  france = "france",
  sweden = "sweden",
  southafrica = "southafrica",
  unitedstates = "unitedstates",
}

export type CountryCode =
  | "AT"
  | "DE"
  | "CH"
  | "UK"
  | "NL"
  | "EU"
  | "EE"
  | "CZ"
  | "LV"
  | "AU"
  | "RS"
  | "HR"
  | "CA"
  | "GE"
  | "NO"
  | "UA"
  | "FR"
  | "SE"
  | "ZA"
  | "US";

export type Currency =
  | "EUR"
  | "CHF"
  | "GBP"
  | "CZK"
  | "AUD"
  | "RSD"
  | "CAD"
  | "GEL"
  | "NOK"
  | "UAH"
  | "SEK"
  | "ZAR"
  | "USD";

export const COUNTRIES = new Set<Country>([
  Country.germany,
  Country.austria,
  Country.switzerland,
  Country.unitedkingdom,
  Country.netherlands,
  Country.europeanunion,
  Country.estonia,
  Country.czechrepublic,
  Country.latvia,
  Country.australia,
  Country.serbia,
  Country.croatia,
  Country.canada,
  Country.georgia,
  Country.norway,
  Country.ukraine,
  Country.france,
  Country.sweden,
  Country.southafrica,
  Country.unitedstates,
]);

export const COUNTRY_CODES: Record<Country, CountryCode> = {
  [Country.germany]: "DE",
  [Country.austria]: "AT",
  [Country.switzerland]: "CH",
  [Country.unitedkingdom]: "UK",
  [Country.netherlands]: "NL",
  [Country.europeanunion]: "EU",
  [Country.estonia]: "EE",
  [Country.czechrepublic]: "CZ",
  [Country.latvia]: "LV",
  [Country.australia]: "AU",
  [Country.serbia]: "RS",
  [Country.croatia]: "HR",
  [Country.canada]: "CA",
  [Country.georgia]: "GE",
  [Country.norway]: "NO",
  [Country.ukraine]: "UA",
  [Country.france]: "FR",
  [Country.sweden]: "SE",
  [Country.southafrica]: "ZA",
  [Country.unitedstates]: "US",
};

export const countryCodesToCountry: Record<string, Country> =
  Object.fromEntries(
    Object.entries(COUNTRY_CODES).map(([country, code]) => [
      code,
      country as Country,
    ]),
  );

export const getCountryName = (
  country: { code: CountryCode },
  t: (key: CountryCode) => string,
): string => {
  return t(country.code);
};

export const getReferencingCountryName = (
  country: { code: CountryCode },
  t: (key: CountryCode) => string,
): string => {
  return t(country.code);
};

export type Countries =
  | "??"
  | "DE"
  | "DK"
  | "CH"
  | "TH"
  | "AT"
  | "UK"
  | "NL"
  | "EU"
  | "LV"
  | "ES"
  | "FI"
  | "HR"
  | "BE"
  | "LU"
  | "SI"
  | "EE"
  | "FR"
  | "IE"
  | "IT"
  | "PL"
  | "RO"
  | "CY"
  | "MT"
  | "PT"
  | "LT"
  | "HU"
  | "CZ"
  | "SG"
  | "MC"
  | "SE"
  | "AD"
  | "IM"
  | "NO"
  | "LI"
  | "MK"
  | "AL"
  | "MD"
  | "SM"
  | "FO"
  | "BA"
  | "ME"
  | "BG"
  | "BY"
  | "GR"
  | "IS"
  | "SK"
  | "UA"
  | "GB"
  | "RS"
  | "AU"
  | "ZA"
  | "US"
  | "CA"
  | "GE"
  | "NZ"
  | "VE";

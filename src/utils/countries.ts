import type { StrictNamespacedTranslator } from "@/utils/translator";

import type En from "../messages/en.json";

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
  t: StrictNamespacedTranslator<"countries">,
): string => {
  return t(country.code);
};

export const getReferencingCountryName = (
  country: { code: CountryCode },
  t: StrictNamespacedTranslator<"ref_countries">,
): string => {
  return t(country.code);
};

export type Countries = keyof typeof En.countries;

import type { LambertConformalConicParams } from "./map";
import type {
  DonorFilter,
  IsoDate,
  Party,
  ReceiverFilter,
  ReceiverId,
} from "./types";
import type En from "../messages/en.json";
import type { NonEmptyArray } from "@/utils/array";
import type { StrictNamespacedTranslator } from "@/utils/translator";

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
  | "NO";

export type Currency =
  | "EUR"
  | "CHF"
  | "GBP"
  | "CZK"
  | "AUD"
  | "RSD"
  | "CAD"
  | "GEL"
  | "NOK";

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
]);

export interface CountryConfig {
  id: Country;
  years: string[];
  // This is sorted by sum. Meaning first entry is the party with the highest sum of donations.
  parties: Party[];
  partiesById: Record<ReceiverId, Party>;
  legislativeYears: NonEmptyArray<NonEmptyArray<string>>;
  preliminaryDataSince?: string;
  minPublicDonationAmount: number;
  source: { name: string; url: string };
  currency: Currency;
  code: CountryCode;
  minYear: string;
  markers: {
    label: string;
    dates: IsoDate[];
  };
  // list of iso state codes
  states: readonly string[];
  wikiCountry: "en" | "de";
  // true if the country has donations with a date containing more than the year
  hasDate: boolean;
  // true if the country has donations with information about their origin
  hasOrigin: boolean;
  // true if the country can display donations in a timeline
  hasTimeline: boolean;
  // true if the donation dataset provides donor type information
  hasDonorType?: boolean;

  knownPartyRequirements?: {
    count: number;
    sum: number;
  };

  // Lambert Conformal Conic projection parameters for the country
  projection?: LambertConformalConicParams;

  // filter out donations by donor
  donorFilters?: DonorFilter[];

  // filtered out donation receivers
  receiverFilters?: ReceiverFilter[];
}

export type UnloadedCountryConfig = Omit<
  CountryConfig,
  "years" | "parties" | "partiesById" | "donations" | "wikipedia"
>;

export const COUNTRY_CONFIG: Record<Country, UnloadedCountryConfig> = {
  [Country.germany]: {
    id: Country.germany,
    minYear: "2010",
    preliminaryDataSince: "2026",
    legislativeYears: [
      ["2010", "2011", "2012", "2013"],
      ["2014", "2015", "2016", "2017"],
      ["2018", "2019", "2020", "2021"],
      ["2022", "2023", "2024", "2025"],
    ],
    hasTimeline: true,
    hasOrigin: true,
    hasDate: true,
    minPublicDonationAmount: 35_000,
    currency: "EUR",
    source: {
      name: "Deutscher Bundestag",
      url: "https://www.bundestag.de/parlament/praesidium/parteienfinanzierung/fundstellen50000/",
    },
    code: "DE",
    wikiCountry: "de",
    markers: {
      label: "Bundestagswahl",
      dates: ["2013-09-22", "2017-09-24", "2021-09-26", "2025-02-23"],
    },
    states: [
      "BW",
      "BY",
      "BE",
      "BB",
      "HB",
      "HH",
      "HE",
      "MV",
      "NI",
      "NW",
      "RP",
      "SL",
      "SN",
      "ST",
      "SH",
      "TH",
    ],
    projection: {
      phi1: 48,
      phi2: 54,
      phi0: 51,
      lambda0: 10,
    },
  },
  [Country.austria]: {
    id: Country.austria,
    minYear: "2012",
    preliminaryDataSince: "2025",
    legislativeYears: [
      ["2014", "2015", "2016", "2017"],
      ["2018", "2019"],
      ["2020", "2021", "2022", "2023", "2024"],
    ],
    hasTimeline: true,
    hasOrigin: true,
    hasDate: true,
    minPublicDonationAmount: 540,
    currency: "EUR",
    source: {
      name: "Rechnungshof Österreich",
      url: "https://www.rechnungshof.gv.at/Parteispenden",
    },
    code: "AT",
    wikiCountry: "de",
    markers: {
      label: "Nationalratswahlen",
      dates: ["2013-09-29", "2017-08-15", "2019-09-29", "2024-09-29"],
    },
    states: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    projection: {
      phi1: 49,
      phi2: 46,
      phi0: 47.5,
      lambda0: 13.3333333333333,
    },
    receiverFilters: [
      "^Personenkomitee",
      "^Verein Dialog Lebenswertes Altaussee",
      "^Liste Madeleine Petrovic",
    ],
  },
  [Country.switzerland]: {
    id: Country.switzerland,
    minYear: "2023",
    legislativeYears: [
      ["2020", "2021", "2022", "2023"],
      ["2024", "2025", "2026", "2027"],
    ],
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    minPublicDonationAmount: 5_000,
    currency: "CHF",
    source: {
      name: "Eidgenössische Finanzkontrolle",
      url: "https://politikfinanzierung.efk.admin.ch/app/de/exports/elections",
    },
    code: "CH",
    wikiCountry: "de",
    markers: {
      label: "Nationalratswahlen",
      dates: ["2023-10-22"],
    },
    states: [],
  },
  [Country.netherlands]: {
    id: Country.netherlands,
    minYear: "2022",
    preliminaryDataSince: "2025",
    legislativeYears: [["2022", "2023", "2024", "2025"]],
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    minPublicDonationAmount: 1_000,
    currency: "EUR",
    source: {
      name: "Rijksoverheid",
      url: "https://www.rijksoverheid.nl/documenten?trefwoord=%22giften+aan+politieke+partijen%22&startdatum=&einddatum=&onderdeel=Alle+ministeries&type=Alle+documenten",
    },
    code: "NL",
    wikiCountry: "en",
    markers: {
      label: "Tweede Kamerverkiezingen",
      dates: ["2023-11-22", "2025-10-29"],
    },
    states: [],
  },
  [Country.estonia]: {
    id: Country.estonia,
    minYear: "2014",
    preliminaryDataSince: "2025",
    legislativeYears: [
      ["2012", "2013", "2014", "2015"],
      ["2016", "2017", "2018", "2019"],
      ["2020", "2021", "2022", "2023"],
      ["2024", "2025", "2026", "2027"],
    ],
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    minPublicDonationAmount: 1,
    currency: "EUR",
    source: {
      name: "ERJK",
      url: "https://www.erjk.ee/en",
    },
    code: "EE",
    wikiCountry: "en",
    markers: {
      label: "Riigikogu valimised",
      dates: ["2015-03-01", "2019-03-03", "2023-03-05", "2027-03-07"],
    },
    states: [],
  },
  [Country.czechrepublic]: {
    id: Country.czechrepublic,
    minYear: "2018",
    preliminaryDataSince: "2024",
    legislativeYears: [
      ["2018", "2019", "2020", "2021"],
      ["2022", "2023", "2024", "2025"],
    ],
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    hasDonorType: true,
    minPublicDonationAmount: 25, // approx 1 eur
    currency: "CZK",
    source: {
      name: "ÚDHPSH",
      url: "https://www.udhpsh.cz/vyrocni-financni-zpravy-stran-a-hnuti",
    },
    code: "CZ",
    wikiCountry: "en",
    markers: {
      label: "Volby do PS PČR",
      dates: ["2021-10-09", "2025-09-27"],
    },
    states: [],
    // parties less than 100 donations or 1mio CZK are skipped
    knownPartyRequirements: {
      sum: 1_000_000,
      count: 100,
    },
  },
  [Country.latvia]: {
    id: Country.latvia,
    minYear: "2015",
    preliminaryDataSince: "2026",
    legislativeYears: [
      ["2015", "2016", "2017", "2018"],
      ["2019", "2020", "2021", "2022"],
      ["2023", "2024", "2025", "2026"],
    ],
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    minPublicDonationAmount: 1.0,
    currency: "EUR",
    source: {
      name: "KNAB",
      url: "https://info.knab.gov.lv/lv/db",
    },
    code: "LV",
    wikiCountry: "en",
    markers: {
      label: "Saeimas vēlēšanas",
      dates: ["2018-10-06", "2022-10-01", "2026-10-03"],
    },
    states: [],
    knownPartyRequirements: {
      count: 100,
      sum: 25_000,
    },
  },
  [Country.europeanunion]: {
    id: Country.europeanunion,
    minYear: "2018",
    preliminaryDataSince: "2025",
    legislativeYears: [
      ["2018", "2019"],
      ["2020", "2021", "2022", "2023", "2024"],
    ],
    hasTimeline: false,
    hasOrigin: true,
    hasDate: false,
    minPublicDonationAmount: 1,
    currency: "EUR",
    source: {
      name: "APPF",
      url: "https://www.appf.europa.eu/appf/en/donations-and-contributions#website-body",
    },
    code: "EU",
    wikiCountry: "en",
    markers: {
      label: "Elections to the European Parliament",
      dates: ["2019-05-26", "2024-06-09"],
    },
    states: [
      "AT",
      "BE",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
    ],
    projection: {
      phi1: 35,
      phi2: 65,
      phi0: 52,
      lambda0: 10,
    },
  },
  [Country.unitedkingdom]: {
    id: Country.unitedkingdom,
    minYear: "2010",
    preliminaryDataSince: "2025",
    legislativeYears: [
      ["2011", "2012", "2013", "2014", "2015"],
      ["2016", "2017"],
      ["2018", "2019"],
      ["2020", "2021", "2022", "2023", "2024"],
      ["2025", "2026", "2027", "2028", "2029"],
    ],
    hasDate: true,
    hasTimeline: true,
    hasOrigin: false,
    hasDonorType: true,
    minPublicDonationAmount: 1000,
    currency: "GBP",
    wikiCountry: "en",
    source: {
      name: "Electoral Commission",
      url: "https://search.electoralcommission.org.uk/",
    },
    code: "UK",
    markers: {
      label: "General Election",
      dates: [
        "2010-05-06",
        "2015-05-07",
        "2017-06-08",
        "2019-12-12",
        "2024-07-04",
      ],
    },
    states: [],
    donorFilters: [
      ".*electoral commission.*",
      ".*house of commons.*",
      "house of lords",
      "parliamentary office.*",
      ".*parliament",
      ".*assembly",
    ],
    receiverFilters: [
      ".*De-registered.*",
      // can't find any information on these parties
      "^Life$",
      "^Both Unions Party of Northern Ireland$",
      "^Hersham Village Society$",
      "^Solihull and Meriden Residents Association$",
    ],
  },
  [Country.australia]: {
    id: Country.australia,
    minYear: "2014",
    preliminaryDataSince: "2025",
    legislativeYears: [
      ["2014", "2015", "2016"],
      ["2017", "2018", "2019"],
      ["2020", "2021", "2022"],
      ["2023", "2024", "2025"],
    ],
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    hasDonorType: true,
    minPublicDonationAmount: 1,
    currency: "AUD",
    source: {
      name: "AEC",
      url: "https://transparency.aec.gov.au/Download",
    },
    code: "AU",
    wikiCountry: "en",
    markers: {
      label: "Federal election",
      dates: ["2016-07-02", "2019-05-18", "2022-05-21", "2025-05-03"],
    },
    states: [],
    donorFilters: [
      ".*electoral commission.*",
      ".*commonwealth of australia.*",
      ".*tax(?:ation)? office.*",
      "^ato$",
      "^department of .*",
      "^aec$",
      "labor (?:holdings|services)",
      ".*federal secretariat$",

      // party names
      ".*liberal party.*",
      ".*labor party.*",
      ".*national party.*",
      ".*liberal democratic party.*",
      ".*australian greens.*",
      ".* greens$",
      "^country labor party.*",
      "^australian labor party.*",
      ".*legislative assembly.*",
      ".*branch alp$",
      ".*labor party$",
      "^the nationals$",
      "^LNP Nominees.*",
      "^alp .*",
      "^liberal national party",
      "john mcewen house",
      "cormack foundation",
    ],
    receiverFilters: [
      "^Enterprise 500$",
      "^NEN$",
      "^Glenn Lazarus Team$",
      "^Liberal Vic, Kooyong Electorate Conference$",
      "^STURT FEC$",
      "^Glen Lazarus Team - GLT$",
      "^Australian Recreational Fishers Party$",
      "^GLT$",
      "^Help End Marijuana Prohibition \\(HEMP\\) Party$",
      "^CLPNT$",
      "^ONA - FED$",
      "^SPP$",
      "^CLR-NSW$",
      "^ONA$",
      "^CFMEU - Construction & General Division, National Office$",
      "^Peninsular Independent Ltd$",
      "^Cherish Life Queensland Inc$",
      "^KP Independents Limited$",
      "^CFMMEU - Mining & Energy Division - National Office$",
      "^Kim for Canberra$",
      "^Antony Pasin MP$",
      "^The Local Party of Australia$",
      "^Andrew Wilkie$",
      "^Rex Patrick Team$",
      "^ALLEGRA FOR WENTWORTH PTY LTD$",
      "^Helen Haines$",
      "^Australian Youth Climate Coalition$",
      "^It's Note A Race Limited$",
      "^Zali Steggall$",
      "^Senator Dean Smith$",
      "^Ms Zali Steggall MP$",
      "^Allegra Spender MP$",
      "^Ms Allegra Spender MP$",
      "^Allegra for Wentworth Pty Ltd$",
      "^Dr Monique Ryan MP$",
      "^Ms Zoe Daniel MP$",
      "^Zoe Daniels$",
      "^Dr Sophie Scamps MP$",
      "^Ms Kate Chaney MP$",
      "^Kylea Tink Independent Limited$",
      "^Hon Tanya Plibersek MP$",
      "^Hon Daniel Tehan MP$",
      "^Hon Peter Dutton MP$",
      "^ACTU$",
      "^500 Club$",
      "^ACCI$",
      "^Mr Jerome Laxale MP$",
      "^Hon Andrew Hastie MP$",
      "^Francine For Fairfax$",
      "^Senator Andrew Bragg$",
      "^Dai Le & Frank Carbone W.S.C.$",
      "^Ms Zoe McKenzie MP$",
      "^Senator Jane Hume$",
      "^QJ Collective Limited$",
      "^Ms Zali Steggall OAM MP$",
      "^Regional Voices Fund Pty Ltd$",
      "^JOBS FOR MINING COMMUNITIES PTY LTD$",
      "^Hon Angus Taylor MP$",
      "^HOTHOUSEMAG PTY LTD$",
      "^Voices of Fisher$",
      "^Ryan, Monique Marie$",
      "^Hon Dr Andrew Charlton MP$",
      "^Farming Families and Communities WA Ltd$",
      "^ENERGY FOR AUSTRALIANS INCORPORATED$",
      "^Hon David Coleman MP$",
      "^NSW Nurses & Midwives Association$",
    ],
  },
  [Country.serbia]: {
    id: Country.serbia,
    minYear: "2015",
    preliminaryDataSince: "2023",
    legislativeYears: [
      ["2017", "2018", "2019", "2020", "2021", "2022"],
      ["2023"],
      ["2024", "2025", "2026", "2027"],
    ],
    hasTimeline: false,
    hasOrigin: false,
    hasDate: false,
    minPublicDonationAmount: 400,
    currency: "RSD",
    source: {
      name: "CINS",
      url: "https://www.cins.rs/baze-podataka/stranacka-kasa-2024/pretrazi-bazu/",
    },
    code: "RS",
    wikiCountry: "en",
    markers: {
      label: "Parlamentarni izbori",
      dates: ["2016-04-24", "2020-06-01", "2022-04-03", "2023-12-17"],
    },
    states: [],
    receiverFilters: [
      "^Vuk Jeremić, grupa građana",
      "^Dragan Đilas, grupa građana \\(Beograd\\)",
    ],
  },
  [Country.croatia]: {
    id: Country.croatia,
    minYear: "2019",
    preliminaryDataSince: "2025",
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    minPublicDonationAmount: 1,
    currency: "EUR",
    source: {
      name: "Državno izborno povjerenstvo",
      url: "https://www.izbori.hr/site/nadzor-financiranja/redovito-financiranje/financijska-izvjesca-subjekata-nad-kojima-se-provodi-redoviti-nadzor-financiranja/1996",
    },
    legislativeYears: [
      ["2017", "2018", "2019", "2020"],
      ["2021", "2022", "2023", "2024"],
    ],
    code: "HR",
    wikiCountry: "en",
    markers: {
      label: "Parlamentarni izbori",
      dates: ["2016-09-11", "2020-07-05", "2024-04-17"],
    },
    states: [],
    knownPartyRequirements: {
      sum: 10_000,
      count: 100,
    },
  },
  [Country.canada]: {
    id: Country.canada,
    minYear: "2015",
    preliminaryDataSince: "2025",
    legislativeYears: [
      ["2016", "2017", "2018", "2019"],
      ["2020", "2021"],
      ["2022", "2023", "2024", "2025"],
    ],
    hasTimeline: true,
    hasOrigin: true,
    hasDate: true,
    minPublicDonationAmount: 500,
    currency: "CAD",
    source: {
      name: "Elections Canada",
      url: "https://www.elections.ca/",
    },
    code: "CA",
    wikiCountry: "en",
    markers: {
      label: "Federal election",
      dates: ["2015-10-19", "2019-10-21", "2021-09-20", "2025-04-28"],
    },
    states: [
      "ON",
      "QC",
      "NS",
      "NB",
      "MB",
      "BC",
      "PE",
      "SK",
      "AB",
      "NL",
      "NT",
      "YT",
      "NU",
    ],
    knownPartyRequirements: {
      sum: 10_000,
      count: 10,
    },
    projection: {
      phi1: 49,
      phi2: 77,
      phi0: 49,
      lambda0: -95,
    },
  },
  [Country.georgia]: {
    id: Country.georgia,
    minYear: "2011",
    preliminaryDataSince: "2026",
    hasTimeline: true,
    hasOrigin: false,
    hasDate: true,
    hasDonorType: true,
    minPublicDonationAmount: 1,
    currency: "GEL",
    source: {
      name: "ანტიკორუფციული ბიურო",
      url: "https://monitoring.acb.gov.ge/",
    },
    legislativeYears: [
      ["2013", "2014", "2015", "2016"],
      ["2017", "2018", "2019", "2020"],
      ["2021", "2022", "2023", "2024"],
    ],
    code: "GE",
    wikiCountry: "en",
    markers: {
      label: "საპარლამენტო არჩევნები",
      dates: ["2012-10-01", "2016-10-08", "2020-10-31", "2024-10-26"],
    },
    states: [],
    knownPartyRequirements: {
      sum: 50_000,
      count: 100,
    },
  },
  [Country.norway]: {
    id: Country.norway,
    minYear: "2014",
    preliminaryDataSince: "2024",
    hasTimeline: false,
    hasOrigin: false,
    hasDate: false,
    hasDonorType: false,
    minPublicDonationAmount: 500,
    currency: "NOK",
    source: {
      name: "Partifinansiering.no",
      url: "https://www.partifinansiering.no/en/annual-donations/",
    },
    legislativeYears: [
      ["2014", "2015", "2016", "2017"],
      ["2018", "2019", "2020", "2021"],
      ["2022", "2023", "2024", "2025"],
    ],
    code: "NO",
    wikiCountry: "en",
    markers: {
      label: "Stortingsvalg",
      dates: ["2013-09-09", "2017-09-11", "2021-09-13", "2025-09-08"],
    },
    states: [],
  },
};

export const countryCodesToCountry: Record<string, Country> =
  Object.fromEntries(
    Object.entries(COUNTRY_CONFIG).map(([country, config]) => [
      config.code,
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

export const getParty = (
  country: CountryConfig,
  partyId: ReceiverId,
): Party => {
  if (!country.partiesById[partyId]) {
    console.error(`Unknown party ${partyId} (${country.id})`);
  }
  return country.partiesById[partyId];
};

export const findCorrectParty = (
  country: CountryConfig,
  possiblePartyId: string,
): Party | undefined => {
  const normalizedPartyId = possiblePartyId
    .toUpperCase()
    // remove anything that's not letter or number
    .replace(/[^A-Z0-9]/g, "")
    .trim();
  return country.partiesById[normalizedPartyId as ReceiverId];
};

export type Countries = keyof typeof En.countries;

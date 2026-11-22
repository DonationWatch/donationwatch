import type {
  DonorMetaDefinition,
  DonorMetaItem,
} from "@donationwatch/core/utils/types";

import { RelationKind } from "@donationwatch/core/utils/types";

import { AUSTRALIAN_DONOR_INTERESTS_BY_NAME } from "./donor-interests";

const manualDonors: Record<string, DonorMetaItem> = {
  "Woodside Energy Group Ltd": { wiki: 1193774 },
  "Hancock Prospecting Pty Ltd": { wiki: 16692060 },
  "Mineral Resources Ltd": { wiki: 68719254 },
  "Minerals Council of Australia": { wiki: 21000969 },
  "Mineralogy Pty Ltd": { wiki: 31572969 },
  "Queensland Nickel Pty Ltd": { wiki: 49107758 },
  "Waratah Coal Pty Ltd": { wiki: 70410594 },
  "APPEA Limited trading as Australian Energy Producers": { wiki: 29164194 },
  "Manildra Group": { wiki: 50552412 },
  "Meriton Properties Pty Ltd": { wiki: 40634887 },
  "Linfox Australia Pty Ltd": { wiki: 4007428 },
  "ANZ Banking Group Ltd": { wiki: 943547 },
  "Westpac Banking Corporation": { wiki: 19283753 },
  "Macquarie Group Ltd": { wiki: 14612402 },
  PricewaterhouseCoopers: { wiki: 148172 },
  "Ernst & Young": { wiki: 59906 },
  "KPMG Australia": { wiki: 75960 },
  "Craven, Edward James": { wiki: 73972300 },
  "Sarina Russo": { wiki: 33687353 },
  "Sarina Russo Group": { wiki: 33687353 },
  "TABCORP HOLDINGS Ltd": { wiki: 1164511 },
  "Australian Hotels Association": { wiki: 12899056 },
  ClubsNSW: { wiki: 77224482 },
  "Woolworths Group Ltd": { wiki: 514888 },
  "Wesfarmers Ltd": { wiki: 2497264 },
  "Village Roadshow Pty Ltd": { wiki: 973837 },
  "SingTel Optus Pty Ltd": { wiki: 358933 },
  "MACQUARIE TECHNOLOGY GROUP LTD": { wiki: 19955864 },
  "Cannon-Brookes, Michael": { wiki: 34523717 },
  "Wall OAM, Pamela": { wiki: 81205881 },
  "The Pratt Foundation": { wiki: 7407174 },
  "The Pharmacy Guild of Australia": { wiki: 26971699 },
  "Seven West Media Ltd": { wiki: 31651817 },
  "Nioa Nominees PTY LTD ATF Bill Nioa Family Trust": { wiki: 69291199 },
  "Pratt Holdings Pty Ltd": { wiki: 13529427 },
  "BlueScope Steel Ltd": { wiki: 234290 },
  "Construction, Forestry, Maritime, Mining & Energy Union (CFMEU)": {
    wiki: 2116960,
  },
  "Australian Workers Union (AWU)": { wiki: 1634386 },
  "Electrical Trades Union of Australia (ETU)": { wiki: 3211810 },
  "Electrical Trades Union of Australia - Victorian Branch": { wiki: 3211810 },
  "Communications, Electrical and Plumbing Union (CEPU)": { wiki: 3133128 },
  "Communications, Electrical and Plumbing Union - Electrical, Energy and Services Division":
    { wiki: 3133128 },
  "Health and Community Services Union (HSU)": { wiki: 19226652 },
  "Health Services Union (HSU)": { wiki: 2116789 },
  "Cormack Foundation Pty Ltd": { wiki: 13100713 },
  "Australian Services Union (ASU)": { wiki: 2116891 },
  "Transport Workers' Union of Australia (TWU)": { wiki: 2334278 },
  "Australian Education Union (AEU)": { wiki: 1106551 },
  "Australian Manufacturing Workers Union (AMWU)": { wiki: 1123088 },
  "Community and Public Sector Union (CPSU)": { wiki: 2117245 },
  "United Workers Union (UWU)": { wiki: 61739780 },
  "National Tertiary Education Union (NTEU)": { wiki: 1088595 },
  "Independent Education Union of Australia (IEU)": { wiki: 2117338 },
  "Australasian Meat Industry Employees Union (AMIEU)": { wiki: 1103542 },
  "National Union of Workers (NUW)": { wiki: 1861423 },
  "United Voice": { wiki: 2117193 },
  "Maritime Union of Australia (MUA)": { wiki: 2018949 },
  "Australian Nursing and Midwifery Federation (ANMF)": { wiki: 2116855 },
  "Australian Rail Tram and Bus Industry Union (RTBU)": { wiki: 1966395 },
  "Finance Sector Union (FSU)": { wiki: 2368133 },
  "Communication Workers Union of Australia (CEPU)": { wiki: 5642392 },
  "Public Service Association (PSA)": { wiki: 268933 },
  "United Firefighters Union of Australia (UFUA)": { wiki: 5651202 },
  "Mining and Energy Union (MEU)": { wiki: 75415415 },
  "Queensland Council of Unions (QCU)": { wiki: 1944405 },
  "Holmes a Court, Simon": { wiki: 70066069 },
  "Palmer, Clive Frederick": { wiki: 24092567 },
  "Gillespie, Lesley": { wiki: 3090612 },
  "Gillespie, Roger": { wiki: 3090612 },
  "Shop, Distributive and Allied Employees' Association (SDA)": {
    wiki: 1086161,
    interests: AUSTRALIAN_DONOR_INTERESTS_BY_NAME["SDA"],
  },
};

const donors: Record<string, DonorMetaItem> = {};
for (const [name, meta] of Object.entries(manualDonors)) {
  donors[name] = { ...meta };
}
for (const [name, interests] of Object.entries(
  AUSTRALIAN_DONOR_INTERESTS_BY_NAME,
)) {
  donors[name] = {
    ...donors[name],
    interests: donors[name]?.interests ?? interests,
  };
}

export const donorMeta: DonorMetaDefinition = {
  donors,
  relations: [
    [
      ["The Pratt Foundation", RelationKind.company],
      ["Pratt Holdings Pty Ltd", RelationKind.company],
    ],

    [
      ["Mineralogy Pty Ltd", RelationKind.company],
      ["Queensland Nickel Pty Ltd", RelationKind.company],
      ["Queensland Nickel Sales Pty Ltd", RelationKind.company],
      ["Waratah Coal Pty Ltd", RelationKind.company],
      ["Palmer Coolum Resort Pty Ltd", RelationKind.company],
      ["Palmer Leisure Australia Pty Ltd", RelationKind.company],
      ["Palmer, Clive Frederick", RelationKind.owner],
    ],

    [
      ["Palmer, Clive Frederick", RelationKind.family],
      ["Palmer, Anna", RelationKind.family],
    ],

    [
      ["Gillespie, Lesley", RelationKind.family],
      ["Gillespie, Roger", RelationKind.family],
    ],

    [
      ["Benedet, Gerard", RelationKind.owner],
      ["The Pharmacy Guild of Australia", RelationKind.company],
    ],

    [
      ["Randazzo Properties NT Pty Ltd", RelationKind.company],
      ["Randazzo C & G Development", RelationKind.company],
    ],

    [
      ["Mousellis & Sons Pty Ltd", RelationKind.company],
      ["Mousellis Nominees Pty Ltd", RelationKind.company],
    ],

    [
      ["Hancock Prospecting Pty Ltd", RelationKind.company],
      ["Hancock Coal Infrastructure Pty Ltd", RelationKind.company],
    ],

    // O’Neil family
    [
      ["Nedigi Pty Ltd", RelationKind.company],
      ["Sixmilebridge Pty Ltd", RelationKind.company],
      ["Nedigi Pty Ltd", RelationKind.company],
      ["Willimbury Pty Ltd", RelationKind.company],
    ],

    // NIOA
    [
      [
        "Nioa Nominees PTY LTD ATF Bill Nioa Family Trust",
        RelationKind.company,
      ],
      ["Nioa, Elizabeth", RelationKind.family],
    ],

    // Sarina Russo
    // [
    //   ["Sarina Russo Group", RelationKind.company],
    //   ["Sarina Russo", RelationKind.owner],
    // ],
  ],
};

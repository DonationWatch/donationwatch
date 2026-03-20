import { beforeEach, expect, test } from "vitest";

import type { Countries } from "@/utils/countries";
import type { ReceiverId } from "@/utils/types";

import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData } from "../../tasks/load-data/data-loader";

import { DeLoader, extractDate } from "../../tasks/load-data/de/de-loader";

let loader: DeLoader;

const extractedDonation = ({
  amount,
  name,
  date,
  receiver,
  address,
}: {
  amount: number;
  name: string;
  date: string;
  receiver: string;
  address: { country: string; state: string; zip: string };
}): Omit<ExtractedYearData, "idx"> => ({
  [DonationField.Amount]: amount,
  [DonationField.DonorName]: name,
  [DonationField.Date]: date,
  [DonationField.Receiver]: receiver as ReceiverId,
  [DonationField.Address]: {
    [AddressField.Country]: address.country as Countries,
    [AddressField.State]: address.state,
    [AddressField.Zip]: address.zip,
  },
});

beforeEach(() => {
  loader = new DeLoader();
});

test.each([
  [
    "commonly formatted donation",
    "2024",
    {
      tr: 0,
      columns: [
        ["FDP"],
        ["50.001 Euro"],
        ["Philip Harting", "Hubertusweg 21", "32312 Lübbecke"],
        ["10.12.2024"],
        ["11.12.2024 Drs. ", "20/14692"],
      ],
    },
    {
      amount: 50_001,
      name: "Philip Harting",
      date: "2024-12-10",
      receiver: "FDP",
      address: {
        country: "DE",
        state: "NW",
        zip: "32312",
      },
    },
  ],

  // removed donation
  [
    "removed donation",
    "2025",
    {
      tr: 0,
      columns: [
        ["AfD"],
        ["ca. 58.750 Euro"],
        [
          "Prof. Dr. Winfried Stöcker",
          "Am Sonnenberg 9",
          "23627 Groß Grönau ",
          "Nach nochmaliger Prüfung der hinter dem Betrag stehenden Postwurfaktion ist die Bundestagsverwaltung zu dem Ergebnis gekommen, dass es sich hierbei nicht um eine Werbemaßnahme im Sinne von § 27a Parteiengesetz handelte, sondern um eine Meinungsäußerung im Sinne von § 27 Absatz 1a Satz 5 Parteiengesetz.",
        ],
        ["25.02.2025"],
        ["26.02.2025 ", "Drs. 21/200"],
      ],
    },
    undefined,
  ],

  // edge case with weird date
  [
    "date with additional comment",
    "2024",
    {
      tr: 0,
      columns: [
        ["CDU"],
        ["75.000 Euro"],
        [
          "Philip Harting ",
          "Familienstiftung",
          "Bernhard-Wicki-Str. 8",
          "80636 München",
        ],
        [
          "12.12.2025(25.000 ­Euro hiervon am 15.12.2025)",
          "(25.000 ­Euro hiervon am 15.12.2025)",
        ],
        ["15.12.2025", "(Nach­meldung am 15.01.2026)"],
      ],
    },
    {
      amount: 75_000,
      name: "Philip Harting Familienstiftung",
      date: "2025-12-12",
      receiver: "CDU",
      address: {
        country: "DE",
        state: "BY",
        zip: "80636",
      },
    },
  ],

  // joined date donation
  [
    "date with joined days (2)",
    "2010",
    {
      tr: 0,
      columns: [
        ["CDU"],
        ["60.001"],
        ["Allianz SE", "Königinstraße 28", "80802 München"],
        ["10./13.08.2010"],
        ["13.08.2010", "Drs. ", "17/2820"],
      ],
    },
    {
      amount: 60_001,
      name: "Allianz SE",
      date: "2010-08-13",
      receiver: "CDU",
      address: {
        country: "DE",
        state: "BY",
        zip: "80802",
      },
    },
  ],
  [
    "date with joined days (3)",
    "2025",
    {
      tr: 0,
      columns: [
        ["CDU"],
        ["180.000 Euro"],
        [
          "Deutsche Vermögensberatung ",
          "­",
          "Aktiengesellschaft DVAG",
          "Wilhelm-Leuschner-Straße 24",
          "60329 Frankfurt am Main",
        ],
        ["18./20./24.10. 2025"],
        ["28.10.2025", "Drs. ", "21/3536"],
      ],
    },
    {
      amount: 180_000,
      name: "Deutsche Vermögensberatung  ­ Aktiengesellschaft DVAG",
      date: "2025-10-24",
      receiver: "CDU",
      address: {
        country: "DE",
        state: "HE",
        zip: "60329",
      },
    },
  ],
  [
    "two dates",
    "2016",
    {
      tr: 0,
      columns: [
        ["SPD"],
        ["90.000,00"],
        ["Evonik Industries AG", "Rellinghauser Straße 1 - 11", "45128 Essen"],
        ["26.10.2016/", "09.11.2016"],
        ["11.11.2016", "Drs. ", "18/10597"],
      ],
    },
    {
      amount: 90_000,
      name: "Evonik Industries AG",
      date: "2016-11-09",
      receiver: "SPD",
      address: {
        country: "DE",
        state: "NW",
        zip: "45128",
      },
    },
  ],
])(`extracts %s`, (_title, year, data, expected) => {
  const extracted = loader.transformRawDonation(data, year);
  expect(extracted).toEqual(
    typeof expected === "undefined"
      ? undefined
      : expect.objectContaining(extractedDonation(expected)),
  );
});

test.each([
  [["2010", ["23.12.2010"]], "2010-12-23"],
  [["2010", ["10./13.08.2010"]], "2010-08-13"],
  [["2010", ["10./12.08.2010"]], "2010-08-12"],
  [["2013", ["06.-08.08.2013"]], "2013-08-08"],
  [["2014", ["23./24.09.2014"]], "2014-09-24"],
  [["2016", ["26.10.2016/", "09.11.2016"]], "2016-11-09"],
  [["2022", ["31.12."]], "2022-12-31"],
  [
    ["2025", ["12.12.2025", "(25.000 ­Euro hiervon am 15.12.2025)"]],
    "2025-12-12",
  ],
  [["2025", ["24./ 26.11.2025"]], "2025-11-26"],
  [["2025", ["18./20./24.10. 2025"]], "2025-10-24"],
  [["2024", ["15.1.2024"]], "2024-01-15"],
  [["2024", ["8.1.2024"]], "2024-01-08"],
] as [[string, string[]], string][])(
  `extracts date variant %s`,
  ([year, html], expected) => {
    expect(extractDate(year, html)).toBe(expected);
  },
);

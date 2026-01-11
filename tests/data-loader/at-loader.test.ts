import { expect, test, beforeEach, describe } from "vitest";

import { AtLoader } from "../../tasks/load-data/at/at-loader";

import { DonationField } from "@/utils/types";

let loader: AtLoader;

beforeEach(() => {
  loader = new AtLoader();
});

describe("AT loader extractors", () => {
  test.each([
    // 2012 format: [date, amount, donor, address, receiver]
    [
      "2012 format donation",
      "2012",
      ["01.05.12", "50.000,00", "Hans Mustermann", "1010 Wien", "ÖVP"],
      0,
      {
        amount: 50000,
        name: "Hans Mustermann",
        date: "2012-05-01",
        receiver: "ÖVP",
      },
    ],

    // 2019 format: [date, name, amount, currency, receiver] - skip header
    [
      "2019 format donation",
      "2019",
      ["15.03.19", "Max Muster", "25.000,00", "Euro", "FPÖ"],
      1, // idx > 0 to skip header check
      {
        amount: 25000,
        name: "Max Muster",
        date: "2019-03-15",
        receiver: "FPÖ",
      },
    ],
    [
      "2019 format header row returns undefined",
      "2019",
      ["Datum", "Name", "Betrag", "Währung", "Empfänger"],
      0,
      undefined,
    ],

    // 2022 format: [receiverParty, date, name, amount, currency]
    [
      "2022 format donation",
      "2022",
      ["SPÖ", "20.06.22", "Maria Schmidt", "100.000,50", "Euro"],
      2, // idx > 1 to skip header check
      {
        amount: 100000.5,
        name: "Maria Schmidt",
        date: "2022-06-20",
        receiver: "SPÖ",
      },
    ],

    // 2023 format: [receiverParty, ?, date, name, zip, amount, currency]
    [
      "2023 format donation",
      "2023",
      ["NEOS", "", "10.11.23", "Test Donor", "1010", "75.000,00", "EUR"],
      1, // idx > 0 to skip header check
      {
        amount: 75000,
        name: "Test Donor",
        date: "2023-11-10",
        receiver: "NEOS",
      },
    ],

    // 2024 format: [receiverParty, ?, date, name, zip, amount, ?, receiverName]
    [
      "2024 format donation",
      "2024",
      [
        "Die Grünen – Die Grüne Alternative",
        "",
        "05.02.24",
        "Green Donor",
        "1020",
        "60.000,00",
        "EUR",
        "",
      ],
      1,
      {
        amount: 60000,
        name: "Green Donor",
        date: "2024-02-05",
        receiver: "Die Grünen – Die Grüne Alternative",
      },
    ],
    [
      "2024 format with Euro currency variation",
      "2024",
      ["ÖVP", "", "15.04.24", "Test Person", "5020", "80.000,00", "Euro", ""],
      1,
      {
        amount: 80000,
        name: "Test Person",
        date: "2024-04-15",
        receiver: "ÖVP",
      },
    ],
  ])(`extracts %s`, (_title, year, col, idx, expected) => {
    const extractor = loader.extractors[year];
    expect(extractor).toBeDefined();

    const extracted = extractor(col, idx);

    if (expected === undefined) {
      expect(extracted).toBeUndefined();
    } else {
      expect(extracted).toBeDefined();
      expect(extracted![DonationField.Amount]).toEqual(expected.amount);
      expect(extracted![DonationField.DonorName]).toEqual(expected.name);
      expect(extracted![DonationField.Date]).toEqual(expected.date);
      expect(extracted![DonationField.Receiver]).toEqual(expected.receiver);
    }
  });
});

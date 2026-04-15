import assert from "assert";
import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import path from "path";

import type { DonationAddress, ExtractedDonationAddress } from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { extractAddress } from "./address.js";
import { donorMeta } from "./donor-meta";

const toEurFloat = (valueString: string): number => {
  const usFormat = valueString.replaceAll(/\./g, "").replace(/,/, ".");

  return parseFloat(usFormat);
};

const before2020Years = new Set([
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
]);
const before2020Url =
  "https://www.rechnungshof.gv.at/rh/home/home_1/home_3/Parteispenden_bis_8.Juli_2019.csv";

const toIsoDate = (stringValue: string): string => {
  const [dayPart, monthPart, yearPart] = stringValue.split(".");
  assert(
    dayPart && monthPart && yearPart,
    `Has valid date parts: ${stringValue}`,
  );

  return `20${yearPart}-${monthPart}-${dayPart}`;
};

const urls: Record<string, { url: string; encoding?: string }> = {
  2019: {
    url: "https://www.rechnungshof.gv.at/rh/home/home_1/home_3/Parteispenden_ab_9._Juli_2019.csv",
  },
  2020: {
    url: "https://www.rechnungshof.gv.at/rh/home/home_1/home_3/Parteispenden_2020.csv",
  },
  2021: {
    url: "https://www.rechnungshof.gv.at/rh/home/home_1/home_3/Parteispenden_2021.csv",
  },
  2022: {
    url: "https://www.rechnungshof.gv.at/rh/home/home_1/home_3/Parteispenden_2022.csv",
    encoding: "macintosh",
  },
  2023: {
    url: "https://www.rechnungshof.gv.at/rh/home/was-wir-tun/was-wir-tun_5/was-wir-tun_5/was-wir-tun_9/Parteispenden_2023.csv",
  },
  2024: {
    url: "https://www.rechnungshof.gv.at/rh/home/was-wir-tun/was-wir-tun_5/was-wir-tun_5/Parteispenden/Parteispenden_2024.csv",
  },
  2025: {
    url: "https://www.rechnungshof.gv.at/rh/home/was-wir-tun/was-wir-tun_5/was-wir-tun_5/Parteispenden2025/Parteispenden_2025.csv",
  },
};

export class AtLoader extends DataLoader {
  constructor() {
    super("AT", Country.austria);
  }

  extractors: Record<
    string,
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      col: any[],
      idx: number,
      idxOffset?: number,
    ) =>
      | {
          year: string;
          [DonationField.Date]: string;
          [DonationField.Receiver]: string;
          [DonationField.Amount]: number;
          [DonationField.Address]: DonationAddress;
          [DonationField.DonorName]: string;
        }
      | undefined
  > = {
    2012: (col) => {
      const [date, amount, donor, address, receiver] = col;

      const isoDate = toIsoDate(date);

      return {
        year: isoDate.substring(0, 4),
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: receiver,
        [DonationField.Amount]: toEurFloat(amount),
        [DonationField.Address]: extractAddress(
          address.replace("zuletzt wohnhaft in ", "").split(" ")[0],
        ),
        [DonationField.DonorName]: donor,
      };
    },
    2013: (col, idx) => this.extractors[2012](col, idx),
    2014: (col, idx) => this.extractors[2012](col, idx),
    2015: (col, idx) => this.extractors[2012](col, idx),
    2016: (col, idx) => this.extractors[2012](col, idx),
    2017: (col, idx) => this.extractors[2012](col, idx),
    2018: (col, idx) => this.extractors[2012](col, idx),
    2019: (col, idx) => {
      // is header
      if (idx === 0) return;

      const [date, name, amount, currency, receiver] = col;

      assert(
        currency === "Euro",
        `row ${idx} has supported currency: ${JSON.stringify(col)}`,
      );

      const isoDate = toIsoDate(date);

      return {
        year: isoDate.substring(0, 4),
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: receiver,
        [DonationField.Amount]: toEurFloat(amount),
        [DonationField.Address]: { [AddressField.Country]: "AT" },
        [DonationField.DonorName]: name as string,
      };
    },
    2020(col, idx) {
      if (idx === 0) return;
      if (idx === 1) return;

      return this["2019"](col, idx);
    },
    2021(col, idx) {
      if (idx === 0) return;
      if (idx === 1) return;

      return this["2019"](col, idx);
    },
    2022: (col, idx) => {
      if (idx === 0) return;
      if (idx === 1) return;

      const [receiverParty, date, name, amount, currency] = col;

      assert(
        currency === "Euro",
        `row ${idx} has supported currency: ${JSON.stringify(col)}`,
      );

      const isoDate = toIsoDate(date);

      return {
        year: isoDate.substring(0, 4),
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: receiverParty,
        [DonationField.Amount]: toEurFloat(amount),
        [DonationField.DonorName]: name,
        [DonationField.Address]: { [AddressField.Country]: "AT" },
      };
    },
    2023: (col, idx) => {
      if (idx === 0) return;

      const [receiverParty, , date, name, zip, amount, currency] = col;

      assert(
        currency === "EUR",
        `row ${idx} has supported currency: ${JSON.stringify(col)}`,
      );

      const isoDate = toIsoDate(date);

      return {
        year: isoDate.substring(0, 4),
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: receiverParty,
        [DonationField.Amount]: toEurFloat(amount),
        [DonationField.DonorName]: name,
        [DonationField.Address]: extractAddress(zip),
      };
    },
    2024: (col, idx, idxOffset = 1) => {
      if (idx <= idxOffset) return;

      const [receiverParty, , date, name, zip, amount, , receiverName] = col;
      let currency = col[6]?.trim();

      if (receiverName === "EUR") {
        currency = "EUR";
      }

      if (currency === "Euro") {
        currency = "EUR";
      }

      assert(
        currency === "EUR",
        `row ${idx} has supported currency: ${JSON.stringify(col)}`,
      );

      const isoDate = toIsoDate(date);
      const receiver = receiverParty;

      return {
        year: isoDate.substring(0, 4),
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: receiver,
        [DonationField.Amount]: toEurFloat(amount),
        [DonationField.DonorName]: name,
        [DonationField.Address]: extractAddress(zip),
      };
    },
    2025(col, idx) {
      if (idx === 0) return;

      return this["2024"](
        col,
        idx,
        // 2025 document currently has an extra text row above the header, start processing after text + header
        1,
      );
    },
  };

  parties: Record<string, PartyConfig> = {
    "Der Wandel": {
      color: "#e1251b",
      code: "WANDEL",
      short: "WANDEL",
      name: "Wandel",
      wiki: 7770465,
    },
    "Die Bierpartei": {
      color: "#FFED00",
      code: "BIER",
      short: "Die Bierpartei",
      name: "Die Bierpartei",
      wiki: 10922566,
    },
    "Die Grünen – Die Grüne Alternative": {
      color: "#73a303",
      code: "GRUENE",
      short: "Die Grünen",
      name: "Die Grünen – Die Grüne Alternative",
      wiki: 705534,
    },
    FBP: {
      color: "#1e73be",
      code: "FBP",
      short: "FBP",
      name: "FREIE BÜRGERPARTEI ÖSTERREICH",
    },
    FPÖ: {
      color: "#0e428e",
      code: "FPOE",
      short: "FPÖ",
      name: "Freiheitliche Partei Österreichs",
      wiki: 18964,
    },
    KFG: {
      color: "#016773",
      code: "KFG",
      short: "KFG",
      name: "Korruptionsfreie Gemeinderatsklub",
    },
    KPÖ: {
      color: "#e4013b",
      code: "KPOE",
      short: "KPÖ",
      name: "Kommunistische Partei Österreichs",
      wiki: 95853,
    },
    "Linz+": {
      color: "#ffed00",
      code: "LINZPLUS",
      short: "Linz+",
      name: "Linz+",
    },
    MFG: {
      color: "#d7117c",
      code: "MFG",
      short: "MFG",
      name: "MFG–Österreich Menschen – Freiheit – Grundrechte",
      wiki: 11919228,
    },
    NEOS: {
      color: "#f23a84",
      code: "NEOS",
      short: "NEOS",
      name: "NEOS – Das Neue Österreich und Liberales Forum",
      wiki: 7549994,
    },
    SPÖ: {
      color: "#E42612",
      code: "SPOE",
      short: "SPÖ",
      name: "Sozialdemokratische Partei Österreichs",
      wiki: 24262,
    },
    STVP: {
      color: "#00804b",
      code: "STVP",
      short: "STVP",
      name: "Steirische Volkspartei",
      wiki: 3332860,
    },
    SoHo: {
      color: "#C8102E",
      code: "SOHO",
      short: "SoHo",
      name: "Sozialdemokratischen LGBTIQ-Organisation in Österreich",
      wiki: 1852193,
    },
    "Team HC Strache": {
      color: "#000044",
      code: "HC",
      short: "Team HC Strache",
      name: "Team HC Strache – Allianz für Österreich",
      wiki: 11069613,
    },
    VSStÖ: {
      color: "#E30615",
      code: "VSSTOE",
      short: "VSStÖ",
      name: "Verband Sozialistischer Student_innen in Österreich",
      wiki: 382438,
    },
    "Vision Österreich": {
      color: "#FFCC00",
      code: "VOE",
      short: "VÖ",
      name: "Vision Österreich",
      wiki: 12530391,
    },
    ÖVP: {
      color: "#63c3d1",
      code: "OEVP",
      short: "ÖVP",
      name: "Österreichische Volkspartei",
      wiki: 31218,
    },
    "Volt Österreich": {
      color: "#502379",
      code: "VOLT",
      short: "Volt",
      name: "Volt Österreich",
      wiki: 10392468,
    },
    UnionGesellschaftAktiv: {
      color: "#000000",
      name: "UNION GESELLSCHAFT AKTIV",
      code: "UGA",
      short: "UGA",
    },
    "EU–Austrittspartei": {
      color: "#010101",
      name: "EU-Austrittspartei",
      code: "EUAUS",
      short: "EUAUS",
    },
    "Team Stronach": {
      color: "#d8100b",
      name: "Team Stronach",
      code: "STRONACH",
      short: "Team Stronach",
      wiki: 7243948,
    },
    "vorwärts tirol": {
      color: "#fcd205",
      name: "Vorwärts Tirol",
      code: "VORWAERTSTIROL",
      short: "Vorwärts Tirol",
      wiki: 7661241,
    },
    "Liberales Forum": {
      color: "#ffab24",
      name: "Liberales Forum",
      code: "LIF",
      short: "LIF",
      wiki: 23967,
    },
    "LISTE PETER PILZ": {
      color: "#101010",
      name: "JETZT – Liste Pilz",
      code: "JETZT",
      short: "JETZT",
      wiki: 9986464,
    },
  };

  donorMeta = donorMeta;

  async loadYearDataToCache(year: string): Promise<void> {
    if (!urls[year] && !before2020Years.has(year)) return;

    const { url, encoding } = before2020Years.has(year)
      ? { url: before2020Url, encoding: "utf8" }
      : urls[year];

    this.log(`Loading donation page for year ${year}: ${url}`);

    const res = await fetch(url);

    if (!res.ok) {
      throw `Unable to load ${url}: ${res.status}`;
    }

    const resBuf = await res.arrayBuffer();

    // just decode as utf8
    const decoder = new TextDecoder(encoding ?? "utf8");
    let csv = decoder.decode(resBuf);

    if (before2020Years.has(year)) {
      csv = csv
        .split("\n")
        .filter((line) => `20${line.substring(6, 8)}` === year)
        .join("\n");
    }

    await fs.writeFile(this.cacheFile(year), csv, {
      encoding: "utf8",
    });
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const csv = await this.cachedYearData(year);
    const rows = parse(csv, {
      delimiter: ";",
      skip_empty_lines: true,
      columns: false,
    });

    return (
      rows
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((row: any[], idx: number) => {
          assert(
            typeof this.extractors[year] === "function",
            `Has extractor for year: ${year}`,
          );

          const extracted = this.extractors[year](row, idx);

          if (!extracted) return;

          const { year: ignoreYear, ...extractedData } = extracted;

          return {
            idx: `r${idx}`,
            ...extractedData,
            [DonationField.Date]: this.normalizeIsoDate(
              extractedData[DonationField.Date],
            ),
          };
        })
        // remove empty rows
        .filter(Boolean)
    );
  }

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.csv`);
  }

  protected normalizeReceiver(receiver: string): string {
    receiver = super.normalizeReceiver(receiver);

    if (receiver.toLowerCase().startsWith("die grünen"))
      return "Die Grünen – Die Grüne Alternative";
    if (receiver.toUpperCase().startsWith("FPÖ")) return "FPÖ";
    if (receiver.toUpperCase().startsWith("NEOS")) return "NEOS";
    if (receiver.toUpperCase().startsWith("SPÖ")) return "SPÖ";
    if (receiver.startsWith("Freie Bürgerpartei")) return "FBP";
    if (receiver.startsWith("Korruptionsfreies Graz")) return "KFG";
    if (receiver.toUpperCase().startsWith("ÖVP")) return "ÖVP";
    if (receiver.startsWith("Linz")) return "Linz+";
    if (receiver.startsWith("MFG")) return "MFG";
    if (receiver.toUpperCase().includes("VISION ")) return "Vision Österreich";
    if (receiver.includes("Strache")) return "Team HC Strache";
    if (receiver.includes("SoHo")) return "SoHo";
    if (receiver.includes("VSStÖ")) return "VSStÖ";
    if (receiver.startsWith("Steirische Volkspartei")) return "STVP";
    if (receiver.startsWith("Österreichische Volkspartei")) return "ÖVP";
    if (receiver.includes("ÖAAB")) return "ÖVP";
    if (receiver === "Volkspartei Donnerskirchen") return "ÖVP";
    if (receiver.includes("Stronach")) return "Team Stronach";
    if (receiver === "WANDEL") return "Der Wandel";

    return receiver;
  }

  protected normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    if (donor === "DI Stefan Pierer") {
      return "Stefan Pierer";
    }

    return super.normalizeDonor(donor, address);
  }
}

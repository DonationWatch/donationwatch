/* eslint-disable @typescript-eslint/no-unused-vars */
import assert from "assert";
import fs from "fs/promises";
import cp from "node:child_process";
import path from "path";

import { parse } from "csv-parse/sync";

import { donorMeta } from "./donor-meta";
import { isNotNullandNotUndefined } from "../../../src/utils/array";
import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";
import { DataLoader } from "../data-loader";

import type {
  ExtractedDonationAddress,
  ReceiverId,
} from "../../../src/utils/types";
import type { ExtractedYearData, PartyConfig } from "../data-loader";

export const uboExtractorAfter2025 = (ubo: string): string[] => {
  return ubo.split("\n").filter(Boolean);
};

export const uboExtractor2024 = (
  uboName: string,
  uboCityResidence: string,
): string[] | undefined => {
  if (uboName || uboCityResidence) {
    // join each ubo name and city residence line
    const uboNames = uboName
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const uboCities = uboCityResidence
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (uboNames.length > 1 && uboCities.length === 1) {
      // fill the uboCities for all uboNames if we only have one city residence line but multiple ubo name lines,
      // as it seems to be the case that they just put the city residence in the first line and left the rest empty
      uboCities.push(...Array(uboNames.length - 1).fill(uboCities[0]));
    }

    if (uboNames.length === 1 && uboCities.length > 1) {
      // remove all except the first uboCities entry as there seems to be a type in some rows :(
      uboCities.splice(1);
    }

    assert(
      uboNames.length === uboCities.length,
      `UBO name and city residence lines should match: ${uboName} - ${uboCityResidence}`,
    );

    return uboNames.map(
      (name, idx) => `${name.trim()}, ${uboCities[idx].trim()}`,
    );
  }
};

export class NlLoader extends DataLoader {
  parties: Record<string, PartyConfig> = {
    CDA: {
      short: "CDA",
      name: "Christen-Democratisch Appèl",
      code: "CDA",
      color: "#28b445",
      wiki: 64992,
    },
    FvD: {
      short: "FvD",
      name: "Forum voor Democratie",
      code: "FVD",
      color: "#b02520",
      wiki: 53344931,
    },
    VVD: {
      short: "VVD",
      name: "Volkspartij voor Vrijheid en Democratie",
      code: "VVD",
      color: "#0a2cca",
      wiki: 49064,
    },
    Volt: {
      short: "Volt",
      name: "Volt Nederland",
      code: "VOLT",
      color: "#502379",
      wiki: 67129844,
    },
    SP: {
      short: "SP",
      name: "Socialistische Partij",
      code: "SP",
      color: "#EC1B23",
      wiki: 356567,
    },
    CU: {
      short: "CU",
      name: "ChristenUnie",
      code: "CU",
      color: "#00a7eb",
      wiki: 63175,
    },
    D66: {
      short: "D66",
      name: "Democraten 66",
      code: "D66",
      color: "#00AE41",
      wiki: 172352,
    },
    PvdD: {
      short: "PvdD",
      name: "Partij voor de Dieren",
      code: "PVDD",
      color: "#00743c",
      wiki: 1855111,
    },
    GL: {
      short: "GL",
      name: "GroenLinks",
      code: "GL",
      color: "#dd2132",
      wiki: 155948,
    },
    BBB: {
      short: "BBB",
      name: "BoerBurgerBeweging",
      code: "BBB",
      color: "#95c11f",
      wiki: 65738028,
    },
    PVV: {
      short: "PVV",
      name: "Partij voor de Vrijheid",
      code: "PVV",
      color: "#1b3357",
      wiki: 30862556,
    },
    BVNL: {
      short: "BVNL",
      name: "Belang van Nederland",
      code: "BVNL",
      color: "#212B51",
      wiki: 68673202,
    },
    PvdA: {
      short: "PvdA",
      name: "Partij van de Arbeid",
      code: "PVDA",
      color: "#e40006",
      wiki: 49066,
    },
    SGP: {
      short: "SGP",
      name: "Staatkundig Gereformeerde Partij",
      code: "SGP",
      color: "#e95e10",
      wiki: 63176,
    },
    JA21: {
      short: "JA21",
      name: "JA21",
      code: "JA21",
      color: "#242B57",
      wiki: 66158934,
    },
    Goud: {
      short: "Goud",
      name: "Goud",
      code: "GOUD",
      color: "#E83C86",
    },
    OPNL: {
      short: "OPNL",
      name: "Onafhankelijke Politiek Nederland",
      code: "OPNL",
      color: "#d32e0e",
      wiki: 1853924,
    },
    BIJ1: {
      short: "BIJ1",
      name: "BIJ1",
      code: "BIJ1",
      color: "#FFFF00",
      wiki: 53451159,
    },
    "50PLUS": {
      short: "50PLUS",
      name: "50PLUS",
      code: "50PLUS",
      color: "#84236d",
      wiki: 31860815,
    },
    DENK: {
      short: "DENK",
      name: "DENK",
      code: "DENK",
      color: "#00b7b2",
      wiki: 53452982,
    },
    NSC: {
      name: "New Social Contract (Dutch: Nieuw",
      short: "NSC",
      code: "NSC",
      color: "#0b0a37",
      wiki: 74635762,
    },
  };

  constructor() {
    super("NL", Country.netherlands);
  }

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `${year}.csv`);
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const csv = await this.cachedYearData(year);
    const rows = parse(csv, {
      delimiter: ",",
      skip_empty_lines: false,
      columns: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any[];

    return (
      rows
        .map((row, idx) => {
          assert(
            typeof this.extractors[year] === "function",
            `Has extractor for year: ${year}`,
          );

          const extracted = this.extractors[year](year, row, idx, rows);

          if (!extracted) return;

          return {
            idx: `r${idx}`,
            ...extracted,
          };
        })
        // remove empty rows
        .filter(isNotNullandNotUndefined)
    );
  }

  private findAddress(address: string): ExtractedDonationAddress {
    if (address.includes("(Duitsland)"))
      return { [AddressField.Country]: "DE" };
    if (address.includes("(Ierland)"))
      return {
        [AddressField.Country]: "IE",
      };
    if (address.includes("(Duitsland)"))
      return { [AddressField.Country]: "DE" };
    if (address.includes("(Tsjechië)")) return { [AddressField.Country]: "CZ" };
    if (address.includes("(Zwitserland)"))
      return { [AddressField.Country]: "CH" };
    if (address.includes("(Verenigd Koninkrijk)"))
      return { [AddressField.Country]: "UK" };
    if (address.includes("(Singapore)"))
      return { [AddressField.Country]: "SG" };
    if (address.includes("(België)") || address.includes("(Belgie)"))
      return { [AddressField.Country]: "BE" };
    if (address === "Monaco") return { [AddressField.Country]: "MC" };

    if (address.includes("(ZH)") || address.includes("(NH)"))
      return { [AddressField.Country]: "NL" };

    if (address.includes("(")) {
      throw new Error(`Unknown country in address: ${address}`);
    }

    return { [AddressField.Country]: "NL" };
  }

  // their format is "number Month JJJJ"
  private parseTheirDate(year: string, date: string): string {
    if (date === "nog niet ontvangen") return year;

    const [month, day /*, year*/] = date.split("/");

    // this kinda sucks but they had a wrong data entry for one date
    if (year === "2025" && date === "27 januari 2025  ") {
      return "2025-01-27";
    }

    return this.normalizeIsoDate(`${year}-${month}-${day}`);
  }

  extractors: Record<
    string,
    (
      year: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      col: any[],
      idx: number,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rows: any[][],
      rowOffset?: number,
    ) =>
      | {
          [DonationField.Date]: string;
          [DonationField.Receiver]: ReceiverId;
          [DonationField.Amount]: number;
          [DonationField.Address]: ExtractedDonationAddress;
          [DonationField.DonorName]: string;
        }
      | undefined
  > = {
    2026: (year, col, idx, rows) => {
      return this.extractors["2025"](year, col, idx, rows, 29);
    },
    2025: (year, col, idx, rows, rowOffset: number = 30) => {
      const parseAmount = (amount: string | undefined): number => {
        if (typeof amount !== "string") return 0;

        return parseFloat(amount.trim().replace(".", "").replace(",", "."));
      };

      if (idx < rowOffset) return;

      const extractRow = (row: string[]) => {
        const [party, secondary, total, name, address, ubo, betrag, date] = col;
        return {
          party,
          secondary,
          total: parseAmount(total),
          name,
          address,
          ubo,
          betrag: parseAmount(betrag),
          date,
        };
      };

      const { party, secondary, total, name, address, ubo, betrag, date } =
        extractRow(col);

      // skip if we don't have a total amount
      if (!total) return;

      const nextRow = rows[idx + 1] ? extractRow(rows[idx + 1]) : undefined;
      let isoDate = date ? this.parseTheirDate(year, date) : `${year}`;

      if (nextRow && nextRow.name === name) {
        // if we have a donation from the same donor next row, let date just be the year as we can't merge the individual entries
        isoDate = `${year}`;
      }

      const ubos = uboExtractorAfter2025(ubo);

      return {
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: party.trim() as ReceiverId,
        [DonationField.Amount]: total,
        [DonationField.DonorName]: name,
        [DonationField.Address]: this.findAddress(address),
        // optionally add UBO
        ...(ubos?.length ? { [DonationField.UBOs]: ubos } : undefined),
      };
    },
    2024: (year, col, idx, rows) => {
      const parseAmount = (amount: string | undefined): number => {
        if (typeof amount !== "string") return 0;
        if (!amount) return 0;

        return parseFloat(amount.trim().replace(".", "").replace(",", "."));
      };

      if (idx < 35) return;

      const extractRow = (row: string[]) => {
        const [
          party,
          subsidiary,
          totalAmount,
          donorName,
          donorAddress,
          uboName,
          uboCityResidence,
          amount,
          date,
          explanation,
        ] = row;
        return {
          party,
          subsidiary,
          totalAmount: parseAmount(totalAmount),
          donorName,
          donorAddress,
          uboName,
          uboCityResidence,
          amount: parseAmount(amount),
          date,
          explanation,
        };
      };

      const {
        party,
        totalAmount,
        donorName,
        donorAddress,
        amount,
        date,
        uboName,
        uboCityResidence,
      } = extractRow(col);

      // skip if we don't have a total amount
      if (!totalAmount) return;

      const nextRow = rows[idx + 1] ? extractRow(rows[idx + 1]) : undefined;
      let isoDate = date ? this.parseTheirDate(year, date) : `${year}`;

      if (nextRow && nextRow.donorName === donorName) {
        // if we have a donation from the same donor next row, let date just be the year as we can't merge the individual entries
        isoDate = `${year}`;
      }

      const ubo = uboExtractor2024(uboName, uboCityResidence);

      return {
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: party.trim() as ReceiverId,
        [DonationField.Amount]: totalAmount,
        [DonationField.DonorName]: donorName,
        [DonationField.Address]: this.findAddress(donorAddress),
        // optionally add UBO
        ...(ubo?.length ? { [DonationField.UBOs]: ubo } : undefined),
      };
    },
    2023: (year, col, idx, rows) => {
      const parseAmount = (amount: string | undefined): number => {
        if (typeof amount !== "string") return 0;

        return parseFloat(amount.trim().replace(".", "").replace(",", "."));
      };

      const extractRow = (row: string[]) => {
        const [party, secondary, total, name, address, betrag, date] = row;

        return {
          party,
          secondary,
          total: parseAmount(total),
          name,
          address,
          betrag: parseAmount(betrag),
          date,
        };
      };

      if (idx < 34) return;
      const { party, total, name, address, date } = extractRow(col);

      // skip if we don't have a total amount
      if (!total) return;

      const nextRow = rows[idx + 1] ? extractRow(rows[idx + 1]) : undefined;

      let isoDate = date ? this.parseTheirDate(year, date) : `${year}`;
      if (nextRow && nextRow.name === name) {
        // if we have a donation from the same donor next row, let date just be the year as we can't merge the individual entries
        isoDate = `${year}`;
      }

      return {
        [DonationField.Date]: isoDate,
        [DonationField.Receiver]: party.trim() as ReceiverId,
        [DonationField.Amount]: total,
        [DonationField.DonorName]: name,
        [DonationField.Address]: this.findAddress(address),
      };
    },
    2022: (year, col, idx, rows) => {
      const parseAmount = (amount: string | undefined): number => {
        if (typeof amount !== "string") return 0;

        return parseFloat(amount.trim().replace(",", ""));
      };

      if (idx < 32) return;

      const extractRow = (row: string[]) => {
        const [party, secondary, total, name, address, betrag, date] = row;

        return {
          party,
          secondary,
          total: parseAmount(total),
          name,
          address,
          betrag: parseAmount(betrag),
          date,
        };
      };

      const { party, total, name, address, date } = extractRow(col);

      // skip if we don't have a total amount
      if (!total) return;

      const nextRow = rows[idx + 1] ? extractRow(rows[idx + 1]) : undefined;

      let isoDate = date ? this.parseTheirDate(year, date) : undefined;

      if (nextRow && nextRow.name === name) {
        // if we have a donation from the same donor next row, let date just be the year as we can't merge the individual entries
        isoDate = `${year}`;
      }

      return {
        [DonationField.Date]: isoDate ?? `${year}`,
        [DonationField.Receiver]: party.trim() as ReceiverId,
        [DonationField.Amount]: total,
        [DonationField.DonorName]: name,
        [DonationField.Address]: this.findAddress(address),
      };
    },
  };

  yearFiles: Record<string, string> = {
    2026: "https://www.rijksoverheid.nl/binaries/rijksoverheid/documenten/jaarverslagen/2026/01/21/overzicht-substantiele-giften-aan-politieke-partijen-2026/Overzicht+substanti%C3%ABle+giften+aan+politieke+partijen+2026.ods",
    2025: "https://www.rijksoverheid.nl/binaries/rijksoverheid/documenten/jaarverslagen/2025/01/31/overzicht-substantiele-giften-aan-politieke-partijen-2025/Overzicht+substanti%C3%ABle+giften+aan+politieke+partijen+2025+versie+21-01-2026.ods",
    2024: "https://www.rijksoverheid.nl/binaries/rijksoverheid/documenten/jaarverslagen/2025/10/22/overzicht-van-giften-aan-politieke-partijen-en-hun-neveninstellingen-in-2024/overzicht-giften-aan-politieke-partijen-2024.ods",
    2023: "https://www.rijksoverheid.nl/binaries/rijksoverheid/documenten/jaarverslagen/2024/10/22/overzicht-giften-aan-politieke-partijen-2023/1+Overzicht+giften+2023.ods",
    2022: "https://www.rijksoverheid.nl/binaries/rijksoverheid/documenten/jaarverslagen/2023/09/25/overzicht-van-giften-aan-politieke-partijen-en-hun-neveninstellingen-2022/Overzicht+giften+2022.ods",
  };

  protected override normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    donor = super.normalizeDonor(donor, address);

    if (
      donor.includes("Stichting") &&
      donor.includes("Ondersteuning") &&
      donor.includes("VVD") &&
      donor.includes("Tweede Kamerverkiezing")
    ) {
      return "Stichting Ondersteuning VVD Tweede Kamerverkiezing";
    }

    if (
      donor.startsWith("Ozephius ") &&
      (donor.includes("Group") || donor.includes("Groep"))
    ) {
      return "Ozephius Group B.V.";
    }

    if (donor.startsWith("Herakleitos ")) {
      return "Herakleitos Holding B.V.";
    }

    if (donor.includes("Stichting") && donor.includes("Thorbeckefonds")) {
      return "Stichting het Thorbeckefonds";
    }

    if (donor.includes("B en S")) {
      return "B&S Group B.V.";
    }

    return donor;
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const url = this.yearFiles[year];

    this.log(`Loading donation page for year ${year}: ${url}`);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Unable to load ${url}: ${res.status}`);
    }

    const resBuf = await res.arrayBuffer();

    const odtFile = this.cacheFile(year).replace(".csv", ".ods");

    await fs.writeFile(odtFile, Buffer.from(resBuf), {
      encoding: "utf8",
    });

    this.log(`Converting ${odtFile} to csv`);

    const convertOut = cp.execSync(
      `libreoffice --headless --convert-to csv ${odtFile}`,
      {
        cwd: this.cacheDir,
      },
    );

    this.log(`Converting ${odtFile} to csv\n${convertOut.toString("utf8")}`);
  }
}

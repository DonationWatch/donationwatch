import { existsSync } from "fs";
import fs from "fs/promises";
import { parse } from "node-xlsx";
import path from "path";

import type { ExtractedDonationAddress, ReceiverId } from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField, DonationType } from "@/utils/types";

import {
  DataLoader,
  type ExtractedYearData,
  type PartyConfig,
} from "../data-loader";
import { containsWords } from "../util";
import { donorMeta } from "./donor-meta";

const yearAlias: Record<string, string> = {
  "2021": "4",
  "2022": "5",
  "2023": "6",
  "2024": "7",
  "2025": "8",
  "2026": "9",
};

function parseDate(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const match = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");
  const year = match[3];
  return `${year}-${month}-${day}`;
}

export class ZaLoader extends DataLoader {
  constructor() {
    super("ZA", Country.southafrica);
  }

  donorMeta = donorMeta;

  parties: Record<string, PartyConfig> = {
    ACTIONSA: {
      name: "ActionSA",
      short: "ActionSA",
      code: "ACTIONSA",
      color: "#05B615",
      wiki: 66098255,
    },
    "AFRICAN NATIONAL CONGRESS": {
      name: "African National Congress",
      short: "African National Congress",
      code: "ANC",
      color: "#00A650",
      wiki: 2503,
    },
    "DEMOCRATIC ALLIANCE": {
      name: "Democratic Alliance",
      short: "Democratic Alliance",
      code: "DA",
      color: "#001993",
      wiki: 403102,
    },
    "ECONOMIC FREEDOM FIGHTERS": {
      name: "Economic Freedom Fighters",
      short: "Economic Freedom Fighters",
      code: "EFF",
      color: "#FF0000",
      wiki: 40005536,
    },
    "INKATHA FREEDOM PARTY": {
      name: "Inkatha Freedom Party",
      short: "Inkatha Freedom Party",
      code: "IFP",
      color: "#D7191D",
      wiki: 383326,
    },
    "PATRIOTIC ALLIANCE": {
      name: "Patriotic Alliance",
      short: "Patriotic Alliance",
      code: "PA",
      color: "#198B0A",
      wiki: 41238240,
    },
    "VRYHEIDSFRONT PLUS": {
      name: "Vryheidsfront Plus",
      short: "Vryheidsfront Plus",
      code: "VF",
      color: "#ED6C08",
      wiki: 449582,
    },
    "BUILD ONE SOUTH AFRICA": {
      name: "Build One South Africa",
      short: "Build One South Africa",
      code: "BOSA",
      color: "#fdb316",
      wiki: 71844566,
    },
    "RISE MZANSI": {
      name: "RISE Mzansi",
      short: "RISE Mzansi",
      code: "RISE",
      color: "#000000",
      wiki: 74715656,
    },
    "UMKHONTO WESIZWE": {
      name: "uMkhonto weSizwe",
      short: "uMkhonto weSizwe",
      code: "MK",
      color: "#53a546",
      wiki: 185537,
    },
    GOOD: {
      name: "GOOD",
      short: "GOOD",
      code: "GOOD",
      color: "#ec690d",
      wiki: 59231193,
    },
    "AFRICAN CHRISTIAN DEMOCRATIC PARTY": {
      name: "African Christian Democratic Party",
      short: "African Christian Democratic Party",
      code: "ACDP",
      color: "#009CDE",
      wiki: 435602,
    },
    "AFRICAN TRANSFORMATION MOVEMENT": {
      name: "African Transformation Movement",
      short: "African Transformation Movement",
      code: "ATM",
      color: "#dbbe3c",
      wiki: 59624037,
    },
    "UNITED DEMOCRATIC MOVEMENT": {
      name: "United Democratic Movement",
      short: "United Democratic Movement",
      code: "UDM",
      color: "#ffb300",
      wiki: 449587,
    },
    "ABANTU INTEGRITY MOVEMENT": {
      name: "Abantu Integrity Movement",
      short: "Abantu Integrity Movement",
      code: "AIM",
      color: "#f93306",
    },
    "CHANGE STARTS NOW": {
      name: "Change Starts Now",
      short: "Change Starts Now",
      code: "CSN",
      color: "#060606",
      wiki: 75552129,
    },
    "SOUTH AFRICAN RAINBOW ALLIANCE": {
      name: "South African Rainbow Alliance",
      short: "South African Rainbow Alliance",
      code: "SARA",
      color: "#2f4737",
      wiki: 76142915,
    },
    "REFERENDUM PARTY": {
      name: "Referendum Party",
      short: "Referendum Party",
      code: "RP",
      color: "#09083a",
      wiki: 75284884,
    },
    "ALLIANCE OF CITIZENS FOR CHANGE": {
      name: "Alliance of Citizens for Change",
      short: "Alliance of Citizens for Change",
      code: "ACC",
      color: "#8300E9",
      wiki: 74724036,
    },
    "SHOSHOLOZA PROGRESSIVE PARTY": {
      name: "Shosholoza Progressive Party",
      short: "Shosholoza Progressive Party",
      code: "SPP",
      color: "#010101",
    },
    "ABLE LEADERSHIP": {
      name: "Able Leadership",
      short: "Able Leadership",
      code: "AL",
      color: "#145d03",
    },
    "INDEPENDENT SOUTH AFRICAN NATIONAL CIVIC ORGANISATION": {
      name: "Independent South African National Civic Organisation",
      short: "Independent South African National Civic Organisation",
      code: "ISANCO",
      color: "#dc9028",
      wiki: 72315059,
    },
  };

  private yearUrl(year: string, quarter: number): string {
    return `https://results.elections.org.za/home/PartyFundingReports/${year}/${quarter}/${year}_${quarter}_Published_Declarations_Report.xls`;
  }

  cacheFile(year: string, quarter?: number): string {
    return path.join(this.cacheDir, `donations-${year}-${quarter}.xlsx`);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    for (const quarter of [1, 2, 3, 4]) {
      const yearNumber = yearAlias[year];
      if (!yearNumber) {
        this.log(`skipping ${year}`);
        continue;
      }

      const url = this.yearUrl(yearNumber, quarter);
      this.log(`Loading donation page for year ${year}: ${url}`);
      const res = await fetch(url);

      if (!res.ok) {
        throw `Unable to load ${url}: ${res.status}`;
      }

      await fs.writeFile(
        this.cacheFile(year, quarter),
        Buffer.from(await res.arrayBuffer()),
      );
    }
  }

  private normalizePartyName(str: unknown): string | null {
    if (!str || typeof str !== "string") return null;
    const clean = str.trim().toUpperCase();
    for (const party of Object.keys(this.parties)) {
      if (clean.includes(party)) return party;
    }
    return null;
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const yearData: ExtractedYearData[] = [];
    let idxCounter = 0;

    for (const quarter of [1, 2, 3, 4]) {
      const cachePath = this.cacheFile(year, quarter);
      if (!existsSync(cachePath)) continue;

      const sheets = parse(cachePath);
      const sheet0 = sheets[0];
      if (!sheet0 || !sheet0.data) continue;

      let currentParty: string | null = null;

      (sheet0.data as unknown[][]).forEach((row) => {
        const cleaned = row.map((c) => (typeof c === "string" ? c.trim() : c));
        const nonNull = cleaned.filter((c) => c !== null && c !== "");
        if (nonNull.length === 0) return;
        const rowStr = JSON.stringify(cleaned);

        // Check if row sets a new party section
        for (let c = 0; c < 5; c++) {
          const p = this.normalizePartyName(cleaned[c]);
          if (p && !rowStr.includes("Total Amount Declared by")) {
            currentParty = p;
            break;
          }
        }

        // Skip headers, metadata, totals and accumulative rows
        if (
          rowStr.includes("PUBLISHED DECLARATIONS") ||
          rowStr.includes("SECTION 9") ||
          rowStr.includes("Date(s) of Receipt") ||
          rowStr.includes("TOTAL FUNDS") ||
          rowStr.includes("GRAND TOTAL") ||
          rowStr.includes("Report Details as at")
        )
          return;

        if (
          cleaned.some(
            (c) =>
              typeof c === "string" && c.includes("Total Amount Declared by"),
          )
        )
          return;

        if (
          cleaned.some(
            (c) =>
              typeof c === "string" &&
              (c === "SUB-TOTAL:" || c === "ACCUMULATIVE TOTAL:"),
          )
        )
          return;

        let date: string | null = null;
        let donor: string | null = null;
        let type: string | null = null;
        let amount: number | null = null;

        for (const cell of cleaned) {
          if (cell === null || cell === undefined) continue;
          if (typeof cell === "string") {
            const parsed = parseDate(cell);
            if (parsed && !date) {
              date = parsed;
              continue;
            }
            if (cell === "MONETARY" || cell === "IN-KIND") {
              type = cell;
              continue;
            }
            if (
              !donor &&
              cell.length > 1 &&
              cell !== currentParty &&
              !this.normalizePartyName(cell) &&
              !cell.startsWith("QUARTER") &&
              !cell.startsWith("Financial Year") &&
              !cell.includes("LATE SUBMISSIONS")
            ) {
              donor = cell;
            }
          } else if (typeof cell === "number" && cell > 0 && !amount) {
            amount = cell;
          }
        }

        if (currentParty && date && donor && amount) {
          yearData.push({
            idx: `${year}-${quarter}-${idxCounter++}`,
            [DonationField.Amount]: amount,
            [DonationField.DonorName]: donor,
            [DonationField.Receiver]: currentParty as ReceiverId,
            [DonationField.Date]: date,
            [DonationField.DonationType]:
              type === "IN-KIND"
                ? DonationType.PropertyOrService
                : DonationType.Money,
            [DonationField.Address]: {
              [AddressField.Country]: "ZA",
            },
          });
        }
      });
    }

    return yearData;
  }

  protected normalizeDonor(
    donor: string,
    _address: ExtractedDonationAddress,
  ): string {
    const name = super
      .normalizeDonor(donor, _address)
      .replace("(PTY)", "PTY")
      // replace word PROPRIETARY LIMITED with PTY LTD
      .replace(/\bPROPRIETARY LIMITED\b/g, "PTY LTD")
      // replace word LIMITED with LTD
      .replace(/\bLIMITED\b/g, "LTD")
      // remove MR, MS, and MRS words
      .replace(/\b(MR|MS|MRS)\b/g, "")
      .trim();

    if (name.startsWith("AFRICAN RAINBOW MINERAL")) {
      return "AFRICAN RAINBOW MINERALS LTD";
    }

    if (name === "MARTIN MOSHAL" || name === "M MOSHAL") {
      return "MARTIN PAUL MOSHAL";
    }

    if (name === "BATHO BATHO") {
      return "BATHO BATHO TRUST";
    }

    if (name === "NF OPPENHEIMER") {
      return "NICHOLAS FRANK OPPENHEIMER";
    }

    if (name === "J OPPENHEIMER") {
      return "JONATHAN ERNEST MAXIMILLIAN OPPENHEIMER";
    }

    if (name === "M SLACK") {
      return "MARY SLACK";
    }

    if (name === "JESSICA BRIDGET SLACK JELL") {
      return "JESSICA SLACK-JELL";
    }

    if (containsWords(name, "HARMONY GOLD MINING")) {
      return "HARMONY GOLD MINING COMPANY LTD";
    }

    if (containsWords(name, "KONRAD ADENAUER STIFTUNG")) {
      return "KONRAD-ADENAUER-STIFTUNG";
    }

    return name;
  }
}

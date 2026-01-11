/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs/promises";
import path from "path";

import { parse } from "csv-parse/sync";

import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";
import {
  DataLoader,
  type ExtractedYearData,
  type PartyConfig,
} from "../data-loader";
import { donorMeta } from "./donor-meta";

import type { ReceiverId } from "../../../src/utils/types";

import { isNotNullandNotUndefined } from "@/utils/array";

export class RsLoader extends DataLoader {
  private loadedOnce = false;
  private extractedOnce = false;

  parties: Record<string, PartyConfig> = {
    "Socijalistička partija Srbije (SPS)": {
      name: "Socijalistička partija Srbije",
      code: "SPS",
      short: "SPS",
      color: "#eb1b23",
      wiki: 417429,
    },
    "Socijaldemokratska stranka (SDS)": {
      name: "Socijaldemokratska stranka",
      code: "SDS",
      short: "SDS",
      color: "#d71920",
      wiki: 41969644,
    },
    "Pokret socijalista (PS)": {
      name: "Pokret socijalista",
      code: "PS",
      short: "PS",
      color: "#db0004",
      wiki: 40956491,
    },
    "Srpska narodna partija (SNP)": {
      name: "Srpska narodna partija",
      code: "SNP",
      short: "SNP",
      color: "#004276",
      wiki: 57381052,
    },
    "Srpska radikalna stranka (SRS)": {
      name: "Srpska radikalna stranka",
      code: "SRS",
      short: "SRS",
      color: "#2c4981",
      wiki: 417432,
    },
    "Srpski pokret obnove (SPO)": {
      name: "Srpski pokret obnove",
      code: "SPO",
      short: "SPO",
      color: "#ED1C24",
      wiki: 2032736,
    },
    "Novi DSS – nekad Demokratska stranka Srbije (DSS)": {
      name: "Nova Demokratska stranka Srbije",
      code: "DSS",
      short: "DSS",
      color: "#13284b",
      wiki: 424667,
    },
    "Zeleni Srbije": {
      name: "Zeleni Srbije",
      code: "ZS",
      short: "Zeleni",
      color: "#07944b",
      wiki: 9971819,
    },
    "Demokratska stranka (DS)": {
      name: "Demokratska stranka",
      code: "DS",
      short: "DS",
      color: "#0f3979",
      wiki: 424727,
    },
    "Zajedno – nekad Zajedno za Srbiju (ZZS)": {
      name: "Zajedno za Srbiju",
      code: "ZZS",
      short: "ZZS",
      color: "#39835A",
      wiki: 41978861,
    },
    "Partija ujedinjenih penzionera Srbije (PUPS)": {
      name: "Partija ujedinjenih penzionera Srbije",
      code: "PUPS",
      short: "PUPS",
      color: "#961016",
      wiki: 9007797,
    },
    "Savez vojvođanskih Mađara (SVM)": {
      name: "Savez vojvođanskih Mađara",
      code: "SVM",
      short: "SVM",
      color: "#026512",
      wiki: 2032841,
    },
    "Socijaldemokratska partija Srbije (SDPS)": {
      name: "Socijaldemokratska partija Srbije",
      code: "SDPS",
      short: "SDPS",
      color: "#ff001a",
      wiki: 11715435,
    },
    "Srpska napredna stranka (SNS)": {
      name: "Srpska napredna stranka",
      code: "SNS",
      short: "SNS",
      color: "#184b82",
      wiki: 19454384,
    },
    "Liga socijaldemokrata Vojvodine (LSV)": {
      name: "Liga socijaldemokrata Vojvodine",
      code: "LSV",
      short: "LSV",
      color: "#0055a3",
      wiki: 30862388,
    },
    "Jedinstvena Srbija (JS)": {
      name: "Jedinstvena Srbija",
      code: "JS",
      short: "JS",
      color: "#0b3b76",
      wiki: 13237399,
    },
    "Stranka pravde i pomirenja (SPP)": {
      name: "Stranka pravde i pomirenja",
      code: "SPP",
      short: "SPP",
      color: "#16321b",
      wiki: 50558994,
    },
    "Ruska stranka": {
      name: "Ruska stranka",
      code: "RS",
      short: "RS",
      color: "#2f3064",
      wiki: 64213127,
    },
    "Pokret obnove Kraljevine Srbije (POKS)": {
      name: "Pokret obnove Kraljevine Srbije",
      code: "POKS",
      short: "POKS",
      color: "#274472",
      wiki: 55579233,
    },
    "Stranka slobode i pravde (SSP)": {
      name: "Stranka slobode i pravde",
      code: "SSP",
      short: "SSP",
      color: "#DA2529",
      wiki: 60573879,
    },
    Zavetnici: {
      name: "Srpska stranka Zavetnici",
      code: "SSZ",
      short: "Zavetnici",
      color: "#154b83",
      wiki: 63899116,
    },
    "Pokret Snaga Srbije – BK": {
      name: "Pokret snaga Srbije – BK",
      code: "PSS",
      short: "PSS",
      color: "#002f66",
      wiki: 8421270,
    },
    "Narodna stranka (NS)": {
      name: "Narodna stranka",
      code: "NS",
      short: "Narodna",
      color: "#008dcf",
      wiki: 55792684,
    },
    "Zdrava Srbija": {
      name: "Zdrava Srbija",
      code: "ZDS",
      short: "Zdrava Srbija",
      color: "#c19f0f",
      wiki: 55976567,
    },
    "Partija za demokratsko delovanje (PDD)": {
      name: "Partija za demokratsko delovanje",
      code: "PDD",
      short: "PDD",
      color: "#0372bb",
      wiki: 9134302,
    },
  };

  cacheFile() {
    return path.join(this.cacheDir, `p2.csv`);
  }

  constructor() {
    super("RS", Country.serbia);
  }

  donorMeta = donorMeta;

  async loadYearDataToCache(): Promise<void> {
    if (this.loadedOnce) {
      this.log(
        "Skipping year data load, already ran and loaded everything at once",
      );
      return;
    }

    this.loadedOnce = true;

    const url = "https://www.cins.rs/baza-test/data/base/p2.csv";

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Unable to load ${url}: ${res.status}`);
    }

    await fs.writeFile(this.cacheFile(), await res.text(), {
      encoding: "utf8",
    });
  }

  public transformRawDonation(
    row: string[],
    idx: number,
  ): ExtractedYearData | undefined {
    const [
      party,
      year,
      incomeType,
      service,
      user,
      monetaryContribution,
      inKindContribution,
      totalAmount,
      purpose,
    ] = row;

    if (!incomeType.startsWith("Donacije")) return;

    const amount = parseFloat(totalAmount);

    if (amount <= 0) return;

    return {
      idx: `${year}-${idx}`,
      [DonationField.Receiver]: party as ReceiverId,
      [DonationField.Date]: `${year}`,
      [DonationField.Amount]: amount,
      [DonationField.DonorName]: user,
      [DonationField.Address]: { [AddressField.Country]: "RS" },
    };
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    if (this.extractedOnce) {
      this.log(
        "Skipping year data extraction, already ran and loaded everything at once",
      );
      return [];
    }

    this.extractedOnce = true;

    const csv = await this.cachedYearData(year);
    const rows = parse(csv, {
      delimiter: ";",
      skip_empty_lines: true,
      columns: false,
      from_line: 2,
    });

    return (rows as string[][])
      .map((row, idx) => this.transformRawDonation(row, idx))
      .filter(isNotNullandNotUndefined);
  }
}

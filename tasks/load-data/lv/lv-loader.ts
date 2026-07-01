import assert from "assert";
import * as cheerio from "cheerio";
import fs from "fs/promises";
import path from "path";

import type { ExtractedDonationAddress, ReceiverId } from "@/utils/types";

import { Country } from "@/utils/countries";
import { DonationType, AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { spawnBrowser, timeout } from "../util";
import { donorMeta } from "./donor-meta";

const knabTypeMapping: Record<
  string,
  {
    // the type id that their api needs for this type
    knabTypeId: string;
    donationType: DonationType;
  }
> = {
  Nauda: { knabTypeId: "1", donationType: DonationType.Money },
  "Manta vai pakalpojums": {
    knabTypeId: "2",
    donationType: DonationType.PropertyOrService,
  },
  "Iestāšanās maksa": {
    knabTypeId: "4",
    donationType: DonationType.JoiningFee,
  },
  "Biedra nauda": { knabTypeId: "5", donationType: DonationType.MembershipFee },
};

export class LvLoader extends DataLoader {
  constructor() {
    super("LV", Country.latvia);
  }

  parties: Record<string, PartyConfig> = {
    "Latvijas Sociālistiskā partija": {
      color: "#940000",
      name: "Latvijas Sociālistiskā partija",
      code: "LSP",
      short: "LSP",
      wiki: 356652,
    },
    "LATGALES PARTIJA": {
      wiki: 67750653,
      color: "#174277",
      name: "Latgales partija",
      code: "LP",
      short: "LP",
    },
    "Reformu partija (Zatlera Reformu partija) (likvidēta 03.04.2020.)": {
      wiki: 32446328,
      color: "#0073aa",
      name: "Reformu partija",
      code: "ZRP",
      short: "ZRP",
    },
    'Partija "VIENOTĪBA"': {
      wiki: 26861276,
      color: "#6cc24a",
      name: "Vienotība",
      code: "V",
      short: "V",
    },
    "POLITISKĀ PARTIJA IZAUGSME": {
      wiki: 65618069,
      color: "#f5a623",
      name: "Izaugsme",
      code: "I",
      short: "Izaugsme",
    },
    "LATVIJAS ZEMNIEKU SAVIENĪBA": {
      wiki: 1906475,
      color: "#27AE60",
      name: "Latvijas Zemnieku savienība",
      code: "LZS",
      short: "LZS",
    },
    "Latvijas Krievu savienība": {
      wiki: 710653,
      color: "#3560a9",
      name: "Latvijas Krievu savienība",
      code: "LKS",
      short: "LKS",
    },
    '"Saskaņa" sociāldemokrātiskā partija': {
      wiki: 27083175,
      color: "#e32127",
      name: "Saskaņa, sociāldemokrātiskā partija",
      code: "S",
      short: "Saskaņa",
    },
    "Zaļo un Zemnieku savienība": {
      wiki: 737046,
      color: "#006538",
      name: "Zaļo un Zemnieku savienība",
      code: "ZZS",
      short: "ZZS",
    },
    'Politisko partiju apvienība "Saskaņas Centrs"': {
      wiki: 4591044,
      color: "#ff3d25",
      name: "Saskaņas Centrs",
      code: "SC",
      short: "Saskaņas Centrs",
    },
    "Tautas varas spēks": {
      color: "#56021C",
      name: "Tautas varas spēks",
      code: "TVS",
      short: "TVS",
      wiki: 77790225,
    },
    "Latvijas Zaļā partija": {
      color: "#046735",
      wiki: 481890,
      name: "Latvijas Zaļā partija",
      code: "LZP",
      short: "LZP",
    },
    "Kristīgi demokrātiskā savienība": {
      color: "#de3b26",
      wiki: 23219426,
      name: "Kristīgi demokrātiskā savienība",
      code: "KDS",
      short: "KDS",
    },
    "Latvijas attīstībai": {
      color: "#000000",
      wiki: 44774789,
      name: "Latvijas attīstībai",
      code: "LA",
      short: "LA",
    },
    "LIEPĀJAS PARTIJA": {
      wiki: 44783611,
      color: "#59a236",
      name: "Liepājas Partija",
      code: "LIEPAJAS",
      short: "Liepājas",
    },
    'Partija "Vienoti Latvijai"': {
      wiki: 44987086,
      color: "#c8057f",
      name: "Vienoti Latvijai",
      code: "VIENOTI",
      short: "Vienoti Latvijai",
    },
    "Latvijas Sociāldemokrātiskā strādnieku partija": {
      wiki: 425575,
      color: "#943641",
      name: "Latvijas Sociāldemokrātiskā strādnieku partija",
      short: "LSDSP",
      code: "LSDSP",
    },
    'Partija "Gods kalpot Rīgai"': {
      wiki: 45665996,
      color: "#004898",
      name: "Gods kalpot Rīgai, Partija",
      code: "GKR",
      short: "GKR",
    },
    'Nacionālā apvienība "Visu Latvijai!"-"Tēvzemei un Brīvībai/LNNK"': {
      wiki: 28179603,
      color: "#952131",
      name: 'Nacionālā apvienība "Visu Latvijai!"-"Tēvzemei un Brīvībai/LNNK',
      code: "NA",
      short: "Nacionālā apvienība",
    },
    "APVIENOTAIS SARAKSTS - Latvijas Zaļā partija, Latvijas Reģionu Apvienība, Liepājas partija":
      {
        wiki: 71430208,
        color: "#ffa800",
        name: "Apvienotais saraksts — Latvijas Zaļā partija, Latvijas Reģionu Apvienība, Liepājas partija",
        short: "Apvienotais saraksts",
        code: "AS",
      },
    "No sirds Latvijai": {
      color: "#8f181b",
      name: "No sirds Latvijai",
      code: "NOSIRDS",
      short: "No sirds Latvijai",
    },
    "LPP/LC, Partija (Šlesera Reformu partija LPP/LC)": {
      wiki: 14176928,
      color: "#72166b",
      name: "Latvijas Pirmā partija/Latvijas Ceļš",
      code: "LPPLC",
      short: "LPP/LC",
    },
    "JKP Jaunā konservatīvā partija": {
      wiki: 57276839,
      color: "#313782",
      name: "Jaunā konservatīvā partija",
      code: "JKP",
      short: "JKP",
    },
    "Nacionālā Savienība TAISNĪGUMS": {
      wiki: 803638,
      color: "#700700",
      name: "Nacionālā Savienība Taisnīgums",
      code: "NST",
      short: "NST",
    },
    "Rīcības partija": {
      wiki: 67098313,
      color: "#164379",
      name: "Rīcības partija",
      code: "RICIBAS",
      short: "Rīcības partija",
    },
    "Par Cilvēcīgu Latviju": {
      wiki: 50687809,
      color: "#01acb4",
      name: "Par cilvēcīgu Latviju",
      code: "PCL",
      short: "PCL",
    },
    PROGRESĪVIE: {
      wiki: 57853722,
      color: "#f93822",
      name: "Progresīvie",
      code: "PRO",
      short: "PRO",
    },
    "APVIENĪBA IEDZĪVOTĀJI": {
      color: "#03989E",
      name: "Apvienība Iedzīvotāji",
      code: "IEDZIVOTAJI",
      short: "Apvienība Iedzīvotāji",
    },
    "Centra Partija": {
      wiki: 67099432,
      color: "#8d0710",
      name: "Centra partija",
      code: "CP",
      short: "CP",
    },
    'Kustība "Par!"': {
      wiki: 56703353,
      color: "#fff200",
      name: "Kustība Par!",
      code: "PAR",
      short: "Par!",
    },
    PLI: {
      wiki: 58683847,
      color: "#ffec00",
      name: "PLI",
      code: "PLI",
      short: "PLI",
    },
    "Latviešu Nacionālisti": {
      color: "#8B0000",
      name: "Latviešu Nacionālisti",
      code: "NACIONALISTI",
      short: "Latviešu Nacionālisti",
    },
    "Latvijas Reģionu Apvienība": {
      wiki: 44031407,
      color: "#9d1d32",
      name: "Latvijas Reģionu apvienība",
      code: "LRA",
      short: "LRA",
    },
    "Platforma 21": {
      wiki: 66677152,
      color: "#00a18e",
      name: "Platforma 21",
      code: "P21",
      short: "P21",
    },
    "Stabilitātei!": {
      wiki: 70940864,
      color: "#f77d02",
      name: "Stabilitātei!",
      code: "ST",
      short: "ST!",
    },
    "LATVIJA PIRMAJĀ VIETĀ": {
      wiki: 68481421,
      color: "#9e3049",
      name: "Latvija pirmajā vietā",
      code: "LPV",
      short: "LPV",
    },
    "Mēs mainām noteikumus": {
      color: "#210106",
      name: "Mēs mainām noteikumus",
      short: "Mēs mainām noteikumus",
      code: "REPUBLIKA",
      wiki: 69091648,
    },
    "SUVERĒNĀ VARA": {
      wiki: 71522959,
      color: "#6767ab",
      name: "Suverēnā vara",
      code: "SV",
      short: "SV",
    },
    "KOPĀ LATVIJAI": {
      color: "#9e3039",
      name: "Kopā Latvijai",
      code: "KOPA",
      short: "Kopā Latvijai",
    },
    "Jaunā VIENOTĪBA": {
      wiki: 34301823,
      color: "#6ab647",
      name: "Jaunā Vienotība",
      code: "JV",
      short: "JV",
    },
    "APVIENĪBA JAUNLATVIEŠI": {
      wiki: 73925276,
      color: "#c71410",
      name: "Apvienība Jaunlatvieši",
      code: "AJ",
      short: "AJ",
    },
    "VIDZEMES PARTIJA": {
      color: "#851521",
      name: "Vidzemes partija",
      code: "VP",
      short: "VP",
    },
    "Valmierai un Vidzemei": {
      color: "#b68251",
      name: "Valmierai un Vidzemei",
      code: "VV",
      short: "VV",
    },
    "Latvijai un Ventspilij": {
      color: "#00958e",
      name: "Latvijai un Ventspilij",
      code: "LuV",
      short: "LuV",
      wiki: 43162463,
    },
    "MŪSU PARTIJA": {
      name: "MŪSU Partija",
      short: "MŪSU Partija",
      code: "MUSU",
      color: "#511e60",
    },
    "Tauta. Zeme. Valstiskums.": {
      color: "#002344",
      name: "Tauta. Zeme. Valstiskums.",
      short: "Tauta. Zeme. Valstiskums.",
      code: "TZV",
    },
    "JĒKABPILS REĢIONĀLĀ PARTIJA": {
      name: "Jēkabpils reģionālā partija",
      short: "Jēkabpils",
      code: "JEKABPILS",
      color: "#2d4159",
    },
    "Mēs - Talsiem un novadam": {
      name: "Mēs - Talsiem un novadam",
      code: "MTN",
      short: "MTN",
      color: "#fbd707",
    },
    "SIGULDAS NOVADA PARTIJA": {
      name: "Siguldas novada partija",
      short: "Siguldas novada partija",
      code: "SNP",
      color: "#ea2134",
    },
    "Tev, Jūrmalai": {
      name: "Tev, Jūrmalai",
      short: "Tev, Jūrmalai",
      code: "TEVJURMALAI",
      color: "#43a2db",
    },
    "SARAUJ, LATGALE!": {
      name: "Sarauj, Latgale!",
      short: "Sarauj, Latgale!",
      code: "SARAUJ",
      color: "#17408b",
    },
    "Austošā Saule Latvijai": {
      name: "Austošā Saule Latvijai",
      short: "Austošā Saule Latvijai",
      code: "AUSTSAULE",
      color: "#9c2434",
      wiki: 80912390,
    },
    "Reģionu alianse": {
      name: "Reģionu alianse",
      short: "Reģionu alianse",
      code: "RA",
      color: "#2c2d6c",
    },
    "Gods kalpot mūsu Latvijai": {
      name: "Gods kalpot mūsu Latvijai",
      short: "Gods kalpot mūsu Latvijai",
      code: "GKL",
      color: "#690021",
    },
    "Daugavpils - mana pils": {
      name: "Daugavpils - mana pils",
      short: "Daugavpils - mana pils",
      code: "DAUGAVPILS",
      color: "#600320",
    },
    "Gobzema saraksts": {
      name: "Gobzema saraksts",
      short: "Gobzema saraksts",
      code: "GOBZEMASARAKSTS",
      color: "#0e1b3a",
      wiki: 66677152,
    },
  };

  donorMeta = donorMeta;

  cacheFile(yearTypeId: `${string}-${string}`) {
    return path.join(this.cacheDir, `donations-${yearTypeId}.html`);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const dateFrom = `01.01.${year}`;
    const dateTo = `31.12.${year}`;

    for (const [typeName, mapping] of Object.entries(knabTypeMapping)) {
      const url = `https://info.knab.gov.lv/lv/db/ziedojumi/?party_id-hidden=&party_id=&type_id=${mapping.knabTypeId}&donator=&date_from=${dateFrom}&date_to=${dateTo}&amount_from=&amount_to=&search=to+look+for&order=&dir=&all_pages=1&recordsPerPage=all`;

      this.log(`Loading "${typeName}" donation page for year ${year}: ${url}`);

      const { html } = await spawnBrowser(async (page) => {
        const response = await page.goto(url);
        try {
          await page.waitForSelector(".pageSizeDiv");
          // wait a second because they have some js animation that takes a while to finish
          await timeout(1000);
        } catch {
          throw new Error(`Unable to load ${url}: ${response?.status()}`);
        }

        const html = await page.evaluate(
          () => document.documentElement.outerHTML,
        );
        return { html };
      });

      await fs.writeFile(
        this.cacheFile(`${year}-${mapping.knabTypeId}`),
        html,
        {
          encoding: "utf8",
        },
      );
    }
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const donations: ExtractedYearData[] = [];

    for (const [typeName, mapping] of Object.entries(knabTypeMapping)) {
      const html = await this.cachedYearData(`${year}-${mapping.knabTypeId}`);

      this.log(`Extracting ${typeName} donation data for year ${year}`);

      const $ = cheerio.load(html);

      $("#donations tbody tr").each((idx, tr) => {
        const $tr = $(tr);

        const id = $($tr.find(".party a")).attr("href")?.split("id=")[1];
        const receiver = $($tr.find(".party")).text().trim();
        const amount = $($tr.find(".amount")).text().trim();
        const type = $($tr.find(".type")).text().trim();
        const donor = $($tr.find(".person"))
          .contents()
          .filter((idx) => idx === 0)
          .text()
          .trim();
        const date = $($tr.find(".date")).text().trim();

        assert(id, "Donation id not found");
        assert(
          knabTypeMapping[type],
          `Donation type can be mapped from KNAB type: ${type}`,
        );

        const donation: ExtractedYearData = {
          idx: `${year}-${mapping.knabTypeId}-${idx}`,
          [DonationField.Id]: id,
          [DonationField.Date]: this.normalizeIsoDate(this.parseDate(date)),
          [DonationField.DonorName]: donor,
          [DonationField.Amount]: this.parseAmount(amount),
          [DonationField.Receiver]: receiver as ReceiverId,
          [DonationField.DonationType]: knabTypeMapping[type].donationType,
          [DonationField.Address]: {
            [AddressField.Country]: "LV",
          } as ExtractedDonationAddress,
        };

        donations.push(donation);
      });
    }

    return donations;
  }

  private parseDate(date: string) {
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}` as `${number}-${number}-${number}`;
  }

  private parseAmount(amount: string): number {
    return parseFloat(amount.replace("EUR", ""));
  }

  protected override normalizeReceiver(receiver: string): string {
    receiver = super
      .normalizeReceiver(receiver)
      // remove (likvidēta 18.01.2021)
      .replace(/\s*\(likvidēta\s*\d{2}\.\d{2}\.\d{4}\)\s*/g, "")
      // remove Politiskā partija prefix
      .replace(/^Politiskā partija\s+/, "")
      // remove leading and trailing " if exists
      .replace(/^"(.+)"$/, "$1");

    if (receiver === "Republika") {
      // They've renamed Republika in feb 2026
      return "Mēs mainām noteikumus";
    }

    return receiver;
  }
}

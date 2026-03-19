import fs from "fs/promises";
import cp from "node:child_process";
import path from "path";

import { parse as parseCsv } from "csv-parse/sync";
import { parse as parseXlsx } from "node-xlsx";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";
import { generatePartyColor, RANDOM_COLOR_MARKER } from "../util";

import type { PartyConfig, ExtractedYearData } from "../data-loader";
import type { Countries } from "@/utils/countries";
import type { ReceiverId } from "@/utils/types";

import { isNotNullandNotUndefined } from "@/utils/array";
import { DONOR_TO_PARTY_BY_YEAR } from "@/utils/config";
import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

interface ReportRow {
  partyId: string;
  amount: string;
  currency: string;
  partyName: string;
}

export class FrLoader extends DataLoader {
  constructor() {
    super("FR", Country.france);
  }

  donorMeta = donorMeta;

  // parties from via https://en.wikipedia.org/wiki/List_of_political_parties_in_France#Major_nationwide_represented_parties
  // key is CNCCFP code from the dataset
  parties: Record<string, PartyConfig> = {
    "40": {
      name: "Rassemblement National (RN)",
      short: "Rassemblement National",
      code: "40",
      color: "#1b4677",
      wiki: 67119,
    },
    "910": {
      name: "Renaissance (RE)",
      short: "Renaissance",
      code: "910",
      color: "#1A203B",
      wiki: 52296603,
    },
    "976": {
      name: "La France Insoumise (LFI)",
      short: "La France Insoumise",
      code: "976",
      color: "#7B13D6",
      wiki: 52520313,
    },
    "401": {
      name: "Les Républicains (LR)",
      short: "Les Républicains",
      code: "401",
      color: "#f03939",
      wiki: 46843436,
    },
    "76": {
      name: "Parti Socialiste (PS)",
      short: "Parti Socialiste",
      code: "76",
      color: "#e3265b",
      wiki: 39565408,
    },
    "104": {
      name: "Europe Écologie Les Verts (LÉ)",
      short: "Europe Écologie Les Verts",
      code: "104",
      color: "#4CAF50",
      wiki: 33346383,
    },
    "529": {
      name: "Mouvement démocrate (MoDem)",
      short: "Mouvement démocrate",
      code: "529",
      color: "#ef5327",
      wiki: 10891032,
    },
    "1344": {
      name: "Horizons (HOR)",
      short: "Horizons",
      code: "1344",
      color: "#0000b9",
      wiki: 68946070,
    },
    "60": {
      name: "Parti communiste français (PCF)",
      short: "Parti communiste français",
      code: "60",
      color: "#e4002b",
      wiki: 319197,
    },
    "1307": {
      name: "Reconquête (REC)",
      short: "Reconquête",
      code: "1307",
      color: "#0b0b66",
      wiki: 69440972,
    },
    "96": {
      name: "Lutte ouvrière",
      short: "Lutte ouvrière",
      code: "96",
      color: "#CC0000",
      wiki: 323494,
    },
    "862": {
      name: "La Manif pour tous (LMPT)",
      short: "La Manif pour tous",
      code: "862",
      color: "#082e6b",
      wiki: 68598567,
    },
    "348": {
      name: "Parti chrétien-démocrate (PCD)",
      short: "Parti chrétien-démocrate",
      code: "348",
      color: "#007da5",
    },
    "410": {
      name: "Debout la République (DLR)",
      short: "Debout la République",
      code: "410",
      color: "#723e7f",
    },
    "806": {
      name: "Union populaire républicaine (UPR)",
      short: "Union populaire républicaine",
      code: "806",
      color: "#118088",
    },
    "519": {
      name: "Parti de Gauche (PG)",
      short: "Parti de Gauche",
      code: "519",
      color: "#b3081b",
      wiki: 20482838,
    },
    "578": {
      name: "Nouveau Parti anticapitaliste (NPA)",
      short: "Nouveau Parti anticapitaliste",
      code: "578",
      color: "#e21f20",
      wiki: 18630626,
    },
    "543": {
      name: "La Gauche moderne (LGM)",
      short: "La Gauche moderne",
      code: "543",
      color: "#a83578",
      wiki: 15330125,
    },
    "210": {
      name: "Solidarité et progrès (SP)",
      short: "Solidarité et progrès",
      code: "210",
      color: "#ffcc00",
    },
    "500": {
      name: "Génération France.fr",
      short: "Génération France.fr",
      code: "500",
      color: "#f69524",
    },
    "796": {
      name: "Nous Citoyens",
      short: "Nous Citoyens",
      code: "796",
      color: "#006895",
    },
    "1157": {
      name: "Picardie Debout !",
      short: "Picardie Debout !",
      code: "1157",
      color: "#ff4d56",
    },
    "702": {
      name: "Association des Amis d'Éric Ciotti",
      short: "Association des Amis d'Éric Ciotti",
      code: "702",
      color: "#004276",
    },
    "677": {
      name: "Pour la Réunion, de toutes nos forces (PLR)",
      short: "Pour la Réunion, de toutes nos forces",
      code: "677",
      color: "#b12674",
    },
    "305": {
      name: "Mouvement national républicain (MNR)",
      short: "Mouvement national républicain",
      code: "305",
      color: "#003d7e",
      wiki: 324025,
    },
    "1027": {
      name: "Les Patriotes (LP)",
      short: "Les Patriotes",
      code: "1027",
      color: "#ff9101",
      wiki: 56065956,
    },
    "52": {
      name: "Parti radical de gauche (PRG)",
      short: "Parti radical de gauche",
      code: "52",
      color: "#34495e",
      wiki: 569331,
    },
    "945": {
      name: "Génération.s",
      short: "Génération.s",
      code: "945",
      color: "#2d3342",
      wiki: 20482838,
    },
    "1323": {
      name: "La Primaire Populaire",
      short: "La Primaire Populaire",
      code: "1323",
      color: "#F44E07",
    },
    "813": {
      name: "Alliance solidaire des Français de l'étranger (ASFE)",
      short: "Alliance solidaire des Français de l'étranger",
      code: "813",
      color: "#212e50",
    },
    "368": {
      name: "Association de soutien à l’action de Nicolas Sarkozy",
      short: "Association de soutien à l’action de Nicolas Sarkozy",
      code: "368",
      color: "#993300",
    },
    "360": {
      name: "France.9",
      short: "France.9",
      code: "360",
      color: "#252122",
    },
    "568": {
      name: "Changer, c'est possible",
      short: "Changer, c'est possible",
      code: "568",
      color: "#e74c3c",
    },
    "697": {
      name: "Avec BLM",
      short: "Avec BLM",
      code: "697",
      color: "#235987",
    },
    "542": {
      name: "La Droite Sociale / Nouvel Oxygène",
      short: "La Droite Sociale / Nouvel Oxygène",
      code: "542",
      color: "#85b9e5",
    },
    "834": {
      name: "Nouvelle Énergie (NE)",
      short: "Nouvelle Énergie",
      code: "834",
      color: "#b0ad85",
      wiki: 79542992,
    },
    "740": {
      name: "La Manufacture",
      short: "La Manufacture",
      code: "740",
      color: RANDOM_COLOR_MARKER,
    },
    "597": {
      name: "Bloc Identitaire - Mouvement social européen",
      short: "Bloc Identitaire",
      code: "597",
      color: "#000000",
    },
    "303": {
      name: "Rassemblement des Contribuables Français (RCF)",
      short: "Rassemblement des Contribuables Français",
      code: "303",
      color: "#231f20",
    },
    "694": {
      name: "L'Autre Chemin pour la Gauche",
      short: "L'Autre Chemin pour la Gauche",
      code: "694",
      color: RANDOM_COLOR_MARKER,
    },
    "1116": {
      name: "Association des amis de Martine Vassal",
      short: "Association des amis de Martine Vassal",
      code: "1116",
      color: RANDOM_COLOR_MARKER,
    },
    "398": {
      name: "Cap sur l'Avenir 13",
      short: "Cap sur l'Avenir 13",
      code: "398",
      color: RANDOM_COLOR_MARKER,
    },
    "265": {
      name: "France Moderne",
      short: "France Moderne",
      code: "265",
      color: RANDOM_COLOR_MARKER,
    },
    "709": {
      name: "Union des démocrates et indépendants (UDI)",
      short: "Union des démocrates et indépendants",
      code: "709",
      color: "#5f468f",
      wiki: 37713856,
    },
    "563": {
      name: "Écouter pour agir",
      short: "Écouter pour agir",
      code: "563",
      color: "#c78f30",
    },
    "1191": {
      name: "ABG",
      short: "ABG",
      code: "1191",
      color: RANDOM_COLOR_MARKER,
    },
    "712": {
      name: "La France Droite",
      short: "La France Droite",
      code: "712",
      color: RANDOM_COLOR_MARKER,
    },
    "334": {
      name: "Cotelec",
      short: "Cotelec",
      code: "334",
      color: RANDOM_COLOR_MARKER,
    },
  };

  private readonly yearConfig: Record<
    string,
    {
      url: string;
      type: "csv" | "xlsx" | "ods";
      dataStartOffset: number;
      partyIdIdx: number;
      unitIdx: number;
      amountIdx: number;
      euroUnit: string;
    }
  > = {
    "2024": {
      type: "csv",
      url: "https://www.data.gouv.fr/api/1/datasets/r/8c53e69e-607a-49d9-98d7-7dabad5ec4a9",
      dataStartOffset: 1,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "EUR",
    },
    "2023": {
      type: "csv",
      url: "https://www.data.gouv.fr/api/1/datasets/r/4b43730a-afdc-4992-9c7c-9993eb0c4286",
      dataStartOffset: 1,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "EUR",
    },
    "2022": {
      type: "csv",
      url: "https://www.data.gouv.fr/api/1/datasets/r/18579f4b-d74f-4672-8b17-85cecc0dc709",
      dataStartOffset: 1,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "EUR",
    },
    "2021": {
      type: "csv",
      url: "https://www.data.gouv.fr/api/1/datasets/r/cd02859c-d006-4551-a337-3d1955f00569",
      dataStartOffset: 1,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "EUR",
    },
    "2020": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/f82d24ad-9f6a-4fb5-a4ce-de76a5d8a39a",
      dataStartOffset: 3,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "Euro",
    },
    "2019": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/b3ab8f67-a947-487d-bb90-f6278622b462",
      dataStartOffset: 3,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "euro",
    },
    "2018": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/b52e6551-a206-4cf1-a43b-cc4806c7d862",
      dataStartOffset: 3,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 105,
      euroUnit: "euro",
    },
    "2017": {
      type: "ods",
      url: "https://www.data.gouv.fr/api/1/datasets/r/51da0471-9ad1-4e36-8cd9-9e57866c38c9",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 68,
      euroUnit: "euro",
    },
    "2016": {
      type: "ods",
      url: "https://www.data.gouv.fr/api/1/datasets/r/9ca632af-ab64-437a-8273-f9c3a5b6d95f",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 68,
      euroUnit: "euro",
    },
    "2015": {
      type: "ods",
      url: "https://www.data.gouv.fr/api/1/datasets/r/c3853a70-dddd-4d40-b8c7-261c3e5cf95b",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 68,
      euroUnit: "euro",
    },
    "2014": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/76bf3422-ec51-4414-b2b1-b10ba09b2db1",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 68,
      euroUnit: "euro",
    },
    "2013": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/7a838065-7cbe-402d-922f-a001e6d6a54d",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 68,
      euroUnit: "euro",
    },
    "2012": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/33ef3319-cabd-4a44-85b3-dab7814d9e2e",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 67,
      euroUnit: "euro",
    },
    "2011": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/17c5ac62-b8ff-4493-bd9f-b0269e7fe771",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 67,
      euroUnit: "euro",
    },
    "2010": {
      type: "xlsx",
      url: "https://www.data.gouv.fr/api/1/datasets/r/627daca4-721d-4223-a110-6d12bbd3b973",
      dataStartOffset: 2,
      partyIdIdx: 0,
      unitIdx: 2,
      amountIdx: 67,
      euroUnit: "euro",
    },
  };

  cacheFile(year: string, extension: "csv" | "xlsx" = "csv") {
    return path.join(this.cacheDir, `donations-${year}.${extension}`);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const yearUrl = this.yearConfig[year];

    if (!yearUrl) {
      throw `No URL found for year ${year}`;
    }

    const { url, type } = yearUrl;

    this.log(`Loading data for year ${year} from ${url}...`);
    const res = await fetch(url);
    if (!res.ok) {
      throw `Unable to load ${url}: ${res.status}`;
    }

    const resBuf = await res.arrayBuffer();

    switch (type) {
      case "csv": {
        await fs.writeFile(
          this.cacheFile(year, "csv"),
          new TextDecoder("utf8").decode(resBuf),
          { encoding: "utf8" },
        );
        break;
      }
      case "xlsx": {
        await fs.writeFile(this.cacheFile(year, "xlsx"), Buffer.from(resBuf));
        break;
      }
      case "ods": {
        const odtFile = this.cacheFile(year, "csv").replace(".csv", ".ods");

        // convert ods to csv via libreoffice
        await fs.writeFile(odtFile, Buffer.from(resBuf), {
          encoding: "utf8",
        });

        this.log(`Converting ${odtFile} to csv`);

        // transform ods to csv in the format that the upstream csv are so we can reuse the parsing logic
        cp.execSync(
          `libreoffice --headless --convert-to csv:"Text - txt - csv (StarCalc):59,34,76" ${odtFile}`,
          {
            cwd: this.cacheDir,
          },
        );
        break;
      }
    }
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const yearUrl = this.yearConfig[year];

    if (!yearUrl) return [];

    let rows: ReportRow[] = [];

    const { partyIdIdx, unitIdx, amountIdx, euroUnit, dataStartOffset } =
      this.yearConfig[year];

    switch (yearUrl.type) {
      case "ods":
      case "csv": {
        const csv = await this.cachedYearData(year);

        rows = parseCsv(csv, {
          delimiter: ";",
          skip_empty_lines: true,
          columns: false,
        })
          .slice(dataStartOffset)
          .map(
            (row: string[]): ReportRow => ({
              partyId: `${row[partyIdIdx]}`,
              amount: `${row[amountIdx]}`,
              currency: row[unitIdx] === euroUnit ? "EUR" : `${row[unitIdx]}`,
              partyName: row[1],
            }),
          );
        break;
      }
      case "xlsx": {
        const [donationsSheet] = parseXlsx(this.cacheFile(year, "xlsx"), {});

        rows = donationsSheet.data.slice(dataStartOffset).map(
          (row): ReportRow => ({
            partyId: `${row[partyIdIdx]}`,
            amount: `${row[amountIdx]}`,
            currency: row[unitIdx] === euroUnit ? "EUR" : `${row[unitIdx]}`,
            partyName: row[1],
          }),
        );
        break;
      }
    }

    return rows
      .map((row: ReportRow, idx: number) => {
        let party = this.parties[row.partyId];

        if (!party) {
          // populate parties for the id with the provided name
          this.parties[row.partyId] = {
            name: row.partyName,
            short: row.partyName,
            code: row.partyId,
            color: "#11ccee",
          };
          party = this.parties[row.partyId];
        }

        if (party.color === RANDOM_COLOR_MARKER) {
          party.color = generatePartyColor(row.partyId);
        }

        if (row.currency !== "EUR") {
          this.log(
            `(${year}) Skipping row with non-euro unit: ${row.currency} (row: ${idx})`,
          );
          return;
        }

        return {
          idx: `${idx}`,
          [DonationField.Date]: year,
          [DonationField.Receiver]: row.partyId as ReceiverId,
          [DonationField.Amount]: parseNumber(row["amount"]),
          [DonationField.DonorName]: `${DONOR_TO_PARTY_BY_YEAR}_${year}_${party.code}`,
          [DonationField.Address]: {
            [AddressField.Country]: "FR" as Countries,
          },
        };
      })
      .filter(isNotNullandNotUndefined);
  }
}

const parseNumber = (str: string): number => {
  return parseFloat(str.replace(/,/g, "."));
};

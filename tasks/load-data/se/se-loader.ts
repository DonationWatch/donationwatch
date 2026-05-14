// oxlint-disable no-unused-vars
import assert from "assert";
import { parse } from "csv-parse/sync";
import fs from "fs/promises";
import path from "path";

import type { DonationAddress, ReceiverId } from "@/utils/types";

import { isNotNullandNotUndefined } from "@/utils/array";
import { DONOR_TO_PARTY_BY_YEAR } from "@/utils/config";
import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";

export class SeLoader extends DataLoader {
  parties: Record<string, PartyConfig> = {
    "2": {
      name: "Arbetarepartiet-Socialdemokraterna",
      short: "Arbetarepartiet-Socialdemokraterna",
      code: "2",
      color: "#ec1f36",
      wiki: 202978,
    },
    "1": {
      name: "Moderata samlingspartiet",
      short: "Moderaterna",
      code: "1",
      wiki: 202985,
      color: "#293d9b",
    },
    "4": {
      name: "Centerpartiet (C)",
      short: "Centerpartiet",
      code: "4",
      wiki: 217370,
      color: "#1a4234",
    },
    "110": {
      name: "Sverigedemokraterna (SD)",
      short: "Sverigedemokraterna",
      code: "110",
      wiki: 65873,
      color: "#ffde00",
    },
    "5": {
      name: "Vänsterpartiet (V)",
      short: "Vänsterpartiet",
      code: "5",
      wiki: 42034705,
      color: "#eb1923",
    },
    "55": {
      name: "Miljöpartiet de gröna (MP)",
      short: "Miljöpartiet de gröna",
      code: "55",
      wiki: 217373,
      color: "#005630",
    },
    "3": {
      name: "Liberalerna (L)",
      short: "Liberalerna",
      code: "3",
      wiki: 217366,
      color: "#006ab3",
    },
    "68": {
      name: "Kristdemokraterna (KD)",
      short: "Kristdemokraterna",
      code: "68",
      wiki: 217369,
      color: "#005ea1",
    },
    "1296": {
      name: "Medborgerlig Samling (MED)",
      short: "Medborgerlig Samling",
      code: "1296",
      wiki: 54550590,
      color: "#002e6b",
    },
    "532": {
      name: "Feministiskt initiativ (FI)",
      short: "Feministiskt initiativ",
      code: "532",
      wiki: 1853345,
      color: "#CD1B68",
    },
    "1325": {
      name: "Alternativ för Sverige (AFS)",
      short: "Alternativ för Sverige",
      code: "1325",
      wiki: 56960152,
      color: "#19489D",
    },
    "1659": {
      name: "Folklistan",
      short: "Folklistan",
      code: "1659",
      wiki: 76566291,
      color: "#182f50",
    },
    "1458": {
      name: "Linköpingslistan (LL)",
      short: "Linköpingslistan",
      code: "1458",
      color: "#145570",
    },
    "471": {
      name: "Kommunistiska Partiet (K)",
      short: "Kommunistiska Partiet",
      code: "471",
      wiki: 869505,
      color: "#ED4C24",
    },
    "1297": {
      name: "Demokraterna",
      short: "Demokraterna",
      code: "1297",
      wiki: 65985701,
      color: "#ffe102",
    },
    "1152": {
      name: "Örebropartiet (ÖP)",
      short: "Örebropartiet",
      code: "1152",
      color: "#ff0505",
      wiki: 43685453,
    },
    "524": {
      name: "Piratpartiet (PP)",
      short: "Piratpartiet",
      code: "524",
      wiki: 5058291,
      color: "#000000",
    },
    "1505": {
      name: "Knapptryckarna",
      short: "Knapptryckarna",
      code: "1505",
      color: "#f00000",
    },
    "1543": {
      name: "Klimatalliansen",
      short: "Klimatalliansen",
      code: "1543",
      color: "#2e2d2b",
      wiki: 71524192,
    },
    "1439": {
      name: "Partiet Nyans",
      short: "Partiet Nyans",
      code: "1439",
      color: "#fe8444",
      wiki: 71791439,
    },
    "1551": {
      name: "Kristna Värdepartiet (KRVP)",
      short: "Kristna Värdepartiet",
      code: "1551",
      color: "#5e194c",
    },
    "1063": {
      name: "Sveriges Kommunistiska Parti (SKP)",
      short: "Sveriges Kommunistiska Parti",
      code: "1063",
      color: "#c01e25",
      wiki: 13017,
    },
    // Note they recently renamed in nov 2025 but the upstream data still uses the old name
    "1563": {
      name: "Halmstadpartiet",
      short: "Halmstadpartiet",
      code: "1563",
      color: "#6565fd",
    },
    "1011": {
      name: "Landsbygdspartiet Oberoende",
      short: "Landsbygdspartiet Oberoende",
      code: "1011",
      color: "#007229",
      wiki: 60578755,
    },
    "189": {
      name: "Enhet",
      short: "Enhet",
      code: "189",
      color: "#5CB43C",
      wiki: 4613015,
    },
    "1379": {
      name: "Älska Svedala",
      short: "Älska Svedala",
      code: "1379",
      color: "#146935",
    },
    "1464": {
      name: "Framtid Kalmar",
      short: "Framtid Kalmar",
      code: "1464",
      color: "#322667",
    },
    "1273": {
      name: "Nordiska motståndsrörelsen (NMR)",
      short: "Nordiska motståndsrörelsen",
      code: "1273",
      color: "#264e37",
      wiki: 23772325,
    },
    "1151": {
      name: "Realistpartiet",
      short: "Realistpartiet",
      code: "1151",
      color: "#ffe011",
    },
    "1150": {
      name: "Direktdemokraterna",
      short: "Direktdemokraterna",
      code: "1150",
      color: "#f5821f",
    },
    "1355": {
      name: "Bevara akutsjukhusen",
      short: "Bevara akutsjukhusen",
      code: "1355",
      color: "#d01315",
    },
    "1430": {
      name: "Partiet Vändpunkt",
      short: "Partiet Vändpunkt",
      code: "1430",
      color: "#690955",
    },
    "465": {
      name: "Roslagspartiet (ROSP)",
      short: "Roslagspartiet",
      code: "465",
      color: "#00488f",
    },
    "187": {
      name: "Dorotea Kommunlista (DKL)",
      short: "Dorotea Kommunlista",
      code: "187",
      color: "#181518",
    },
    "1339": {
      name: "Romelepartiet Skåne",
      short: "Romelepartiet Skåne",
      code: "1339",
      color: "#0076c4",
    },
    "543": {
      name: "Nackalistan",
      short: "Nackalistan",
      code: "543",
      color: "#804595",
    },
    "1116": {
      name: "Waxholmspartiet - Borgerligt Alternativ",
      short: "Waxholmspartiet - Borgerligt Alternativ",
      code: "1116",
      color: "#cacaca",
    },
    "1750": {
      name: "Lokalpartiet Malung-Sälen",
      short: "Lokalpartiet Malung-Sälen",
      code: "1750",
      color: "#2f5666",
    },
  };
  donorMeta = donorMeta;

  private loadedOnce = false;
  private extractedOnce = false;

  constructor() {
    super("SE", Country.sweden);
  }

  cacheFile(): string {
    return path.join(this.cacheDir, `donations.csv`);
  }

  async loadYearDataToCache(): Promise<void> {
    if (this.loadedOnce) {
      this.log(
        "Skipping year data load, already ran and loaded everything at once",
      );
      return;
    }

    this.loadedOnce = true;

    const url =
      "https://partiinsyn.kammarkollegiet.se/PartiinsynOpenData/PartiinsynOpenData.csv";

    const res = await fetch(url);

    if (!res.ok) {
      throw `Unable to load ${url}: ${res.status}`;
    }

    const resBuf = await res.arrayBuffer();
    await fs.writeFile(this.cacheFile(), Buffer.from(resBuf));
  }

  async extractYearData(): Promise<ExtractedYearData[]> {
    if (this.extractedOnce) {
      this.log(
        "Skipping year data extraction, already ran and loaded everything at once",
      );
      return [];
    }

    this.extractedOnce = true;

    const csv = await this.cachedYearData("", "utf16le");
    const rows = parse(csv, {
      delimiter: "\t",
      quote: false,
      skip_empty_lines: true,
      columns: false,
      from: 2,
      relax_column_count: true,
    });

    const trackedCategories = new Set<string>([
      "4", // 4 Insamling av kontanter
      "5", // 5 Bidrag
    ]);

    return rows
      .map((row: string[], idx: number) => {
        const [
          Räkenskapsår,
          Organisationsnummer,
          Namn,
          PartitillhörighetPartiid,
          Partitillhörighet,
          VerksamPåKommunalNivå,
          LänKommunKod,
          Kommun,
          VerksamPåRegionalNivå,
          Länsbokstav,
          Region,
          VerksamPåRiksnivå,
          Valkrets,
          VerksamInomEU,
          IntäktsgruppFältkod,
          Intäktsgrupp,
          IntäktstypFältkod,
          Intäktstyp,
          IntäktstypBeskrivning,
          BeloppIKr,
        ] = row;

        if (!trackedCategories.has(IntäktsgruppFältkod)) {
          return null;
        }

        const amount = parseFloat(
          (BeloppIKr || "0").replace(/\s/g, "").replace(",", "."),
        );
        const party = Partitillhörighet;
        const partyId = PartitillhörighetPartiid || Organisationsnummer;
        const year = Räkenskapsår;

        assert(party, "Missing party");
        assert(partyId, "Missing party ID");

        if (partyId === "999999")
          // "Utan partibeteckning" which is basically "no party affiliation" so we can skip it since we don't have a good way to represent it and it's not a real party
          return;

        return {
          idx: `r${idx}`,
          [DonationField.Receiver]: partyId as ReceiverId,
          [DonationField.Amount]: amount,
          [DonationField.Date]: year,
          [DonationField.Address]: {
            [AddressField.Country]: "SE",
          } as DonationAddress,
          // use marked donor name because they don't list individual donors
          [DonationField.DonorName]: `${DONOR_TO_PARTY_BY_YEAR}_${year}_${partyId}`,
        };
      })
      .filter(isNotNullandNotUndefined);
  }
}

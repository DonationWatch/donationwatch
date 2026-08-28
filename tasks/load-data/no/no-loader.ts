import fs from "fs/promises";
import path from "path";

import type {
  DonationAddress,
  ExtractedDonationAddress,
  ReceiverId,
} from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { timeout } from "../util";
import { donorMeta } from "./donor-meta";

export interface NoDonation {
  party: string;
  partyUnit: string;
  donator: string;
  address: string;
  sum: number;
}

export class NoLoader extends DataLoader {
  parties: Record<string, PartyConfig> = {
    "Sosialistisk Venstreparti": {
      name: "Sosialistisk Venstreparti",
      short: "Sosialistisk Venstreparti",
      code: "SV",
      color: "#440C1A",
      wiki: 324745,
    },
    Pensjonistpartiet: {
      name: "Pensjonistpartiet",
      short: "Pensjonistpartiet",
      code: "PENSJONIST",
      color: "#343257",
      wiki: 1911414,
    },
    Rødt: {
      name: "Rødt",
      short: "Rødt",
      code: "R",
      color: "#e31c23",
      wiki: 9975733,
    },
    Senterpartiet: {
      name: "Senterpartiet",
      short: "Senterpartiet",
      code: "SP",
      color: "#01612e",
      wiki: 325477,
    },
    Høyre: {
      name: "Høyre",
      short: "Høyre",
      code: "H",
      color: "#0265F0",
      wiki: 1241411,
    },
    Arbeiderpartiet: {
      name: "Arbeiderpartiet",
      short: "Arbeiderpartiet",
      code: "AP",
      color: "#ef303e",
      wiki: 255341,
    },
    Fremskrittspartiet: {
      name: "Fremskrittspartiet",
      short: "Fremskrittspartiet",
      code: "FRP",
      color: "#003955",
      wiki: 161672,
    },
    Venstre: {
      name: "Venstre",
      short: "Venstre",
      code: "V",
      color: "#006666",
      wiki: 1241967,
    },
    Konservativt: {
      name: "Konservativt",
      short: "Konservativt",
      code: "K",
      color: "#2a2d70",
    },
    "Miljøpartiet De Grønne": {
      name: "Miljøpartiet De Grønne",
      short: "Miljøpartiet De Grønne",
      code: "MDG",
      color: "#337102",
      wiki: 857400,
    },
    Liberalistene: {
      name: "Liberalistene",
      short: "Liberalistene",
      code: "LIB",
      color: "#49154a",
      wiki: 45225082,
    },
    "Velferd og Innovasjonspartiet": {
      name: "Velferd og Innovasjonspartiet",
      short: "Velferd og Innovasjonspartiet",
      code: "VIPARTIET",
      color: "#f58232",
    },
    "Kristelig Folkeparti": {
      name: "Kristelig Folkeparti",
      short: "Kristelig Folkeparti",
      code: "KRF",
      color: "#fded34",
      wiki: 292768,
    },
    "Partiet Sentrum": {
      name: "Partiet Sentrum",
      short: "Partiet Sentrum",
      code: "S",
      color: "#C93960",
      wiki: 24602780,
    },
    Kystpartiet: {
      name: "Kystpartiet",
      short: "Kystpartiet",
      code: "KYSTPARTIET",
      wiki: 669303,
      color: "#162441",
    },
    "Norges Kommunistiske Parti": {
      name: "Norges Kommunistiske Parti",
      short: "Norges Kommunistiske Parti",
      code: "NKP",
      color: "#CD2020",
      wiki: 2037826,
    },
    Norgesdemokratene: {
      name: "Norgesdemokratene",
      short: "Norgesdemokratene",
      code: "ND",
      color: "#00205b",
      wiki: 1977860,
    },
    Inpartiet: {
      name: "Industri- og Næringspartiet",
      short: "Inpartiet",
      code: "INP",
      color: "#F75415",
      wiki: 68721338,
    },
    "Partiet DNI": {
      name: "Det norske Industriparti",
      short: "Partiet DNI",
      code: "DNI",
      color: "#812468",
    },
    Ensomhetspartiet: {
      name: "Ensomhetspartiet",
      short: "Ensomhetspartiet",
      code: "ENSOMHETSPARTIET",
      color: "#511a46",
    },
    Generasjonspartiet: {
      name: "Generasjonspartiet",
      short: "Generasjonspartiet",
      code: "GENERASJONSPARTIET",
      color: "#000000",
    },
    "Fred og rettferdighet (FOR)": {
      name: "Fred og rettferdighet (FOR)",
      short: "Fred og rettferdighet",
      code: "FOR",
      color: "#d14444",
      wiki: 80022084,
    },
  };

  constructor() {
    super("NO", Country.norway);
  }

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.json`);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const url = `https://www.partifinansiering.no/en/annual-donations/Json?year=${year}&name=&centralPartyListCode=&partyLevelId=-1&countyId=-1&municipalityId=-1`;
    this.log("Fetching", url);

    const res = await fetch(url);

    // Don't overload NO api
    await timeout(1000);

    const json = await res.json();

    await fs.writeFile(this.cacheFile(year), JSON.stringify(json, null, " "), {
      encoding: "utf8",
    });
  }

  public transformRawDonation(
    donation: NoDonation,
    year: string,
    idx: number,
  ): ExtractedYearData {
    const address: DonationAddress = { [AddressField.Country]: "NO" };

    return {
      idx: `r${idx}`,
      [DonationField.Amount]: donation.sum,
      [DonationField.DonorName]: this.normalizeDonor(donation.donator, address),
      [DonationField.Date]: year,
      [DonationField.Address]: address,
      [DonationField.Receiver]: donation.party as ReceiverId,
    };
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const donations = JSON.parse(
      await this.cachedYearData(year),
    ) as NoDonation[];

    return donations.map((donation, idx) =>
      this.transformRawDonation(donation, year, idx),
    );
  }

  protected override normalizeReceiver(receiver: string) {
    const normalized = super.normalizeReceiver(receiver);
    const lower = normalized.toLowerCase();
    const words = normalized.split(" ");

    if (
      lower.includes("arbeiderparti") ||
      lower.includes("arbeidarparti") ||
      // Include youth wing as well
      lower.includes("arbeidernes ungdomsfylking") ||
      words.includes("AUF") ||
      normalized.includes("ARB PARTI") ||
      normalized === "Midtre Gauldal Ap"
    ) {
      return "Arbeiderpartiet";
    }
    if (
      lower.includes("kristeleg folkeparti") ||
      lower.includes("kristelig folkeparti") ||
      normalized === "Bergen KrFs hovedstyre" ||
      words.includes("KrFU") ||
      words.some((w) => w.toLowerCase() === "krf")
    ) {
      return "Kristelig Folkeparti";
    }
    if (
      lower.includes("sosialistisk venstreparti") ||
      lower.includes("sosialistisk ungdom") ||
      words.some((w) => w.toLowerCase() === "sv") ||
      lower.includes("sosialistiske venstreparti") ||
      words.includes("SU") ||
      normalized === "NEDRE EIKER SOSIALISTISK"
    ) {
      return "Sosialistisk Venstreparti";
    }
    if (
      lower.includes("framstegsparti") ||
      lower.includes("fremskrittsparti") ||
      words.some((w) => w.toLowerCase() === "frp" || w.toLowerCase() === "fpu")
    ) {
      return "Fremskrittspartiet";
    }
    if (
      words.some(
        (w) => w.toLowerCase().includes("høyre") || w.toLowerCase() === "høgre",
      )
    ) {
      return "Høyre";
    }
    if (
      lower.includes("de grønne") ||
      lower.includes("grønn ungdom") ||
      lower.includes("miljøpartiet dei grøne") ||
      words.includes("MDG")
    ) {
      return "Miljøpartiet De Grønne";
    }
    if (lower.includes("liberalistene")) {
      return "Liberalistene";
    }
    if (lower.includes("konservativt") || lower.includes("de kristne")) {
      return "Konservativt";
    }
    if (
      lower.includes("senterpartiet") ||
      lower.includes("senterparti") ||
      lower.includes("senterungdom") ||
      lower === "lillestrøm sp" ||
      lower === "nordre follo sp"
    ) {
      return "Senterpartiet";
    }
    if (words.some((w) => w.toLowerCase() === "venstre")) {
      return "Venstre";
    }
    if (
      words.some((w) => w.toLowerCase() === "rødt") ||
      words.includes("Raudt") ||
      normalized === "RØD UNGDOM"
    ) {
      return "Rødt";
    }
    if (words.includes("Sentrum")) {
      return "Partiet Sentrum";
    }
    if (lower.includes("pensjonistparti")) {
      return "Pensjonistpartiet";
    }
    if (words.includes("Norgesdemokratene")) {
      return "Norgesdemokratene";
    }
    if (lower.includes("kystpartiet")) {
      return "Kystpartiet";
    }
    if (words.some((w) => w.toLowerCase() === "inp")) {
      return "Inpartiet";
    }
    if (words.includes("NKP")) {
      return "Norges Kommunistiske Parti";
    }
    if (lower.includes("velferd og innovasjonspartiet")) {
      return "Velferd og Innovasjonspartiet";
    }
    if (normalized === "FOR Rogaland - partiet for Fred og Rettferdighet") {
      return "Fred og rettferdighet (FOR)";
    }

    return normalized;
  }

  protected override normalizeDonor(
    donor: string,
    _address: ExtractedDonationAddress,
  ): string {
    const normalized = super.normalizeDonor(donor, _address);

    if (
      normalized.startsWith("Landsorganisasjonen ") ||
      normalized.startsWith("LO Norge")
    ) {
      return "Landsorganisasjonen i Norge";
    }

    return normalized;
  }
}

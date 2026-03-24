import fs from "fs/promises";
import path from "path";

import type { ReceiverId } from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField, DonorType } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { timeout } from "../util";
import { donorMeta } from "./donor-meta";

interface CompanyDonation {
  company: string;
  date: string;
  money: number;
}
interface PersonDonation {
  lastName: string;
  firstName: string;
  date: string;
  money: number;
}

interface PartyDef {
  shortName: string;
  longName: string;
  donations: (CompanyDonation | PersonDonation)[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCompanyDonation = (donation: any): donation is CompanyDonation =>
  typeof donation.company === "string";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPersonDonation = (donation: any): donation is PersonDonation =>
  typeof donation.firstName === "string";

export class CzLoader extends DataLoader {
  parties: Record<string, PartyConfig> = {
    ANO: {
      wiki: 40808475,
      color: "#262262",
      name: "Akce nespokojených občanů",
      code: "ANO",
      short: "ANO",
    },
    ODS: {
      wiki: 424618,
      color: "#034ea2",
      name: "Občanská demokratická strana",
      code: "ODS",
      short: "ODS",
    },
    STAN: {
      wiki: 29339964,
      color: "#ce0f68",
      name: "Starostové a nezávislí",
      code: "STAN",
      short: "STAN",
    },
    "KDU-ČSL": {
      wiki: 424612,
      color: "#f3c308",
      name: "Křesťanská a demokratická unie – Československá strana lidová",
      code: "KDU",
      short: "KDU-ČSL",
    },
    SPD: {
      wiki: 46867556,
      color: "#2175bb",
      name: "Svoboda a přímá demokracie",
      code: "SPD",
      short: "SPD",
    },
    "TOP 09": {
      wiki: 23186653,
      color: "#ff0053",
      name: "Tradice Odpovědnost Prosperita",
      code: "TOP09",
      short: "TOP 09",
    },
    Piráti: {
      wiki: 23321937,
      color: "#000000",
      name: "Česká pirátská strana",
      code: "PIRATI",
      short: "Piráti",
    },
    "SEN 21": {
      wiki: 57523928,
      color: "#1A4A73",
      name: "Senátor 21",
      code: "SEN21",
      short: "SEN 21",
    },
    SOCDEM: {
      wiki: 424606,
      color: "#FF5F60",
      name: "Sociální demokracie",
      code: "SOCDEM",
      short: "SOCDEM",
    },
    SLK: {
      color: "#511966",
      name: "Starostové pro Liberecký kraj",
      code: "SLK",
      short: "SLK",
      wiki: 52116404,
    },
    KSČM: {
      wiki: 356707,
      color: "#cc0808",
      name: "Komunistická strana Čech a Moravy",
      code: "KSCM",
      short: "KSČM",
    },
    Svobodní: {
      wiki: 21064305,
      color: "#008c72",
      name: "Svobodní",
      code: "SVOBODNI",
      short: "Svobodní",
    },
    NEZ: {
      wiki: 70413059,
      color: "#07add2",
      name: "Nezávislí",
      code: "NEZ",
      short: "NEZ",
    },
    APB: {
      wiki: 54173130,
      color: "#005094",
      name: "Aliance pro budoucnost",
      code: "APB",
      short: "APB",
    },
    Zelení: {
      wiki: 3402439,
      color: "#60b44c",
      name: "Strana zelených",
      code: "ZELENI",
      short: "Zelení",
    },
    REAL: {
      wiki: 52371359,
      color: "#013888",
      name: "Realisté",
      code: "REAL",
      short: "Realisté",
    },
    AUTO: {
      wiki: 76614519,
      color: "#007fc7",
      name: "Motoristé sobě",
      code: "AUTO",
      short: "AUTO",
    },
    CESTA: {
      color: "#104382",
      name: "CESTA ODPOVĚDNÉ SPOLEČNOSTI",
      code: "CESTA",
      short: "CESTA",
    },
    Ostravak: {
      wiki: 69124730,
      color: "#ee2b47",
      name: "Ostravak hnutí občanů",
      code: "OSTRAVAK",
      short: "Ostravak",
    },
    "PRO Plzeň": {
      color: "#28426d",
      name: "PRO PLZEŇ",
      code: "PROPLZEN",
      short: "PRO Plzeň",
    },
    "ČSNS 2005": {
      wiki: 765277,
      color: "#ffd132",
      name: "Česká strana národně socialistická",
      code: "CSNS",
      short: "ČSNS 2005",
    },
    SPO: {
      wiki: 42483494,
      color: "#303e90",
      name: "Strana Práv Občanů",
      code: "SPO",
      short: "SPO",
    },
    Trikolora: {
      wiki: 61007737,
      color: "#c8303a",
      name: "Trikolora",
      code: "TRIKOLORA",
      short: "Trikolora",
    },
    "PRO 2022": {
      wiki: 71678234,
      color: "#f4b400",
      name: "Právo Respekt Odbornost",
      code: "PRO2022",
      short: "PRO",
    },
    PŘÍSAHA: {
      name: "PŘÍSAHA občanské hnutí",
      code: "PRISAHA",
      short: "PŘÍSAHA",
      color: "#0033ff",
      wiki: 66515780,
    },
    ANS: {
      name: "Aliance národních sil",
      code: "ANS",
      short: "ANS",
      color: "#2d3092",
      wiki: 69095506,
    },
    MHS: {
      name: "Marek Hilšer do Senátu",
      short: "MHS",
      code: "MHS",
      color: "#102e6f",
    },
    ProOl: {
      name: "Pro Olomouc",
      short: "ProOl",
      code: "PROOL",
      color: "#e31e24",
    },
    ND: {
      name: "Národní demokracie",
      short: "Národní demokracie",
      code: "ND",
      color: "#010066",
      wiki: 44319994,
    },
    ČSSD: {
      name: "Česká suverenita sociální demokracie",
      short: "ČSSD",
      code: "CSSD",
      color: "#F68B1F",
      wiki: 27564199,
    },
    Soukromníci: {
      name: "Strana soukromníků České republiky",
      short: "Soukromníci",
      code: "SOUKROMNICI",
      color: "#e78b00",
      wiki: 50922181,
    },
    Levice: {
      name: "Levice",
      short: "Levice",
      code: "LEVICE",
      color: "#d50d43",
      wiki: 66950082,
    },
    NMFM: {
      name: "Naše Město F-M",
      short: "Naše Město F-M",
      code: "NMFM",
      color: "#94C036",
    },
    Změna: {
      name: "politické hnutí Změna",
      short: "Změna",
      code: "ZMENA",
      color: "#FABE09",
    },
    VIZE: {
      name: "VIZE pro Česko",
      short: "VIZE pro Česko",
      code: "VIZE",
      color: "#04abd5",
    },
    VÚ: {
      name: "Vaše Ústí",
      short: "Vaše Ústí",
      code: "VU",
      color: "#da251d",
    },
    Idealisté: {
      name: "Hnutí Idealisté",
      short: "Idealisté",
      code: "IDEALISTE",
      color: "#29D9C2",
    },
    MZH: {
      name: "Moravské zemské hnutí",
      short: "MZH",
      code: "MZH",
      color: "#cf2e2e",
      wiki: 69097006,
    },
    Budoucnost: {
      name: "Budoucnost",
      short: "Budoucnost",
      code: "BUDOUCNOST",
      color: "#920B4C",
      wiki: 77852965,
    },
    VOK: {
      name: "Volba pro kraj",
      short: "VOK",
      code: "VOK",
      color: "#0083cb",
    },
    spOL: {
      name: "spOLečně",
      short: "spOL",
      code: "SPOL",
      color: "#440099",
    },
    "SNK ED": {
      name: "SNK Evropští demokraté",
      short: "SNK ED",
      code: "SNKED",
      color: "#FDCA0B",
      wiki: 795194,
    },
    UFO: {
      name: "ÚSTECKÉ FÓRUM OBČANŮ",
      short: "ÚSTECKÉ FÓRUM OBČANŮ",
      code: "UFO",
      color: "#2D3469",
    },
    Hlas: {
      name: "Hlas",
      short: "Hlas",
      code: "HLAS",
      color: "#302964",
      wiki: 60605566,
    },
    VPK: {
      name: "VOLBA PRO KLADNO",
      short: "VPK",
      code: "VPK",
      color: "#36a736",
    },
    HDK: {
      name: "Hradecký demokratický klub",
      short: "HDK",
      code: "HDK",
      color: "#BFA371",
    },
    RH: {
      name: "ROZVÍJÍME HRADEC",
      short: "ROZVÍJÍME HRADEC",
      code: "RH",
      color: "#ea555b",
    },
    "ANK 2020": {
      name: "Alternativa pro nezávislé kandidáty 2020",
      short: "ANK 2020",
      code: "ANK2020",
      color: "#010101",
    },
    SPOZ: {
      color: "#e41819",
      name: "Strana Práv Občanů ZEMANOVCI",
      code: "SPOZ",
      short: "SPOZ",
    },
    "Švýcarská demokracie": {
      name: "Švýcarská demokracie",
      short: "Švýcarská demokracie",
      code: "SD",
      color: "#c20e1a",
      wiki: 69079654,
    },
    "SD-SN": {
      name: "Spojení demokraté - Sdružení nezávislých",
      short: "SD-SN",
      code: "SDSN",
      color: "#00397c",
      wiki: 76276352,
    },
    NK: {
      name: "Nestraníci",
      short: "Nestraníci",
      code: "NK",
      color: "#012B55",
    },
    KVC: {
      name: "Karlovaráci",
      short: "KVC",
      code: "KVC",
      color: "#E9001E",
    },
    N14: {
      name: "NAŠE Čtrnáctka",
      short: "NAŠE Čtrnáctka",
      code: "N14",
      color: "#00a2d6",
    },
    T2020: {
      wiki: 77343523,
      color: "#fdbf00",
      name: "Tábor 2020",
      code: "T2020",
      short: "T2020",
    },
    HOPB: {
      name: "Občané pro Budějovice",
      short: "HOPB",
      code: "HOPB",
      color: "#ff1e00",
    },
    "Fakt Brno": {
      name: "Fakt Brno",
      short: "Fakt Brno",
      code: "FAKTBRNO",
      color: "#101E3A",
    },
    LES: {
      wiki: 51143908,
      name: "Liberálně ekologická strana",
      short: "LES",
      code: "LES",
      color: "#006771",
    },
    PV: {
      name: "Pévéčko",
      short: "Pévéčko",
      code: "PV",
      color: "#e70f49",
    },
    SproK: {
      name: "Společně pro kraj",
      short: "SproK",
      code: "SPROK",
      color: "#7f72b2",
    },
    "HPP 11": {
      name: "Hnutí pro Prahu 11",
      short: "HPP 11",
      code: "HPP11",
      color: "#ffee00",
    },
    KONS: {
      name: "Konzervativní strana",
      short: "KONS",
      code: "KONS",
      color: "#330066",
      wiki: 29661631,
    },
    "Monarchiste.CZ": {
      name: "Monarchiste.CZ",
      short: "Monarchiste.CZ",
      code: "MONARCHISTECZ",
      color: "#170c49",
    },
    REFERENDUM: {
      name: "Referendum – Hlas Lidu",
      short: "REFERENDUM",
      code: "REFERENDUM",
      color: "#124749",
    },
    VČR: {
      name: "Volt Česko",
      short: "Volt",
      code: "VOLT",
      wiki: 71872489,
      color: "#502379",
    },
    Moravané: {
      wiki: 14806022,
      name: "Moravané",
      short: "Moravané",
      code: "MORAVANE",
      color: "#feca0a",
    },
    PP21: {
      name: "ProPce21",
      short: "ProPce21",
      code: "PP21",
      color: "#c38aae",
    },
    "JIH 12": {
      name: "JIHOČEŠI 2012",
      short: "JIH 12",
      code: "JIH12",
      color: "#57165f",
    },
    LS: {
      name: "LEPŠÍ SEVER",
      short: "LEPŠÍ SEVER",
      code: "LS",
      color: "#07183a",
    },
    ČR1: {
      name: "Česká republika na 1. místě!",
      short: "Česká republika na 1. místě!",
      code: "CR1",
      color: "#de0814",
      wiki: 76920881,
    },
  };

  constructor() {
    super("CZ", Country.czechrepublic);
  }

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `${year}.json`);
  }

  protected normalizeReceiver(receiver: string): string {
    if (receiver === "ABP") {
      return "APB";
    }
    if (receiver === "PRO") {
      return "PRO 2022";
    }
    if (receiver === "Volt") {
      return "VČR";
    }

    return super.normalizeReceiver(receiver);
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const defs = JSON.parse(await this.cachedYearData(year)) as PartyDef[];

    const donations: ExtractedYearData[] = [];

    defs.forEach((def, didx) => {
      def.donations.forEach((donation, idx) => {
        if (donation.money === 0) {
          return;
        }

        // some unknown party which they added late in 2025 for 2024
        if (this.normalizeReceiver(def.shortName) === "MY") return;

        const extractedData: ExtractedYearData = {
          idx: `${year}-${didx}-${idx}`,
          [DonationField.Receiver]: def.shortName as ReceiverId,
          [DonationField.Amount]: donation.money,
          [DonationField.Date]: donation.date ?? year,
          [DonationField.Address]: { [AddressField.Country]: "CZ" },
          [DonationField.DonorName]: "",
        };

        if (isCompanyDonation(donation)) {
          extractedData[DonationField.DonorName] = donation.company;
        } else if (isPersonDonation(donation)) {
          extractedData[DonationField.DonorName] =
            `${donation.firstName} ${donation.lastName}`;
          extractedData[DonationField.DonorType] = DonorType.Individual;
        }

        donations.push(extractedData);
      });
    });

    return donations;
  }

  private yearUrl(year: string) {
    return `https://zpravy.udhpsh.cz/zpravy/vfz${year}.json`;
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const url = this.yearUrl(year);

    this.log(`Loading donation page for year ${year}: ${url}`);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Unable to load ${url}: ${res.status}`);
    }

    const json: {
      parties: {
        shortName: string;
        longName: string;
        files: {
          url: string;
          subject: string;
        }[];
      }[];
    } = await res.json();

    const partyDefs: PartyDef[] = [];

    for (const party of json.parties) {
      const partyDef: PartyDef = {
        shortName: party.shortName,
        longName: party.longName,
        donations: [],
      };
      const donationFiles = party.files.filter(
        (f) => f.subject === "penizefo" || f.subject === "penizepo",
      );

      for (const donationFile of donationFiles) {
        await timeout(500);
        this.log(
          `Loading "${party.shortName}" party donations: ${donationFile.url}`,
        );
        const donations: (CompanyDonation | PersonDonation)[] = await fetch(
          donationFile.url,
        ).then((res) => res.json());
        partyDef.donations.push(...donations);
      }

      partyDefs.push(partyDef);
    }

    await fs.writeFile(this.cacheFile(year), JSON.stringify(partyDefs), {
      encoding: "utf8",
    });
  }
}

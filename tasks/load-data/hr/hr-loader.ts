import fs from "fs/promises";
import path from "path";

import { donorMeta } from "./donor-meta";
import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";
import {
  DataLoader,
  type ExtractedYearData,
  type PartyConfig,
} from "../data-loader";
import { timeout } from "../util";

import type { ReceiverId, DonationAddress } from "../../../src/utils/types";

const conversionTable: Record<string, number> = {
  "2019-H1": 0.134,
  "2019-H2": 0.1341,
  "2020-H1": 0.1335,
  "2020-H2": 0.1338,
  "2021-H1": 0.1332,
  "2021-H2": 0.1334,
  "2022-H1": 0.1329,
  "2022-H2": 0.1327,
  "2023-H1": 0.1326,
  "2023-H2": 0.1328,
};

/**
 * Based on the reply from izbori.hr:
 *
 * > All donation amounts until 2024 are listed in the Croatian kuna,
 * > and those from 2024 onwards with the Croatian's transition from the Croatian kuna to Euro are in Euro.
 */
export const currencyConversion = (
  year: string,
  date: string,
  amount: number,
) => {
  // after 2024 all donations are in euro
  if (year >= "2024") return amount;

  let key = `${year}-H`;

  const month = new Date(date).getMonth();
  if (month < 6) {
    key += "1";
  } else {
    key += "2";
  }

  // convert to euro
  const conversion = conversionTable[key];
  if (!conversion) {
    throw new Error(`No conversion for year ${year}`);
  }
  return amount * conversion;
};

interface HrPartyDocument {
  nazivObrasca: string;
  nazivObveznika: string;
  adresa: string;
  oib: string;
  brojPosebnogRacuna: string;
  vrstaIzvjesca: string;
  razdobljeOd: string;
  razdobljeDo: string;
  datumSastavljanja: string;
  data: {
    rb: string;
    nazivDonatora: string;
    oibDonatora: string;
    adresaDonatora: string;
    datumDonacije: string;
    iznosUNovcu: number;
    trzisnaVrijednost: number;
    ukupno: number;
  }[];
  ukupnoIznosUNovcu: 0;
  ukupnoVrijednostProizvodaIliUsluge: 0;
  ukupno: 0;
}

export class HrLoader extends DataLoader {
  constructor() {
    super("HR", Country.croatia);
  }

  parties: Record<string, PartyConfig> = {
    "NAPRIJED HRVATSKA! - PROGRESIVNI SAVEZ - NAPRIJED HRVATSKA!": {
      name: "Naprijed Hrvatska! – Progresivni savez",
      short: "Naprijed Hrvatska",
      code: "NHP",
      color: "#cd061d",
    },
    "MEĐIMURSKI DEMOKRATSKI SAVEZ - MDS": {
      name: "Međimurski demokratski savez",
      short: "MDS",
      code: "MDS",
      color: "#f80206",
    },
    "ŽIVI ZID": {
      name: "Živi zid",
      short: "Živi zid",
      code: "ZZ",
      color: "#fff205",
    },
    "ZAGREB JE NAŠ!": {
      name: "Zagreb je NAŠ!",
      short: "Zagreb je NAŠ!",
      code: "ZJN",
      wiki: 64105718,
      color: "#0062ac",
    },
    "HRVATSKA STRANKA REDA - HSR": {
      name: "Hrvatska stranka reda",
      short: "HSR",
      code: "HSR",
      color: "#fe0102",
    },
    "HRVATSKA NARODNA STRANKA - LIBERALNI DEMOKRATI - HNS": {
      name: "Hrvatska narodna stranka – liberalni demokrati",
      short: "HNS",
      code: "HNS",
      color: "#ff931e",
      wiki: 408725,
    },
    "AUTOHTONA - HRVATSKA STRANKA PRAVA - A - HSP": {
      name: "Autohtona – Hrvatska stranka prava",
      short: "A-HSP",
      code: "AHSP",
      color: "#202f5b",
      wiki: 13930230,
    },
    "HRVATSKA DEMOKRATSKA ZAJEDNICA - HDZ": {
      name: "Hrvatska demokratska zajednica",
      short: "HDZ",
      code: "HDZ",
      color: "#295ba5",
      wiki: 399870,
    },
    "DEMOKRATSKA PRIGORSKO - ZAGREBAČKA STRANKA - DPS": {
      name: "Demokratska prigorsko-zagrebačka stranka",
      short: "DPS",
      code: "DPS",
      color: "#131382",
    },
    "ZA GRAD": {
      name: "Za grad",
      short: "Za grad",
      code: "ZG",
      color: "#564587",
    },
    "AKTIVNI NEZAVISNI UMIROVLJENICI - ANU": {
      name: "Aktivni nezavisni umirovljenici",
      short: "ANU",
      code: "ANU",
      color: "#ed1a24",
    },
    "STRANKA IVANA PERNARA": {
      name: "Stranka Ivana Pernara",
      short: "SIP",
      code: "SIP",
      color: "#002d3d",
      wiki: 62640688,
    },
    "MOŽEMO! - POLITIČKA PLATFORMA": {
      name: "Možemo!",
      short: "Možemo!",
      code: "MOZEMO",
      color: "#c3d746",
      wiki: 64182427,
    },
    "SOCIJALDEMOKRATSKA PARTIJA HRVATSKE - SDP": {
      name: "Socijaldemokratska partija Hrvatske",
      short: "SDP",
      code: "SDP",
      color: "#ed1c24",
      wiki: 404594,
    },
    "NOVA LJEVICA": {
      name: "Nova ljevica",
      short: "NL",
      code: "NL",
      color: "#d02b27",
      wiki: 52634164,
    },
    MOST: {
      name: "MOST",
      short: "MOST",
      code: "MOST",
      color: "#1E5797",
      wiki: 46426336,
    },
    "DEMOKRATSKI SAVEZ NACIONALNE OBNOVE - DESNO": {
      name: "Demokratski savez nacionalne obnove",
      short: "DESNO",
      code: "DESNO",
      color: "#134094",
    },
    "STRANKA ZA NAROD": {
      name: "Stranka za narod",
      short: "SZNA",
      code: "SZNA",
      color: "#0e4d90",
    },
    "RADNIČKA FRONTA - RF": {
      name: "Radnička fronta",
      short: "RF",
      code: "RF",
      color: "#cc0000",
      wiki: 44618471,
    },
    "HRVATSKA SELJAČKA STRANKA - HSS": {
      name: "Hrvatska seljačka stranka",
      short: "HSS",
      code: "HSS",
      color: "#0aaf4c",
      wiki: 408715,
    },
    DEMOKRATI: {
      name: "Demokrati",
      short: "Demokrati",
      code: "DEMOKRATI",
      color: "#B10F1F",
      wiki: 60763404,
    },
    "STRANKA S IMENOM I PREZIMENOM": {
      name: "Stranka s imenom i prezimenom",
      short: "Stranka s imenom i prezimenom",
      code: "STRIP",
      color: "#5ba4d7",
    },
    "BLOK ZA HRVATSKU - BLOK": {
      name: "Blok za Hrvatsku",
      short: "Blok",
      code: "BLOK",
      color: "#141433",
      wiki: 65726352,
    },
    "BIRAJ BOLJE": {
      name: "Biraj bolje",
      short: "BB",
      code: "BB",
      color: "#db172f",
    },
    "HRAST - POKRET ZA USPJEŠNU HRVATSKU": {
      name: "HRAST",
      short: "HRAST",
      code: "HRAST",
      color: "#f44029",
      wiki: 32575696,
    },
    "STRANKA HRVATSKIH UMIROVLJENIKA - UMIROVLJENICI - UMIROVLJENICI": {
      name: "Stranka hrvatskih umirovljenika",
      short: "Umirovljenici",
      code: "UMIROVLJENICI",
      color: "#2e3192",
    },
    NADA: {
      name: "Nada",
      short: "Nada",
      code: "NADA",
      color: "#000001",
    },
    "STRANKA UMIROVLJENIKA - SU": {
      name: "Stranka umirovljenika",
      short: "SU",
      code: "SU",
      color: "#5bc0de",
    },
    "HRVATSKI LABURISTI - STRANKA RADA - LABURISTI": {
      name: "Hrvatski laburisti",
      short: "Laburisti",
      code: "LABURISTI",
      wiki: 27760641,
      color: "#f29302",
    },
    "HRVATSKA STRANKA UMIROVLJENIKA - HSU": {
      name: "Hrvatska stranka umirovljenika",
      short: "HSU",
      code: "HSU",
      color: "#2e3193",
      wiki: 408712,
    },
    "SNAGA SLAVONIJE I BARANJE": {
      name: "Snaga Slavonije i Baranje",
      short: "Snaga SiB",
      code: "SIBI",
      color: "#22418D",
    },
    "HRVATSKA KONZERVATIVNA STRANKA - HKS": {
      name: "Hrvatska konzervativna stranka",
      short: "HKS",
      code: "HKS",
      color: "#103380",
      wiki: 46191057,
    },
    "UJEDINJENI HRVATSKI DOMOLJUBI - UHD": {
      name: "Ujedinjeni hrvatski domoljubi",
      short: "UHD",
      code: "UHD",
      color: "#07357f",
    },
    "HRVATSKA BRANITELJSKA PUČKA STRANKA - HBPS": {
      name: "Hrvatska braniteljska pučka stranka",
      short: "HBPS",
      code: "HBPS",
      color: "#456480",
    },
    "AKCIJA UMIROVLJENICI ZAJEDNO - AUZ": {
      name: "Akcija umirovljenici zajedno",
      short: "AUZ",
      code: "AUZ",
      color: "#97b4d8",
    },
    "ŽUPSKA STRANKA": {
      name: "Župska stranka",
      short: "Župska",
      code: "ZUPSKA",
      color: "#99202d",
    },
    "NEOVISNI ZA HRVATSKU": {
      name: "Neovisni za Hrvatsku",
      short: "NHR",
      code: "NHR",
      color: "#0c509b",
      wiki: 55191616,
    },
    "DOMOVINSKI POKRET MIROSLAVA ŠKORE": {
      name: "Domovinski pokret Miroslava Škore",
      short: "DPMŠ",
      code: "DPMS",
      color: "#005bac",
    },
    "BANDIĆ MILAN 365 - STRANKA RADA I SOLIDARNOSTI": {
      name: "Bandić Milan 365 – stranka rada i solidarnosti",
      short: "BM365",
      code: "BM365",
      color: "#0f62bc",
      wiki: 46437897,
    },
    FOKUS: {
      name: "Fokus",
      short: "Fokus",
      code: "FOKUS",
      color: "#05aaca",
      wiki: 67737580,
    },
    "CENTAR (EX PAMETNO)": {
      name: "Centar",
      short: "Centar",
      code: "CENTAR",
      color: "#0a7ac2",
      wiki: 53703151,
    },
    "HRVATSKI SUVERENISTI": {
      name: "Hrvatski suverenisti",
      short: "HS",
      code: "HS",
      color: "#DB0812",
      wiki: 68868643,
    },
    "GENERACIJA OBNOVE - GO": {
      name: "Generacija Obnove",
      short: "GO",
      code: "GO",
      color: "#008fd1",
    },
    "HRVATSKA STRANKA GRAĐANSKOG OTPORA - HSGO": {
      name: "Hrvatska stranka građanskog otpora",
      short: "HSGO",
      code: "HSGO",
      color: "#fa023b",
    },
    "GRAĐANSKO-LIBERALNI SAVEZ - GLAS": {
      name: "Građansko-liberalni savez",
      short: "GLAS",
      code: "GLAS",
      color: "#2D7DBE",
      wiki: 54508545,
    },
    "ZELENA LISTA": {
      name: "Zelena lista",
      short: "Zelena lista",
      code: "ZL",
      color: "#00a94f",
      wiki: 13873808,
    },
    "POKRET ZA MODERNU HRVATSKU": {
      name: "Pokret za modernu Hrvatsku",
      short: "Pokret-HR",
      code: "PHR",
      color: "#ed1c25",
    },
    "HRVATSKA STRANKA PRAVA - HSP": {
      name: "Hrvatska stranka prava",
      short: "HSP",
      code: "HSP",
      color: "#333333",
      wiki: 408717,
    },
    "NARODNA STRANKA - REFORMISTI": {
      name: "Narodna stranka – Reformisti",
      short: "NS-R",
      code: "NSR",
      color: "#692b82",
      wiki: 43860388,
    },
    "PRIMORSKO GORANSKI SAVEZ - PGS": {
      name: "Primorsko goranski savez",
      short: "PGS",
      code: "PGS",
      color: "#2e3194",
      wiki: 408708,
    },
    "ŽELJKO LACKOVIĆ - NEZAVISNE LISTE": {
      name: "Željko Lacković – Nezavisne liste",
      short: "Željko Lacković – Nezavisne liste",
      code: "ZLN",
      color: "#353984",
    },
    "NEZAVISNA LISTA STIPE PETRINA - NLSP": {
      name: "Nezavisna lista Stipe Petrina",
      short: "NLSP",
      code: "NLSP",
      color: "#2196f3",
    },
    "STRANKA DEMOKRATSKE AKCIJE HRVATSKE - SDA HRVATSKE": {
      name: "Stranka demokratske akcije Hrvatske",
      short: "SDA",
      code: "SDA",
      color: "#14a013",
      wiki: 1829962,
    },
    "NEZAVISNA LISTA MLADIH - NLM": {
      name: "Nezavisna lista mladih",
      short: "NLM",
      code: "NLM",
      color: "#044ea1",
      wiki: 78620487,
    },
    "HRVATSKA STRANKA PRAVNE DRŽAVE": {
      name: "Hrvatska stranka pravne države",
      short: "HSPD",
      code: "HSPD",
      color: "#cd2653",
    },
    "HRVATSKA SOCIJALNO - LIBERALNA STRANKA - HSLS": {
      name: "Hrvatska socijalno-liberalna stranka",
      short: "HSLS",
      code: "HSLS",
      color: "#0053a0",
      wiki: 408722,
    },
    "ISTARSKI DEMOKRATSKI SABOR - IDS": {
      name: "Istarski demokratski sabor",
      short: "IDS",
      code: "IDS",
      color: "#00a950",
      wiki: 408711,
    },
    "HRVATSKA LIBERALNA DEMOKRATSKA STRANKA": {
      name: "Hrvatska liberalna demokratska stranka",
      short: "HLDS",
      code: "HLDS",
      color: "#00004b",
    },
    "BLOK UMIROVLJENICI ZAJEDNO - BUZ": {
      name: "Blok umirovljenici zajedno",
      short: "BUZ",
      code: "BUZ",
      color: "#8b1e1b",
    },
    "SRĐ JE GRAD": {
      name: "Srđ je Grad",
      short: "Srđ je Grad",
      code: "SRD",
      color: "#000000",
    },
    "AGRAMERI - NEZAVISNA LISTA": {
      name: "Agrameri – Nezavisna lista",
      short: "Agrameri",
      code: "AGRAMERI",
      color: "#1e73be",
    },
    "LISTA ZA RIJEKU - RI": {
      name: "Lista za Rijeku",
      short: "RI",
      code: "RI",
      color: "#d70040",
      wiki: 18903393,
    },
    "DOMOVINSKI POKRET": {
      name: "Domovinski pokret",
      short: "DP",
      code: "DP",
      color: "#005baa",
      wiki: 63244670,
    },
    "MLADI ZA ĐAKOVO": {
      name: "Mladi za Đakovo",
      short: "Mladi za Đakovo",
      code: "MZD",
      color: "#49993b",
    },
    LIPO: {
      name: "LiPO ( Lika, primorje i otoci)",
      short: "LiPO",
      code: "LIPO",
      color: "#010162",
    },
    "IVAN PENAVA NEZAVISNA LISTA": {
      name: "Ivan Penava Nezavisna lista",
      short: "IPNL",
      code: "IPNL",
      color: "#1643d2",
    },
    "PAMETNO ZA SPLIT I DALMACIJU": {
      name: "Pametno za Split i Dalmaciju",
      short: "Pametno za Split i Dalmaciju",
      code: "PAMETNOZASPLIT",
      color: "#e17612",
    },
    "HRVATSKA ČISTA STRANKA PRAVA - HČSP": {
      name: "Hrvatska čista stranka prava",
      short: "HČSP",
      code: "HCSP",
      color: "#171a15",
      wiki: 1834782,
    },
    "NEZAVISNA LISTA OSEJAVA": {
      name: "Nezavisna lista Osejava",
      short: "NLO",
      code: "NLO",
      color: "#27a4da",
    },
    "DUBROVAČKI DEMOKRATSKI SABOR - DDS": {
      name: "Dubrovački demokratski sabor",
      short: "DDS",
      code: "DDS",
      color: "#1f398e",
    },
    "UNIJA KVARNERA": {
      name: "Unija Kvarnera",
      short: "Unija Kvarnera",
      code: "UK",
      color: "#e3c20e",
    },
    "ŽELJKO KERUM - HRVATSKA GRAĐANSKA STRANKA - HGS": {
      name: "Željko Kerum – Hrvatska građanska stranka",
      short: "HGS",
      code: "HGS",
      color: "#057bc1",
      wiki: 32575828,
    },
    NEZAVISNI: {
      name: "Nezavisni",
      short: "Nezavisni",
      code: "NEZAVISNI",
      color: "#0e3b50",
    },
    "ZELENA ALTERNATIVA - ODRŽIVI RAZVOJ HRVATSKE": {
      name: "Zelena alternativa – Održivi razvoj Hrvatske",
      short: "Zelena alternativa - ORaH",
      code: "ZAORAH",
      color: "#478a41",
      wiki: 42054072,
    },
    "AKCIJA MLADIH - AM": {
      name: "Akcija mladih",
      short: "AM",
      code: "AM",
      color: "#eb6500",
      wiki: 54110543,
    },
    "ZAGORSKA STRANKA - ZS": {
      name: "Zagorska stranka",
      short: "ZS",
      code: "ZS",
      color: "#062d3a",
      wiki: 47961320,
    },
    "NEZAVISNA LISTA TOMISLAV STOJAK": {
      name: "Nezavisna lista Tomislav Stojak",
      short: "NLTS",
      code: "NLTS",
      color: "#e41e27",
    },
    "MREŽA NEZAVISNIH LISTA - MREŽA": {
      name: "Mreža nezavisnih lista",
      short: "Mreža",
      code: "MREZA",
      color: "#528d3a",
    },
    "GROBNIČKA STRANKA": {
      name: "Grobnička stranka",
      short: "Grobnička",
      code: "GROB",
      color: "#019edf",
    },
    "MLADI ZA BREZOVICU": {
      name: "Mladi za Brezovicu",
      short: "MZB",
      code: "MZB",
      color: "#014868",
    },
    "AUTOHTONA - HRVATSKA SELJAČKA STRANKA - A - HSS": {
      name: "Autohtona – Hrvatska seljačka stranka",
      short: "A-HSS",
      code: "AHSS",
      color: "#d51921",
      wiki: 47630006,
    },
    "ZAOKRET - NEZAVISNA LISTA": {
      name: "Zaokret – Nezavisna lista",
      short: "Zaokret",
      code: "ZAOKRET",
      color: "#12a399",
    },
    "DAMIR BAJS NEZAVISNA LISTA - DAMIR BAJS NL": {
      name: "Damir Bajs Nezavisna lista",
      short: "DBNL",
      code: "DBNL",
      color: "#b6c617",
    },
    "HRVATSKA NARODNA LISTA": {
      name: "Hrvatska narodna lista",
      short: "HNL",
      code: "HNL",
      color: "#f82012",
    },
    "NEZAVISNI ZA ZAPREŠIĆ": {
      name: "Nezavisni za Zaprešić",
      short: "Nezavisni za Zaprešić",
      code: "NZ",
      color: "#e9d419",
    },
    "DEMOKRATSKI HSS": {
      name: "Demokratski HSS",
      short: "Demokratski HSS",
      code: "DHSS",
      color: "#0b6822",
    },
    "NEZAVISNA LISTA PODBABLJE SUTRA": {
      name: "Nezavisna lista Podbablje sutra",
      short: "Nezavisna lista Podbablje sutra",
      code: "NLPS",
      color: "#ba0000",
    },
    "HRVATSKI DEMOKRATSKI SAVEZ SLAVONIJE I BARANJE - HDSSB": {
      name: "Hrvatski demokratski savez Slavonije i Baranje",
      short: "HDSSB",
      code: "HDSSB",
      color: "#c92123",
      wiki: 36925561,
    },
    "HRVATSKA SELJAČKA STRANKA - STJEPAN RADIĆ - HSS - SR": {
      name: "Hrvatska seljačka stranka – Stjepan Radić",
      short: "HSS-SR",
      code: "HSSSR",
      color: "#096040",
    },
    "KLJUČ HRVATSKE - KLJUČ": {
      name: "Ključ Hrvatske",
      short: "KLJUČ",
      code: "KLJUC",
      color: "#e4bc42",
      wiki: 47624754,
    },
    "ZAJEDNO ZA MURTER": {
      name: "Zajedno za Murter",
      short: "Zajedno za Murter",
      code: "ZZM",
      color: "#27368c",
    },
    "HRVATSKA DEMOKRATSKA SELJAČKA STRANKA - HDSS": {
      name: "Hrvatska demokratska seljačka stranka",
      short: "HDSS",
      code: "HDSS",
      color: "#31a033",
      wiki: 409016,
    },
    "ODLUČNOST I PRAVEDNOST - OIP": {
      name: "Odlučnost i pravednost",
      short: "OiP",
      code: "OIP",
      color: "#2A2959",
    },
    "ZAJEDNO ZA TROGIR": {
      name: "Zajedno za Trogir",
      short: "Zajedno za Trogir",
      code: "ZT",
      color: "#04476b",
    },
    "NEZAVISNA LISTA BOLJIH - NLB": {
      name: "Nezavisna lista boljih",
      short: "NLB",
      code: "NLB",
      color: "#723f93",
    },
    "PROMIJENIMO HRVATSKU - PH": {
      color: "#7139b7",
      code: "PH",
      name: "Promijenimo Hrvatsku",
      short: "PH",
    },
    "SAMOSTALNA DEMOKRATSKA SRPSKA STRANKA - SDSS": {
      name: "Samostalna demokratska srpska stranka",
      short: "SDSS",
      code: "SDSS",
      color: "#d8182e",
      wiki: 385158,
    },
    "SNAGA - STRANKA NARODNOG I GRAĐANSKOG AKTIVIZMA - SNAGA": {
      name: "STRANKA NARODNOG I GRAĐANSKOG AKTIVIZMA - SNAGA",
      short: "SNAGA",
      code: "SNAGA",
      color: "#f60000",
    },
    SOCIJALDEMOKRATI: {
      color: "#0c459d",
      code: "SD",
      name: "Socijaldemokrati",
      short: "SD",
    },
    "PRAVEDNA HRVATSKA - PH": {
      color: "#0f4f92",
      code: "PRH",
      name: "Pravedna Hrvatska",
      short: "Pravedna Hrvatska",
    },
    "AKCIJA ZA PROMJENE - AP": {
      color: "#5db446",
      code: "AP",
      name: "AkciJa za promjene",
      short: "AP",
    },
    "MOST NEZAVISNIH LISTA": {
      color: "#e95321",
      code: "MOSTNL",
      name: "Most nezavisnih lista",
      short: "Most nezavisnih lista",
    },
    "START - STRANKA ANTIKORUPCIJE, RAZVOJA I TRANSPARENTNOSTI - START": {
      color: "#a4171a",
      code: "START",
      name: "Stranka antikorupcije, razvoja i transparentnosti",
      short: "START",
    },
    "ODRŽIVI RAZVOJ HRVATSKE - ORAH": {
      color: "#a72724",
      code: "ORAH",
      name: "Održivi razvoj Hrvatske",
      short: "ORaH",
    },
    PAMETNO: {
      color: "#23274d",
      code: "PAMETNO",
      name: "Pametno",
      short: "Pametno",
    },
    "NOVA POLITIKA": {
      color: "#253c65",
      code: "NP",
      name: "Nova politika",
      short: "Nova politika",
    },
    "STRANKA RAZVOJA I NAPRETKA - SRNA": {
      color: "#373435",
      code: "SRNA",
      name: "Stranka razvoja i napretka",
      short: "SRNA",
    },
    "DUBROVAČKA BOŠNJAČKA STRANKA": {
      color: "#009935",
      code: "DBS",
      name: "Dubrovačka bošnjačka stranka",
      short: "DBS",
    },
    "HRVATSKA STRANKA DEMOKRATA - HSD": {
      color: "#f60001",
      code: "HSD",
      name: "Hrvatska stranka demokrata",
      short: "HSD",
    },
    "STRANKA HRVATSKI VIDIK - SHV": {
      color: "#f4eb20",
      code: "SHV",
      name: "Stranka hrvatski vidik",
      short: "SHV",
    },
    "NEZAVISNA LISTA VIŠNJAN - NLV": {
      color: "#0d4e96",
      code: "NLV",
      name: "Nezavisna lista Višnjan",
      short: "NLV",
    },
    "DEMOKRATSKA KNEGINEČKA STRANKA - DKS": {
      color: "#ff9901",
      code: "DKS",
      name: "Demokratska Kneginečka stranka",
      short: "DKS",
    },
    "DEMOKRATSKA LOKALNA STRANKA - DLS": {
      color: "#e31e25",
      code: "DLS",
      name: "Demokratska lokalna stranka",
      short: "DLS",
    },
    "HRVATSKA DEMOKRŠĆANSKA STRANKA - HDS": {
      color: "#2a72b8",
      code: "HDS",
      name: "Hrvatska demokršćanska stranka",
      short: "HDS",
    },
    "SLOBODNA HRVATSKA - SH": {
      color: "#1b8cf5",
      code: "SH",
      name: "Slobodna Hrvatska",
      short: "Slobodna Hrvatska",
    },
    "STRANKA ZA ZADAR! - ZZ!": {
      color: "#e87055",
      code: "SZZ",
      name: "Stranka za Zadar!",
      short: "ZZ!",
    },
    "HRVATSKO BILO - HRB": {
      color: "#be1e2d",
      code: "HRB",
      name: "Hrvatsko bilo",
      short: "Hrvatsko bilo",
    },
    REPUBLIKA: {
      wiki: 76605284,
      color: "#f3c400",
      code: "REPUBLIKA",
      name: "Republika",
      short: "Republika",
    },
    "NEZAVISNA PLATFORMA SJEVERA -NPS": {
      color: "#6DBB6B",
      code: "NPS",
      name: "Nezavisna Platforma Sjever",
      short: "NPS",
    },
    "JAVNO DOBRO": {
      color: "#0b9444",
      code: "JAVNODOBRO",
      name: "Javno Dobro",
      short: "Javno Dobro",
    },
    "PLAVI GRAD - PLAVI GRAD": {
      color: "#00b0e6",
      code: "PLAVIGRAD",
      name: "Plavi Grad",
      short: "Plavi Grad",
    },
    "STJEPAN KOŽIĆ - NEZAVISNA LISTA - SKNL": {
      code: "SKNL",
      short: "SKNL",
      name: "Stjepan Kožić - NL",
      color: "#acc232",
    },
    "NEZAVISNA LISTA BURA - BURA": {
      code: "BURA",
      short: "BURA",
      name: "BURA - NL",
      color: "#60bd45",
    },
    "DARIO ZUROVEC - NEZAVISNA LISTA - DARIO ZUROVEC - NL": {
      name: "Dario Zurovec - NL",
      short: "Dario Zurovec - NL",
      code: "DZNL",
      color: "#001f3f",
    },
    "SVE SE MOŽE - SSM": {
      name: "Sve se može!",
      short: "Sve se može!",
      code: "SSM",
      color: "#0f7ec2",
    },
    "BERNARDIĆ DAVOR - NEZAVISNA LISTA SERVUS ZAGREB - SERVUS ZAGREB": {
      name: "Bernardić Davor - NL Servus Zagreb",
      short: "Bernardić Davor - NL Servus Zagreb",
      code: "BDNLSZ",
      color: "#00b2d6",
    },
    "MARIJA SELAK RASPUDIĆ - NEZAVISNA LISTA - MARIJA SELAK RASPUDIĆ - NL": {
      name: "Marija Selak Raspudić - NL",
      short: "Marija Selak Raspudić - NL",
      code: "MSRNL",
      color: "#2c6491",
      wiki: 77852735,
    },
    "PAVLE KALINIĆ - NEZAVISNA LISTA - PAVLE KALINIĆ - NL": {
      name: "Pavle Kalinić - NL",
      short: "Pavle Kalinić - NL",
      code: "PAKALINICNL",
      color: "#0c203b",
    },
    "DINA DOGAN - NEZAVISNA LISTA - DINA DOGAN - NL": {
      name: "Dina Dogan - NL",
      short: "Dina Dogan - NL",
      code: "DINADOGANNL",
      color: "#093ad6",
    },
  };

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.json`);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    this.log("Loading overview for year", year);
    const partyDocuments: HrPartyDocument[] = [];

    const parties: { value: string; label: string }[] = await fetch(
      `https://www.izbori.hr/arhiva-izbora/data/financiranje/${year}/st/obveznik.json`,
    ).then((res) => res.json());

    // load all party documents
    for (const party of parties) {
      this.log(
        "Loading party documents for that year",
        party.label,
        party.value,
      );

      const documents: {
        datum: string;
        dokumenti: {
          label: string;
          list: { label: "pdf" | "json"; value: string }[];
        }[];
      }[] = await fetch(
        `https://www.izbori.hr/arhiva-izbora/data/financiranje/${year}/st/${party.value}/dokument.json`,
      ).then((res) => res.json());

      // find the json(s)
      const jsons = documents
        // find the latest document due to croatian parties sometimes reporting multiple times per year with same donations being included in the earlier documents
        .toSorted((a, b) => (a.datum < b.datum ? 1 : -1))
        // take only the latest document
        .slice(0, 1)
        .flatMap((d) =>
          d.dokumenti
            .filter((dd) => dd.label === "Donacije")
            .flatMap((dd) => dd.list.filter((l) => l.label === "json")),
        );

      this.log(`Found ${jsons.length} donation jsons for party ${party.label}`);
      for (const json of jsons) {
        const partyDocumentUrl = `https://www.izbori.hr/arhiva-izbora/data/financiranje/${year}/st/${party.value}/${json.value}`;
        const document: HrPartyDocument | undefined = await fetch(
          partyDocumentUrl,
        ).then((res) => {
          if (!res.ok) {
            this.log(
              "error loading document loading",
              res.status,
              `https://www.izbori.hr/arhiva-izbora/data/financiranje/${year}/st/${party.value}/${json.value}`,
            );
            return undefined;
          }

          return res.json();
        });

        if (document) {
          partyDocuments.push(document);
        }
        await timeout(500);
      }

      await timeout(500);
    }

    await fs.writeFile(
      this.cacheFile(year),
      JSON.stringify(partyDocuments, null, " "),
      {
        encoding: "utf8",
      },
    );
  }

  private parseDate(date: string): string {
    const [day, month, year] = date.split(".");
    return `${year}-${month}-${day}`;
  }

  protected override normalizeReceiver(receiver: string): string {
    const normalized = super.normalizeReceiver(receiver);

    if (normalized.startsWith("CENTAR")) {
      return "CENTAR (EX PAMETNO)";
    }
    if (normalized.startsWith("MOŽEMO! - POLITIČKA PLATFORMA")) {
      return "MOŽEMO! - POLITIČKA PLATFORMA";
    }
    if (normalized.startsWith("NEZAVISNI ZA ZAPREŠIĆ")) {
      return "NEZAVISNI ZA ZAPREŠIĆ";
    }
    if (normalized.startsWith("SRĐ JE GRAD")) {
      return "SRĐ JE GRAD";
    }
    if (normalized.startsWith("STRANKA ZA ZADAR!")) {
      return "STRANKA ZA ZADAR! - ZZ!";
    }
    if (normalized.startsWith("HRVATSKA NARODNA LISTA")) {
      return "HRVATSKA NARODNA LISTA";
    }
    if (normalized.startsWith("NOVA LJEVICA")) {
      return "NOVA LJEVICA";
    }
    if (normalized.startsWith("DOMOVINSKI POKRET")) {
      return "DOMOVINSKI POKRET";
    }
    if (normalized.startsWith("HRVATSKA STRANKA PRAVNE DRŽAVE")) {
      return "HRVATSKA STRANKA PRAVNE DRŽAVE";
    }
    if (normalized === "HRVATSKA STRANKA PRAVA") {
      return "HRVATSKA STRANKA PRAVA - HSP";
    }
    if (normalized === "KLJUČ HRVATSKE") {
      return "KLJUČ HRVATSKE - KLJUČ";
    }
    if (normalized.startsWith("ZELENA ALTERNATIVA")) {
      return "ZELENA ALTERNATIVA - ODRŽIVI RAZVOJ HRVATSKE";
    }
    if (normalized.startsWith("AUTOHTONA - HRVATSKA STRANKA PRAVA")) {
      return "AUTOHTONA - HRVATSKA STRANKA PRAVA - A - HSP";
    }

    return normalized;
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const documents = JSON.parse(
      await this.cachedYearData(year),
    ) as HrPartyDocument[];

    const extracted: ExtractedYearData[] = [];
    let idx = 0;

    documents.forEach((document) => {
      if (!document.data.length) return;

      document.data.forEach((donation) => {
        if (donation.iznosUNovcu === 0) return;

        idx++;
        const date = this.normalizeIsoDate(
          this.parseDate(donation.datumDonacije),
        );

        const address = { [AddressField.Country]: "HR" } as DonationAddress;
        extracted.push({
          idx: `${year}-${idx}`,
          [DonationField.DonorName]: this.normalizeDonor(
            donation.nazivDonatora,
            address,
          ),
          [DonationField.Receiver]: document.nazivObveznika as ReceiverId,
          [DonationField.Amount]: currencyConversion(
            year,
            date,
            donation.iznosUNovcu,
          ),
          [DonationField.Date]: date,
          [DonationField.Address]: address,
        });
      });
    });

    return extracted;
  }
}

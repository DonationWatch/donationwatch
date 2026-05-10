import { parse } from "csv-parse";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import unzipper from "unzipper";

import type {
  DonationAddress,
  ExtractedDonationAddress,
  ReceiverId,
} from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField, DonorType } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { Deferred, containsWords } from "../util";
import { donorMeta } from "./donor-meta";

// convert day/month/year to local ISO date string
const getLocalISODateString = (date: string): string => {
  const [day, month, year] = date
    .split("/")
    .map((part) => part.padStart(2, "0"));

  return `${year}-${month}-${day}`;
};

const isShortMatch = (short: string, string: string) => {
  string = string.toUpperCase();
  return (
    string === short ||
    string.startsWith(`${short}-`) ||
    string.startsWith(`${short}/`) ||
    string.startsWith(`${short} -`) ||
    string.startsWith(`${short} `) ||
    string.endsWith(` ${short}`) ||
    string.endsWith(`-${short}`) ||
    // ends with ${FOO}-BAR
    string.endsWith(`(${short}-`, string.length - 4) ||
    string.endsWith(`(${short} `, string.length - 4) ||
    string.endsWith(`(${short} - `, string.length - 4) ||
    string.endsWith(`${short}-`, string.length - 3) ||
    string.endsWith(`${short} - `, string.length - 3) ||
    string.endsWith(`${short}-`, string.length - 2)
  );
};

const companyDonors = new Set<string>([
  "PricewaterhouseCoopers",
  "Ernst & Young",
  "KPMG Australia",
  "Manildra Group",
  "Deloitte Touche Tohmatsu",
  "Holding Redlich",
  "Commonwealth Bank of Australia",
  "MSD",
  "Randazzo C & G Development",
  "Origin Energy",
  "TG Public Affairs",
]);

const classifyDonorType = (donor: string): DonorType | undefined => {
  if (
    companyDonors.has(donor) ||
    // Classify companies based on Australian corporate naming patterns
    /\bpty\b/i.test(donor) ||
    /\bltd\.?$/i.test(donor) ||
    /\bcorporation\b/i.test(donor) ||
    /\bcorp\.?\b/i.test(donor)
  ) {
    return DonorType.Company;
  }

  // Classify trade unions - exact matches from donor-meta
  if (
    [
      "Shop, Distributive and Allied Employees' Association (SDA)",
      "Australian Services Union (ASU)",
      "Health Services Union (HSU)",
      "Transport Workers' Union of Australia (TWU)",
      "Construction, Forestry, Maritime, Mining & Energy Union (CFMEU)",
      "Australian Education Union (AEU)",
      "Australian Workers Union (AWU)",
      "Electrical Trades Union of Australia (ETU)",
      "Communications, Electrical and Plumbing Union (CEPU)",
      "Australian Manufacturing Workers Union (AMWU)",
      "Community and Public Sector Union (CPSU)",
      "United Workers Union (UWU)",
      "National Tertiary Education Union (NTEU)",
      "Independent Education Union of Australia (IEU)",
      "Australasian Meat Industry Employees Union (AMIEU)",
      "National Union of Workers (NUW)",
      "Maritime Union of Australia (MUA)",
      "Australian Nursing and Midwifery Federation (ANMF)",
      "Australian Rail Tram and Bus Industry Union (RTBU)",
      "Finance Sector Union (FSU)",
      "Communication Workers Union of Australia (CEPU)",
      "Public Service Association (PSA)",
      "United Firefighters Union of Australia (UFUA)",
      "Mining and Energy Union (MEU)",
      "Queensland Council of Unions (QCU)",
      "Health and Community Services Union (HSU)",
      "Fire Brigade Employees Union (FBEU)",
      "Queensland Hotels Association, Union of Employers (QHA)",
    ].includes(donor)
  ) {
    return DonorType.TradeUnion;
  }

  return undefined;
};

export class AuLoader extends DataLoader {
  private loadedOnce = false;
  private extractedOnce = false;

  constructor() {
    super("AU", Country.australia);
  }

  parties: Record<string, PartyConfig> = {
    "Country Liberal Party": {
      color: "#dd5e23",
      name: "Country Liberal Party of the Northern Territory",
      short: "Country Liberal Party",
      code: "CLP",
      wiki: 6468,
    },
    "Australian Labor Party": {
      code: "ALP",
      name: "Australian Labor Party",
      short: "Labor",
      color: "#e43942",
      wiki: 1495,
    },
    "Liberal Party of Australia": {
      name: "Liberal Party of Australia",
      code: "LIB",
      short: "Liberal",
      color: "#00529b",
      wiki: 18453,
    },
    "Australian Citizens Party": {
      name: "Australian Citizens Party",
      code: "ACP",
      short: "Australian Citizens Party",
      color: "#003367",
      wiki: 911127,
    },
    "National Party of Australia": {
      name: "National Party of Australia",
      code: "NPA",
      short: "Nationals",
      color: "#00704a",
      wiki: 21927,
    },
    "Australian Greens": {
      name: "Australian Greens",
      code: "AG",
      short: "the Greens",
      color: "#008943",
      wiki: 171629,
    },
    "Christian Democratic Party": {
      name: "Christian Democratic Party",
      code: "CDP",
      short: "Christian Democratic Party",
      color: "#16163f",
      wiki: 961695,
    },
    "Australian Democrats": {
      name: "Australian Democrats",
      code: "AD",
      short: "Democrats",
      color: "#28a895",
    },
    "Pauline Hanson's One Nation": {
      wiki: 83013,
      name: "Pauline Hanson's One Nation",
      code: "PHON",
      short: "One Nation",
      color: "#d5540c",
    },
    "Australia First Party": {
      name: "Australia First Party",
      code: "AFP",
      short: "Australia First",
      color: "#333333",
      wiki: 674128,
    },
    "Liberal National Party": {
      name: "Liberal National Party",
      code: "LNP",
      short: "Liberal National Party",
      color: "#005db8",
      wiki: 2529569,
    },
    "Katter's Australian Party": {
      name: "Katter's Australian Party",
      code: "KAP",
      short: "Katter's Australian Party",
      color: "#CB242A",
      wiki: 31981469,
    },
    "Animal Justice Party": {
      name: "Animal Justice Party",
      code: "AJP",
      short: "Animal Justice Party",
      color: "#8e252c",
      wiki: 34735854,
    },
    "The Great Australian Party": {
      name: "The Great Australian Party",
      code: "GAP",
      short: "The Great Australian Party",
      color: "#dd3333",
      wiki: 60461258,
    },
    "Liberal Democratic Party": {
      name: "Libertarian Party",
      code: "LP",
      short: "Libertarian Party",
      color: "#60183C",
      wiki: 3486209,
    },
    "Australian Christians": {
      name: "Australian Christians",
      code: "ACH",
      short: "Australian Christians",
      color: "#f3cc13",
      wiki: 36233542,
    },
    "United Australia Party": {
      name: "United Australia Party",
      code: "UAP",
      short: "United Australia Party",
      color: "#ffed00",
      wiki: 39248493,
    },
    "Sustainable Australia Party": {
      name: "Sustainable Australia Party",
      code: "SAP",
      short: "Sustainable Australia Party",
      color: "#00205b",
      wiki: 29779487,
    },
    "WESTERN AUSTRALIA PARTY": {
      name: "WESTERN AUSTRALIA PARTY",
      code: "WAP",
      short: "WESTERN AUSTRALIA PARTY",
      color: "#f2b63d",
      wiki: 53172518,
    },
    "Shooters, Fishers and Farmers Party": {
      name: "Shooters, Fishers and Farmers Party",
      code: "SFF",
      short: "Shooters, Fishers and Farmers Party",
      color: "#007cc4",
      wiki: 1406815,
    },
    "Centre Alliance": {
      name: "Centre Alliance",
      code: "CA",
      short: "Centre Alliance",
      color: "#FE6707",
      wiki: 46327582,
    },
    "Independents CAN": {
      name: "Independents CAN",
      code: "ICAN",
      short: "Independents CAN",
      color: "#075266",
      wiki: 60490012,
    },
    "Reason Australia": {
      name: "Reason Australia",
      code: "RA",
      short: "Reason",
      color: "#41c2c2",
      wiki: 20270224,
    },
    "Legalise Cannabis Australia": {
      name: "Legalise Cannabis Australia",
      code: "LCA",
      short: "Legalise Cannabis Australia",
      color: "#034d40",
      wiki: 2428565,
    },
    "Australian Values Party": {
      name: "Australian Values Party",
      code: "AVP",
      short: "Australian Values Party",
      color: "#81896a",
      wiki: 70013971,
    },
    "Victorian Socialists": {
      name: "Victorian Socialists",
      code: "VS",
      short: "Victorian Socialists",
      color: "#27272a",
      wiki: 56494371,
    },
    "Drew Pavlou Democratic Alliance": {
      name: "Drew Pavlou Democratic Alliance",
      code: "DPDA",
      short: "Drew Pavlou Democratic Alliance",
      color: "#4abfac",
      wiki: 64012935,
    },
    "Australian Christian Lobby": {
      name: "Australian Christian Lobby",
      code: "ACL",
      short: "Australian Christian Lobby",
      color: "#154b68",
      wiki: 6128306,
    },
    "Australian Federation Party": {
      name: "Australian Federation Party",
      code: "FP",
      short: "Australian Federation Party",
      color: "#e3a02d",
      wiki: 63271602,
    },
    "Family First Party": {
      name: "Family First Party",
      code: "FFP",
      short: "Family First",
      color: "#C04C36",
      wiki: 957588,
    },
    "Australian Fishing and Lifestyle Party": {
      name: "Australian Fishing and Lifestyle Party",
      code: "AFLP",
      short: "AFLP",
      color: "#7fcaea",
      wiki: 23796845,
    },
    "Australian Liberty Alliance": {
      name: "Australian Liberty Alliance",
      code: "ALA",
      short: "Australian Liberty Alliance",
      color: "#10137e",
      wiki: 47413617,
    },
    "Rise Up Australia Party": {
      name: "Rise Up Australia Party",
      code: "RUAP",
      short: "Rise Up Australia Party",
      color: "#151b7d",
      wiki: 38496307,
    },
    Flux: {
      name: "Flux",
      code: "FLUX",
      short: "Flux",
      color: "#E3580D",
      wiki: 49994000,
    },
    "Socialist Alliance": {
      name: "Socialist Alliance",
      code: "SA",
      short: "Socialist Alliance",
      color: "#e21921",
      wiki: 404732,
    },
    "Australian Conservatives": {
      name: "Australian Conservatives",
      code: "AC",
      short: "Conservatives",
      color: "#1f5c8f",
      wiki: 53111569,
    },
    "Republican Party of Australia": {
      name: "Republican Party of Australia",
      code: "RPA",
      short: "Republican Party of Australia",
      color: "#e8af00",
      wiki: 16186755,
    },
    "Australian Affordable Housing Party": {
      name: "Australian Affordable Housing Party",
      code: "AAHP",
      short: "Affordable Housing Party",
      color: "#662084",
      wiki: 55282626,
    },
    "Australian Equality Party (Marriage)": {
      name: "Australian Equality Party (Marriage)",
      code: "AEP",
      short: "Equality Party",
      color: "#9e22fe",
      wiki: 45337316,
    },
    "Australian Sex Party": {
      name: "Australian Sex Party",
      short: "Sex Party",
      code: "ASP",
      color: "#c70013",
      wiki: 56482886,
    },
    "Derryn Hinch's Justice Party": {
      name: "Derryn Hinch's Justice Party",
      short: "Justice Party",
      code: "DHJP",
      color: "#002f5d",
      wiki: 50210245,
    },
    "Palmer United Party": {
      name: "Palmer United Party",
      short: "Palmer United Party",
      code: "PUP",
      color: "#ffed01",
    },
    "Country Alliance": {
      name: "Country Alliance",
      short: "Country Alliance",
      code: "COUNTRYALLIANCE",
      color: "#feed01",
    },
    GetUp: {
      name: "GetUp!",
      short: "GetUp!",
      code: "GETUP",
      wiki: 2394919,
      color: "#ff671f",
    },
    "Advance Australia": {
      name: "Advance Australia",
      short: "Advance Australia",
      code: "ADVANCE",
      color: "#0F2A55",
      wiki: 60657673,
    },
    "Climate 200": {
      name: "Climate 200",
      short: "Climate 200",
      code: "CLIMATE200",
      color: "#6ac2c4",
      wiki: 69003137,
    },
    "Warringah Independent": {
      name: "Warringah Independent",
      short: "Warringah Independent",
      code: "WI",
      color: "#01b4cd",
    },
    "Progressive Business": {
      name: "Progressive Business",
      short: "Progressive Business",
      code: "PB",
      color: "#1d4077",
    },
    "Jacqui Lambie Network": {
      name: "Jacqui Lambie Network",
      short: "Jacqui Lambie Network",
      code: "JLN",
      color: "#ffdd00",
      wiki: 48186877,
    },
    "Nick Xenophon Team": {
      name: "Nick Xenophon Team",
      short: "Nick Xenophon Team",
      code: "NXT",
      color: "#e24d25",
    },
    "David Pocock": {
      name: "David Pocock",
      short: "David Pocock",
      code: "POCOCK",
      color: "#111330",
      wiki: 16302378,
    },
    "It's Not A Race Limited": {
      name: "It's Not A Race ltd",
      short: "It's Not A Race",
      code: "INAR",
      color: "#051bd8",
    },
    "Trumpet of Patriots": {
      name: "Trumpet of Patriots",
      short: "Trumpet of Patriots",
      code: "TOP",
      wiki: 63271602,
      color: "#ffed11",
    },
    "Australia's Voice": {
      name: "Australia's Voice",
      short: "Australia's Voice",
      code: "AV",
      wiki: 78079916,
      color: "#a60946",
    },
    "Australians for Prosperity": {
      color: "#294A3D",
      code: "A4P",
      name: "Australians for Prosperity",
      short: "Australians for Prosperity",
    },
  };

  donorMeta = donorMeta;

  cacheFile() {
    return path.join(this.cacheDir, `AllAnnualData.zip`);
  }

  protected override normalizeReceiver(receiver: string): string {
    receiver = receiver.trim();

    const lowerReceiver = receiver.toLowerCase();

    // thre letter ones
    if (isShortMatch("NAT", receiver)) {
      return "National Party of Australia";
    }
    if (
      isShortMatch("APL", receiver) ||
      isShortMatch("ALP", receiver) ||
      isShortMatch("LAB", receiver)
    ) {
      return "Australian Labor Party";
    }
    if (isShortMatch("LIB", receiver) || receiver === "NSW LIBERAL PARTY") {
      return "Liberal Party of Australia";
    }
    if (isShortMatch("LNP", receiver)) {
      return "Liberal National Party";
    }
    if (isShortMatch("CLP", receiver)) {
      return "Country Liberal Party";
    }
    if (
      isShortMatch("ACP", receiver) ||
      isShortMatch("CEC", receiver) ||
      isShortMatch("CED", receiver)
    ) {
      return "Australian Citizens Party";
    }
    if (isShortMatch("GRN", receiver)) {
      return "Australian Greens";
    }
    if (isShortMatch("NATS-FED", receiver)) {
      return "National Party of Australia";
    }

    // others
    if (
      receiver.startsWith("Australian Christian Lobby") ||
      receiver.startsWith("The Australian Christian Lobby")
    ) {
      return "Australian Christian Lobby";
    }
    if (
      // https://en.wikipedia.org/wiki/Australian_Labor_Party#Country_Labor
      receiver.startsWith("Country Labor") ||
      receiver.startsWith("Camden State Campaign Labor NSW") ||
      receiver.startsWith("ALP National (ALP-FED)") ||
      receiver.startsWith("Progressive Business (ALP-VIC)") ||
      receiver.startsWith("Tasmanian Labor") ||
      receiver.startsWith("Progressive Business Association (ALP Victoria)") ||
      /.*Labour Party.*/i.test(receiver) ||
      /.*Labor Party.*/i.test(receiver) ||
      receiver.startsWith("SA Progressive Business (ALP-SA)") ||
      receiver.startsWith("Emily's List SA (ALP-FED)") ||
      receiver.startsWith("WA Labor") ||
      receiver.startsWith("Mark Dreyfus QC MP ALP-ISAACS") ||
      /.* ALP .*/.test(receiver)
    ) {
      return "Australian Labor Party";
    }
    if (receiver.startsWith("Independents For Climate Action Now")) {
      return "Independents CAN";
    }
    if (
      lowerReceiver.startsWith("getup") ||
      lowerReceiver.startsWith("get up")
    ) {
      return "GetUp";
    }
    if (lowerReceiver.match(/^advanced? aus/) || lowerReceiver === "advance") {
      return "Advance Australia";
    }
    if (lowerReceiver.match(/^climate ?200/)) {
      return "Climate 200";
    }
    if (lowerReceiver.startsWith("warringah independ")) {
      return "Warringah Independent";
    }
    if (lowerReceiver.startsWith("progressive business")) {
      return "Progressive Business";
    }
    if (
      receiver === "ACTU" ||
      receiver.startsWith("Australian Council of Trade Unions")
    ) {
      return "ACTU";
    }
    if (
      receiver === "ACCI" ||
      receiver.includes("Chamber of Commerce and Industry")
    ) {
      return "ACCI";
    }
    if (
      receiver.includes("500 Club") ||
      receiver.includes("Five Hundred Club")
    ) {
      return "500 Club";
    }
    if (receiver === "Legalise Cannabis Party") {
      return "Legalise Cannabis Australia";
    }

    if (
      receiver.startsWith("National (NSW)") ||
      receiver.toUpperCase().startsWith("NATIONAL PARTY OF AUSTRALIA") ||
      receiver.startsWith("NATS") ||
      receiver.startsWith("Nationals Party") ||
      receiver.startsWith("Nationals") ||
      receiver.startsWith("Nationls (NSW)") ||
      receiver.startsWith("NSW Nationals") ||
      receiver.startsWith("The Nationals") ||
      receiver.startsWith("National Party") ||
      receiver.startsWith("The National Party") ||
      receiver.startsWith("NP-") ||
      receiver === "South Australian National Party"
    ) {
      return "National Party of Australia";
    }
    if (receiver.startsWith("Citizens Electoral Council of Australia")) {
      return "Australian Citizens Party";
    }
    if (receiver.startsWith("Australian Conservatives")) {
      return "Australian Conservatives";
    }

    if (receiver.startsWith("VOTEFLUX.ORG")) {
      return "Flux";
    }
    if (receiver.startsWith("Rise Up Australia Party")) {
      return "Rise Up Australia Party";
    }

    if (receiver.startsWith("Australian Federation Party")) {
      return "Australian Federation Party";
    }
    if (receiver.startsWith("Pauline Hanson") || receiver.startsWith("ON-")) {
      return "Pauline Hanson's One Nation";
    }
    if (receiver.startsWith("Shooters and Fishers Party")) {
      return "Shooters, Fishers and Farmers Party";
    }
    if (receiver.startsWith("Family First Party")) {
      return "Family First Party";
    }
    if (
      /Liberal Party.*/.test(receiver) ||
      receiver.startsWith("LIBERAL NEW SOUTH WALES") ||
      lowerReceiver.startsWith("liberal party") ||
      receiver.startsWith("LPA ") ||
      receiver.startsWith("Liberal Part of Australia") ||
      receiver.startsWith("Epping SEC Liberal NSW") ||
      receiver.startsWith("CJPW (LIB-FED)") ||
      receiver.startsWith("NSW Liberal Party (NSW Division)") ||
      receiver.startsWith("NSW Liberal Forum") ||
      receiver.startsWith("Bradfield Forum (Liberal Party of Australia)") ||
      receiver.startsWith("2010 Business Forum - Liberal Party of NSW") ||
      receiver.startsWith("Liberal Forum NSW") ||
      receiver.startsWith("Libs-NSW") ||
      receiver.startsWith("Higgins 200 Club") ||
      receiver.startsWith("Federal Liberal Party") ||
      receiver === "Willoughby Sec - Liberal Party" ||
      lowerReceiver.includes("liberal party of australia") ||
      receiver.startsWith("Liberal - NSW") ||
      receiver.startsWith("Millenium Forum - Liberal Party of NSW") ||
      receiver.startsWith("Canning Liberal Campaign") ||
      receiver.startsWith("Liberal Pary of Australia") ||
      receiver.startsWith("LP-")
    ) {
      return "Liberal Party of Australia";
    }
    if (receiver.startsWith("JLN-")) {
      return "Jacqui Lambie Network";
    }
    if (
      receiver.startsWith("#Sustainable Population Party") ||
      receiver.startsWith("#Sustainable Australia") ||
      lowerReceiver.startsWith("sustainable australia")
    ) {
      return "Sustainable Australia Party";
    }
    if (lowerReceiver.includes("greens")) {
      return "Australian Greens";
    }
    if (
      receiver.startsWith("Christian Democratic Party") ||
      receiver === "CDP"
    ) {
      return "Christian Democratic Party";
    }
    if (
      lowerReceiver.startsWith("liberal national party") ||
      receiver.startsWith("Liberal-National Party")
    ) {
      return "Liberal National Party";
    }
    if (lowerReceiver.startsWith("katter's") || receiver.startsWith("KAP")) {
      return "Katter's Australian Party";
    }
    if (
      receiver.startsWith("Palmer United Party") ||
      receiver.startsWith("PUP - Palmer United Party")
    ) {
      return "Palmer United Party";
    }

    if (lowerReceiver.includes("united australia party")) {
      return "United Australia Party";
    }
    if (lowerReceiver.includes("country liberal")) {
      return "Country Liberal Party";
    }
    if (
      lowerReceiver.startsWith("liberal democratic party") ||
      receiver === "Libertarian Party"
    ) {
      return "Liberal Democratic Party";
    }

    if (
      receiver === "Nick Xenophon Team" ||
      lowerReceiver.startsWith("xen") ||
      receiver.includes("NXT")
    ) {
      return "Nick Xenophon Team";
    }

    if (receiver.startsWith("David Pocock")) {
      return "David Pocock";
    }

    if (lowerReceiver.includes("not a race")) {
      return "It's Not A Race Limited";
    }

    return receiver;
  }

  async loadYearDataToCache(): Promise<void> {
    if (this.loadedOnce) {
      this.log(
        "Skipping year data load, already ran and loaded everything at once",
      );
      return;
    }

    this.loadedOnce = true;

    const url = "https://transparency.aec.gov.au/Download/AllAnnualData";

    this.log(`Downloading all year data from ${url}...`);
    const res = await fetch(url);

    if (!res.ok) {
      throw `Unable to load ${url}: ${res.status}`;
    }

    const resBuf = await res.arrayBuffer();

    await fsPromises.writeFile(this.cacheFile(), Buffer.from(resBuf));
  }

  protected override normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    donor = super
      .normalizeDonor(donor, address)
      // replace trailing " Limited" with " Ltd"
      .replace(/ Limited$/i, " Ltd")
      .replace(/associatiion\b/i, "Association")
      .replace(/assocation\b/i, "Association")
      .replace(/associatio\b/i, "Association")
      .replace(/associoation\b/i, "Association")
      .replace(/associaton\b/i, "Association")
      .replace(/assocn\b/i, "Association")
      .replace(/assoc\b/i, "Association")
      .replace(/associaiton\b/i, "Association");

    const lowerDonor = donor.toLowerCase();

    if (donor === "Wall, Pamela") {
      return "Wall OAM, Pamela";
    }

    if (
      lowerDonor.includes("australian") &&
      /hotels?/.test(lowerDonor) &&
      /associai?ti?on/.test(lowerDonor)
    ) {
      return "Australian Hotels Association";
    }

    if (lowerDonor === "mineralogy pty ltd") {
      return "Mineralogy Pty Ltd";
    }

    if (donor.includes("Sarina Russo") && donor.includes("Job Access")) {
      return "Sarina Russo Job Access (Australia) Pty. Ltd.";
    }

    if (lowerDonor.includes("clubsnsw")) {
      return "ClubsNSW";
    }

    if (lowerDonor.includes("500 club")) {
      return "The 500 Club";
    }

    if (
      lowerDonor.startsWith("cartwright investment corp") &&
      lowerDonor.includes("burleigh")
    ) {
      return "Cartwright Investment Corp Pty Ltd ATF Burleigh Trust";
    }

    if (
      lowerDonor.startsWith("silver river investment holdings") &&
      lowerDonor.includes("fenwick")
    ) {
      return "Silver River Investment Holdings Pty Ltd ATF Fenwick Family Trust";
    }

    if (
      lowerDonor.startsWith("altum pty") &&
      lowerDonor.includes("altum property")
    ) {
      return "Altum Pty Ltd ATF The Altum Property Unit Trust";
    }

    if (lowerDonor.startsWith("sentinel property group")) {
      return "Sentinel Property Group";
    }

    if (lowerDonor.startsWith("pratt holdings")) {
      return "Pratt Holdings Pty Ltd";
    }

    if (lowerDonor.startsWith("pfizer")) {
      return "Pfizer Australia Pty Ltd";
    }

    if (containsWords(lowerDonor, "palmer leisure")) {
      return "Palmer Leisure Australia Pty Ltd";
    }

    if (containsWords(lowerDonor, "palmer clive")) {
      return "Palmer, Clive Frederick";
    }

    if (containsWords(lowerDonor, "palmer anna")) {
      return "Palmer, Anna";
    }

    if (containsWords(lowerDonor, "hughes clive")) {
      return "Hughes, Clive";
    }

    if (lowerDonor === "westpac" || lowerDonor.startsWith("westpac ba")) {
      return "Westpac Banking Corporation";
    }

    // :harold:
    if (lowerDonor.startsWith("bus ass")) {
      return "Bus Association Victoria";
    }

    if (
      (lowerDonor.includes("shop") &&
        lowerDonor.includes("distributive") &&
        (lowerDonor.includes("allied employees") ||
          /associ?ation/.test(lowerDonor))) ||
      /^sda ?/.test(lowerDonor)
    ) {
      return "Shop, Distributive and Allied Employees' Association (SDA)";
    }

    if (
      lowerDonor === "village roadshow" ||
      /village roadshow.*ltd/.test(lowerDonor)
    ) {
      return "Village Roadshow Pty Ltd";
    }

    if (
      lowerDonor.includes("australian services union") ||
      lowerDonor.includes("australian service union") ||
      lowerDonor.startsWith("asu ") ||
      (lowerDonor.includes("australian") &&
        lowerDonor.includes("municipal") &&
        lowerDonor.includes("administrative") &&
        lowerDonor.includes("clerical"))
    ) {
      return "Australian Services Union (ASU)";
    }

    if (lowerDonor.includes("health services union")) {
      return "Health Services Union (HSU)";
    }

    if (
      /australian workers?.? union/.test(lowerDonor) ||
      lowerDonor.startsWith("austn workers union") ||
      lowerDonor.startsWith("awu ")
    ) {
      return "Australian Workers Union (AWU)";
    }

    if (lowerDonor.includes("health workers union")) {
      return "Health Workers Union (HWU)";
    }

    if (lowerDonor.includes("australian education union")) {
      return "Australian Education Union (AEU)";
    }

    if (donor === "Fire Brigade Employees' Union") {
      return "Fire Brigade Employees Union (FBEU)";
    }

    if (donor === "Queensland Hotels Association, Union of Employers") {
      return "Queensland Hotels Association, Union of Employers (QHA)";
    }

    if (
      (lowerDonor.includes("rail") &&
        lowerDonor.includes("tram") &&
        lowerDonor.includes("bus")) ||
      lowerDonor.startsWith("rtbu ")
    ) {
      return "Australian Rail Tram and Bus Industry Union (RTBU)";
    }

    if (
      lowerDonor.includes("communication") &&
      lowerDonor.includes("worker") &&
      lowerDonor.includes("union")
    ) {
      return "Communication Workers Union of Australia (CEPU)";
    }

    if (lowerDonor.includes("pharmacy guild")) {
      return "The Pharmacy Guild of Australia";
    }

    if (lowerDonor.startsWith("national tertiary education")) {
      return "National Tertiary Education Union (NTEU)";
    }
    if (
      lowerDonor.startsWith("australiasian meat industry") ||
      lowerDonor.startsWith("australasian meat industry") ||
      /^a ?m ?i ?e ?u/.test(lowerDonor) ||
      lowerDonor.endsWith(" amieu")
    ) {
      return "Australasian Meat Industry Employees Union (AMIEU)";
    }

    if (lowerDonor.startsWith("independent education union")) {
      return "Independent Education Union of Australia (IEU)";
    }
    if (
      lowerDonor.startsWith("finance sector union") ||
      lowerDonor.startsWith("fsu ")
    ) {
      return "Finance Sector Union (FSU)";
    }
    if (lowerDonor.startsWith("public service association")) {
      return "Public Service Association (PSA)";
    }
    if (
      "mining energy union"
        .split(" ")
        .every((word) => lowerDonor.includes(word))
    ) {
      return "Mining and Energy Union (MEU)";
    }

    if (lowerDonor.includes("united workers union")) {
      return "United Workers Union (UWU)";
    }
    if (lowerDonor.includes("united workers union")) {
      return "Health and Community Services Union (HSU)";
    }
    if (lowerDonor.startsWith("association of mining and exploration")) {
      return "Association of Mining and Exploration Companies";
    }

    if (lowerDonor.startsWith("united firefighters union")) {
      return "United Firefighters Union of Australia (UFUA)";
    }
    if (lowerDonor.includes("union education foundation")) {
      return "The Union Education Foundation Ltd";
    }
    if (lowerDonor.startsWith("united voice")) {
      return "United Voice";
    }
    if (lowerDonor.startsWith("australian nursing and midwifery")) {
      return "Australian Nursing and Midwifery Federation (ANMF)";
    }
    if (
      lowerDonor.startsWith("qcu") ||
      lowerDonor.startsWith("queensland council of unions")
    ) {
      return "Queensland Council of Unions (QCU)";
    }
    if (
      lowerDonor.startsWith("maritime union") ||
      lowerDonor.startsWith("mua ")
    ) {
      return "Maritime Union of Australia (MUA)";
    }
    if (
      lowerDonor.startsWith("national union of workers") ||
      lowerDonor.startsWith("nuw ")
    ) {
      return "National Union of Workers (NUW)";
    }
    if (
      lowerDonor.includes("community service") ||
      lowerDonor.includes("health")
    ) {
      return "Health and Community Services Union (HSU)";
    }

    if (
      (lowerDonor.includes("community") &&
        lowerDonor.includes("public sector")) ||
      /^CPSU ?/i.test(lowerDonor)
    ) {
      return "Community and Public Sector Union (CPSU)";
    }
    if (
      lowerDonor.includes("australian manufacturing worker") ||
      "automotive food metals engineering printing"
        .split(" ")
        .every((word) => lowerDonor.includes(word)) ||
      /^a ?m ?w ?u ?/.test(lowerDonor)
    ) {
      return "Australian Manufacturing Workers Union (AMWU)";
    }

    if (
      (lowerDonor.includes("communications") &&
        lowerDonor.includes("electrical") &&
        lowerDonor.includes("plumbing") &&
        lowerDonor.includes("union")) ||
      lowerDonor.startsWith("cepu ")
    ) {
      return "Communications, Electrical and Plumbing Union (CEPU)";
    }

    if (
      lowerDonor.includes("electrical trades union") ||
      /^etu ?/.test(lowerDonor)
    ) {
      return "Electrical Trades Union of Australia (ETU)";
    }

    // must be before TWU
    if (/TWU ?Super/i.test(lowerDonor)) {
      return "TWU Super";
    }

    if (
      (lowerDonor.includes("transport") &&
        /workers?/.test(lowerDonor) &&
        lowerDonor.includes("union")) ||
      lowerDonor.startsWith("twu ")
    ) {
      return "Transport Workers' Union of Australia (TWU)";
    }

    if (
      (lowerDonor.includes("construction") &&
        lowerDonor.includes("forestry") &&
        lowerDonor.includes("union")) ||
      /^CFMEU ?/i.test(lowerDonor)
    ) {
      return "Construction, Forestry, Maritime, Mining & Energy Union (CFMEU)";
    }

    return donor;
  }

  async extractYearData(): Promise<ExtractedYearData[]> {
    if (this.extractedOnce) {
      this.log(
        "Skipping year data extraction, already ran and loaded everything at once",
      );
      return [];
    }

    this.extractedOnce = true;
    const records: ExtractedYearData[] = [];

    records.push(
      ...(await streamParseCsv(
        this.cacheFile(),
        /Donations Made\.csv/,
        (record) => {
          const [yearRange, donor, receiver, date, value] = record as string[];

          let isoDate = date
            ? getLocalISODateString(date)
            : yearRange.split("-")[0];

          // workaround for data typo
          if (isoDate.startsWith("2106")) {
            isoDate = `2016-${isoDate.substring(5)}`;
          }

          if (this.minimumProcessedYear > isoDate.substring(0, 4)) return;

          const address: DonationAddress = { [AddressField.Country]: "AU" };
          const donorType: DonorType | undefined = classifyDonorType(
            this.normalizeDonor(donor, address),
          );

          return {
            idx: `r${records.length}`,
            [DonationField.Amount]: parseFloat(value),
            [DonationField.DonorName]: donor,
            [DonationField.Date]: isoDate,
            [DonationField.Address]: address,
            [DonationField.Receiver]: receiver as ReceiverId,
            ...(donorType !== undefined && {
              [DonationField.DonorType]: donorType,
            }),
          };
        },
      )),
    );

    // records.push(
    //   ...(await streamParseCsv(
    //     this.cacheFile(),
    //     /Detailed Receipts\.csv/,
    //     (record) => {
    //       const [
    //         financialYear,
    //         returnType,
    //         recipientName,
    //         receivedFrom,
    //         receiptType,
    //         value,
    //       ] = record as string[];
    //
    //       const isoDate = financialYear.split("-")[0];
    //
    //       if (this.minimumProcessedYear > isoDate.substring(0, 4)) return;
    //
    //       const normalizeReceiver = this.normalizeReceiver(recipientName);
    //
    //       if (skipParties.has(normalizeReceiver)) return;
    //
    //       if (!this.parties[normalizeReceiver]) return;
    //
    //       return {
    //         idx: `r${records.length}`,
    //         amount: parseFloat(value),
    //         donor: receivedFrom,
    //         date: isoDate,
    //         address: { country: "AU" },
    //         receiver: normalizeReceiver,
    //       };
    //     },
    //   )),
    // );

    return records;
  }
}

const streamParseCsv = async (
  filePath: string,
  pattern: RegExp,
  cb: (record: string[]) => ExtractedYearData | undefined,
) => {
  const deferred = new Deferred<ExtractedYearData[]>();
  const records: ExtractedYearData[] = [];

  // parse donations made csv in zip file
  const csvInZipStream = fs
    .createReadStream(filePath)
    .pipe(unzipper.ParseOne(pattern));

  const parser = parse({
    delimiter: ",",
    fromLine: 2, // Skip the header line
    relax_column_count: true,
  });

  parser.on("end", function () {
    console.log("got donations", records.length);
    deferred.resolve(records);
  });

  // Use the readable stream api to consume records
  parser.on("readable", () => {
    let record: unknown;
    while ((record = parser.read()) !== null) {
      if (!record) continue;

      const extracted = cb(record as string[]);
      if (!extracted) continue;
      records.push(extracted);
    }
  });

  // Catch any error
  parser.on("error", function (err) {
    console.error(err.message);
    deferred.reject(err);
  });

  console.log("streaming csv in zip file to csv parser");
  csvInZipStream.pipe(parser);

  return deferred.promise;
};

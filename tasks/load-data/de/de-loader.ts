import fs from "fs/promises";
import path from "path";

import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";
import { containsWords, timeout } from "../util";
import { extractAddress } from "./address";
import { isNotNullandNotUndefined } from "../../../src/utils/array";
import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";

import type {
  ExtractedDonationAddress,
  ReceiverId,
} from "../../../src/utils/types";
import type { ExtractedYearData, PartyConfig } from "../data-loader";

const normalizedReceivers: Record<string, string> = {
  BÜNDNIS: "BÜNDNIS 90 / DIE GRÜNEN",
  "BÜNDNIS 90/DIE GRÜNEN": "BÜNDNIS 90 / DIE GRÜNEN",
  "BÜNDNIS 90/ DIE GRÜNEN": "BÜNDNIS 90 / DIE GRÜNEN",
  "VOLT DEUTSCH-LAND": "VOLT DEUTSCHLAND",
  VOLT: "VOLT DEUTSCHLAND",
  "DIE GERECHTIG": "TEAM TODENHÖFER",
  DIEBASIS: "BASIS",
  "PARTEI BÜNDNIS SAHRA WAGENKNECHT": "BÜNDNIS SAHRA WAGENKNECHT",
  BSW: "BÜNDNIS SAHRA WAGENKNECHT",
  "DIE GERECHTIGKEITSPARTEI - TEAM TODENHÖFER": "TEAM TODENHÖFER",
  "DIE GERECHTIGKEITS": "TEAM TODENHÖFER",
};

const monthAliases: Record<string, string> = {
  Januar: "01",
  Februar: "02",
  März: "03",
  April: "04",
  Mai: "05",
  Juni: "06",
  Juli: "07",
  August: "08",
  September: "09",
  Oktober: "10",
  November: "11",
  Dezember: "12",
};
const months = Object.keys(monthAliases);

const stripEuroDot = (str: string): string => str.replace(/\./g, "");
const toEurFloat = (str: string): number => {
  str = str.replace("ca.", "").replace("ca", "").trim();

  const hasPost = str.indexOf(",") !== -1;
  const pre = hasPost
    ? parseInt(str.substring(0, str.indexOf(",")), 10)
    : parseInt(str, 10);
  const post = parseFloat("0." + str.substring(str.indexOf(",") + 1));
  let sum = 0;

  if (!isNaN(pre)) {
    sum = pre;
  }
  if (hasPost && !isNaN(post)) {
    sum += post;
  }
  return sum;
};

const toIsoDate = (dateStr: string, year?: string): string => {
  dateStr = dateStr.replace(/ /g, "");
  if (dateStr.includes("/")) {
    console.warn(`got weird date format: ${dateStr}`);

    // there are some dates that use format: day1./day2.08.2020
    if (dateStr[3] === "/") {
      const remainder = dateStr.substring(7);
      const date1 = toIsoDate(`${dateStr.substring(0, 3)}${remainder}`);

      console.warn(`transformed to: ${date1}`);
      return date1;
    } else if (dateStr.at(-1) === "/") {
      // handle 26.10.2016/
      console.warn(
        `transformed to: ${dateStr.substring(0, dateStr.length - 1)}`,
      );
      return toIsoDate(dateStr.substring(0, dateStr.length - 1));
    } else {
      console.warn("got other weird date", dateStr);
    }
  }

  if (dateStr.substring(2, 4) === ".-") {
    // case 06.-08.08.2013
    const remainder = dateStr.substring(6);
    return toIsoDate(`${dateStr.substring(0, 2)}${remainder}`);
  }

  const parts = dateStr.split(".");
  if (parts.length === 2) {
    // there is a case where germany reports dates in the format `number. April year`
    const [day, monthYear] = parts;
    const [month, year] = monthYear
      .trim()
      .split(" ")
      .map((s) => s.trim());
    const monthNum = monthAliases[month];
    if (!monthNum) {
      throw new Error(`Unknown month: ${month} ${dateStr}`);
    }

    parts[0] = day;
    parts[1] = monthNum;
    parts[2] = year;
  } else if (parts[2].length === 0)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    parts[2] = year;
  return parts.toReversed().join("-");
};

export class DeLoader extends DataLoader {
  constructor() {
    super("DE", Country.germany);
  }

  parties: Record<string, PartyConfig> = {
    AFD: {
      color: "#34a3d2",
      code: "AFD",
      short: "AfD",
      name: "Alternative für Deutschland",
      wiki: 7669143,
    },
    "BÜNDNIS 90 / DIE GRÜNEN": {
      color: "#4ba345",
      code: "GRUENE",
      short: "Die Grünen",
      name: "Bündnis 90/Die Grünen",
      wiki: 697216,
    },
    "BÜNDNIS SAHRA WAGENKNECHT": {
      color: "#bf1d46",
      code: "BSW",
      short: "BSW",
      name: "Bündnis Sahra Wagenknecht – Vernunft und Gerechtigkeit",
      wiki: 12853745,
    },
    CDU: {
      color: "#373737",
      code: "CDU",
      short: "CDU",
      name: "Christlich Demokratische Union Deutschlands",
      wiki: 3956889,
    },
    CSU: {
      color: "#0076b6",
      code: "CSU",
      short: "CSU",
      name: "Christlich-Soziale Union in Bayern",
      wiki: 16746,
    },
    "DIE LINKE": {
      color: "#96276e",
      code: "LINKE",
      short: "Die Linke",
      name: "Die Linke",
      wiki: 5386785,
    },
    "DIE PARTEI": {
      color: "#B92837",
      code: "PARTEI",
      short: "Die PARTEI",
      name: "Die PARTEI",
      wiki: 317517,
    },
    BASIS: {
      color: "#8bcbbd",
      code: "BASIS",
      short: "Die BASIS",
      name: "Basisdemokratische Partei Deutschland",
      wiki: 11645713,
    },
    DKP: {
      color: "#ff0000",
      code: "DKP",
      short: "DKP",
      name: "Deutsche Kommunistische Partei",
      wiki: 12821,
    },
    DVU: {
      color: "#aa4422",
      code: "DVU",
      short: "DVU",
      name: "Deutsche Volksunion",
      wiki: 114978,
    },
    FDP: {
      color: "#f6bb00",
      code: "FDP",
      short: "FDP",
      name: "Freie Demokratische Partei",
      wiki: 1624,
    },
    "FREIE WÄHLER": {
      color: "#00519e",
      code: "FREIEWAEHLER",
      short: "FREIE WÄHLER",
      name: "FREIE WÄHLER",
      wiki: 6634230,
    },
    MLPD: {
      color: "#D0011B",
      code: "MLPD",
      short: "MLPD",
      name: "Marxistisch-Leninistische Partei Deutschlands",
      wiki: 134557,
    },
    NPD: {
      color: "#e00622",
      code: "NPD",
      short: "NPD",
      name: "Nationaldemokratische Partei Deutschlands",
      wiki: 36663,
    },
    SPD: {
      color: "#db4240",
      code: "SPD",
      short: "SPD",
      name: "Sozialdemokratische Partei Deutschlands",
      wiki: 855440,
    },
    SSW: {
      color: "#003c91",
      code: "SSW",
      short: "SSW",
      name: "Südschleswigscher Wählerverband",
      wiki: 21019,
    },
    "TEAM TODENHÖFER": {
      color: "#bb1f2a",
      code: "TODENHOEFER",
      short: "Die Gerechtigkeitspartei",
      name: "Die Gerechtigkeitspartei – Team Todenhöfer",
      wiki: 11528335,
    },
    "VOLT DEUTSCHLAND": {
      color: "#502379",
      code: "VOLT",
      short: "Volt",
      name: "Volt Deutschland",
      wiki: 11713753,
    },
    WERTEUNION: {
      color: "#013B5B",
      code: "WU",
      short: "WerteUnion",
      name: "WerteUnion",
      wiki: 9837249,
    },
  };

  donorMeta = donorMeta;

  protected normalizeReceiver(receiver: string): string {
    let normalized = super
      .normalizeReceiver(receiver)
      .toUpperCase()
      .replace(/\./g, "")
      .replace(/-$/g, "")
      .trim();

    if (normalizedReceivers[normalized]) {
      normalized = normalizedReceivers[normalized];
    }

    return normalized;
  }

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.html`);
  }

  override partyId(party: string): string {
    if (party === "BASIS") return "DIEBASIS";

    return super.partyId(party);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const url = `https://www.bundestag.de/parlament/praesidium/parteienfinanzierung/fundstellen50000/${year}`;

    this.log(`Loading donation page for year ${year}: ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1080,
        height: 1024,
      },
    });
    const page = await browser.newPage();
    await page.setCacheEnabled(false);

    // Navigate the page to a URL
    const response = await page.goto(url);
    try {
      await page.waitForSelector(".bt-artikel__title:not(.bt-error__heading)");
      // wait a second because they have some js animation that takes a while to finish
      await timeout(1000);
    } catch {
      throw new Error(`Unable to load ${url}: ${response?.status()}`);
    }

    const html = await page.evaluate(() => document.documentElement.outerHTML);

    await browser.close();

    await fs.writeFile(this.cacheFile(year), html, {
      encoding: "utf8",
    });
  }

  private extractDonor(lines: string[]): string {
    let donor = lines[0];

    if (
      lines
        .map((w) => w.trim())
        .join(" ")
        .includes("Philip Harting Familienstiftung")
    ) {
      return "Philip Harting Familienstiftung";
    }

    if (lines.length >= 3) {
      donor = lines.slice(0, lines.length - 2).join(" ");
    }

    return donor;
  }

  protected override normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    donor = super.normalizeDonor(donor, address);

    if (donor.includes("Carl Rudolf Thies Knauf")) {
      return "Carl Rudolf Thies Knauf";
    }

    if (donor.includes("Winfried") && donor.includes("Stöcker")) {
      donor = "Prof. Dr. Winfried Alexander Stöcker";
    }

    if (donor.includes("BSW - Vernunft und Gerechtigkeit e.V.")) {
      donor = "BSW - Für Vernunft und Gerechtigkeit e.V.";
    }

    if (donor.includes("Thadaeus") && donor.includes("Otto")) {
      donor = "Thadaeus Friedemann Otto";
    }

    if (donor.includes("Deutsche Vermögensberatung")) {
      donor = "Deutsche Vermögensberatung AG";
    }

    if (donor.includes("The Hill House")) {
      return "Philipp Freise";
    }

    if (donor.includes("Gossler & Co")) {
      donor = "Berenberg Bank";
    }

    if (donor.toLowerCase().includes("trumpf")) {
      donor = "TRUMPF SE + Co. KG";
    }

    if (donor.includes("Sydslesvigudvalget")) {
      donor = "Sydslesvigudvalget/ Kulturministeriet, Kulturstyrelsen";
    }

    if (donor.includes("Schwarz-Schütte")) {
      donor = "Patrick Anton Walther Schwarz-Schütte";
    }

    if (donor.toUpperCase().includes("SÜDWESTMETALL")) {
      donor =
        "Südwestmetall – Verband der Metall- und Elektroindustrie Baden-Württemberg e. V.";
    }

    if (
      donor.includes("Verband der Bayerischen") ||
      // published by Bundestag on 2025-12-29
      donor.includes("Verband der Bayrischen Metall")
    ) {
      donor =
        "vbm - Verband der Bayerischen Metall- und Elektro-Industrie e.V.";
    }

    if (donor.includes("Martin Herrenknecht")) {
      donor = "Martin Herrenknecht";
    }

    if (donor.startsWith("Coroplast Fritz Müller")) {
      donor = "Coroplast Fritz Müller";
    }
    if (donor.startsWith("Gerhard Dingler")) {
      donor = "Gerhard Dingler";
    }

    // remove herr/frau
    donor = donor.replaceAll(/^herr/gi, "").replaceAll(/^frau/gi, "");

    if (donor.includes("Susanne Klatten")) {
      donor = "Susanne Klatten";
    }
    if (donor.includes("Stefan Quandt")) {
      donor = "Stefan Quandt";
    }
    if (donor.includes("Gabriele Quandt")) {
      donor = "Gabriele Quandt";
    }
    if (donor.includes("Johanna Quandt")) {
      donor = "Johanna Quandt";
    }
    if (donor.includes("Alexander Kahl") || donor.includes("Christoph Kahl")) {
      donor = "Christoph Alexander Kahl";
    }
    if (donor.includes("Harald Christ")) {
      donor = "Harald Christ";
    }
    if (donor.includes("Carsten Maschmeyer")) {
      donor = "Carsten Maschmeyer";
    }
    if (donor.startsWith("Harald Link")) {
      donor = "Harald Link";
    }
    if (donor.startsWith("Daniela Porsche")) {
      donor = "Daniela Porsche";
    }
    if (donor.includes("Torsten Toeller")) {
      donor = "Torsten Toeller";
    }
    if (donor.includes("Stephan Schambach")) {
      donor = "Stephan Schambach";
    }
    if (
      donor.toUpperCase().includes("METALL NRW") ||
      donor.includes("Metall- und Elektro-Industrie Nordrhein") ||
      donor.includes("Metall- und Elektroindustrie Nordrhein")
    ) {
      donor =
        "METALL NRW - Verband der Metall- und Elektro-Industrie Nordrhein-Westfalen e.V.";
    }
    if (donor.includes("Joachim Langmann")) {
      donor = "Prof. Dr. Hans-Joachim Langmann";
    }
    if (donor.includes("Verband der Chemischen Industrie")) {
      donor = "VCI - Verband der Chemischen Industrie e.V.";
    }
    if (donor.includes("Kofler") && donor.includes("Georg")) {
      donor = "Dr. Georg Jakob Kofler";
    }
    if (donor.includes("Georg Näder")) {
      donor = "Prof. Hans Georg Näder";
    }
    if (donor.startsWith("Klaus-Michael Kühne")) {
      donor = "Klaus-Michael Kühne";
    }
    if (donor.startsWith("Wilfried Pabst")) {
      donor = "Wilfried Pabst";
    }
    if (donor === "General Logistics Systems Germany GmbH + Co OHG") {
      donor = "GLS Germany GmbH + Co OHG";
    }

    if (donor.includes("Elmar Reiss")) {
      donor = "Elmar Reiss";
    }

    if (donor.includes("Johannes Schuetze") && donor.includes("Import AG")) {
      donor = "Johannes Schuetze Energy Import AG";
    }

    if (
      donor.includes("Gesamtmetall") ||
      donor.includes("Gesamtverband der Arbeitgeberverbände der Metall")
    ) {
      donor = "Gesamtmetall";
    }

    if (
      donor.includes("R & W") ||
      donor.includes("R + W") ||
      donor.includes("R&W") ||
      donor.includes("R+W")
    ) {
      // find R&W / R & W
      donor = "R&W Industriebeteiligungen GmbH";
    }

    if (donor.includes("Johannes Peter Huth")) {
      return "Johannes Peter Huth";
    }

    if (donor.startsWith("Jan-Dirk Lüders")) {
      return "Jan-Dirk Lüders";
    }

    // TODO: this is leaking the address into the name, fix it by improving the address extraction
    if (donor.startsWith("Bernd Erich Beetz")) {
      return "Bernd Erich Beetz";
    }

    if (donor.startsWith("Dr. Karl Gerhold c/o GETEC")) {
      return "Dr. Karl Gerhold c/o GETEC";
    }

    if (donor.startsWith("Christian Oldendorff Via Valpetrosa 10")) {
      return "Christian Oldendorff";
    }

    if (donor.startsWith("Andreas Bremke NEO 211")) {
      return "Andreas Bremke";
    }

    if (donor.includes("Marquardt GmbH")) {
      return "Firma Marquardt GmbH";
    }

    if (donor.includes("Theiss") && donor.includes("Naturwaren")) {
      donor = "Dr. Theiss Naturwaren GmbH";
    }

    if (donor.endsWith("Aktiengesellschaft")) {
      return donor.replace(/ Aktiengesellschaft$/, " AG");
    }

    if (
      containsWords(donor, "Hans Helmuth Schmidt") &&
      address[AddressField.Zip] === "52353"
    ) {
      return "Hans-Helmuth Walter Schmidt";
    }

    // replace e. V. with e.V.
    donor = donor.replace(/e\.\s+V\./g, "e.V.");

    return donor;
  }

  private parseHtmlToRawDonations(
    html: string,
  ): { tr: number; columns: string[][] }[] {
    const $ = cheerio.load(html);
    const rawDonationData: { tr: number; columns: string[][] }[] = [];

    $(".bt-standard-content tbody tr").each((trI, tr) => {
      const rawDonation: string[][] = [];
      $(tr)
        .find("td")
        .each((tdI, td) => {
          const tdContent: string[] = [];
          $(td)
            .find("p")
            .contents()
            .each((cI, content) => {
              if (content.type === "tag" && content.name === "br") {
                // skip brs
              } else {
                tdContent.push($(content).text());
              }
            });
          rawDonation.push(tdContent);
        });
      rawDonationData.push({ tr: trI, columns: rawDonation });
    });

    return rawDonationData;
  }

  public transformRawDonation(
    data: { tr: number; columns: string[][] },
    year: string,
  ): ExtractedYearData | undefined {
    const trId = data.tr;
    const donation = data.columns;
    const donor = this.extractDonor(donation[2]);
    const receiver = donation[0][0];
    let dateString: string;

    if (
      donation[3] &&
      months.some((month) => (donation[3][0] as string).includes(month))
    ) {
      dateString = donation[3][0];
    } else {
      if (donation[3]) {
        if (/\d\d /.test(donation[3][1])) {
          // fix ["20.06.20", "23 ", ...]
          donation[3][0] += donation[3][1];
        }
      }

      dateString = donation[3] ? donation[3][0].split(" ")[0] : donation[3][0];
    }

    // handle 18./20./24.10. 2025 or 24./ 26.11.2025
    if (donation[3].join("").split("/").length > 1) {
      const lastDate = donation[3].join("").split("/").pop()!;

      this.log("Found joined year date with multiple slashes: " + lastDate);

      dateString = lastDate.replace(/ /g, "");
    }

    if (
      donation[2]
        .join(" ")
        .includes(
          "Meinungsäußerung im Sinne von § 27 Absatz 1a Satz 5 Parteiengesetz",
        )
    ) {
      // This is a redacted donation as decided by the bundestag
      return;
    }

    if (
      donor === "Philip Harting Familienstiftung" &&
      dateString.startsWith("12.12.2025")
    ) {
      // WHY DO THEY ALWAYS ADD RANDOM TEXT TO THE DATE FIELDS
      dateString = "15.12.2025";
    }

    return {
      idx: `r${trId}`,
      [DonationField.Receiver]: receiver as ReceiverId,
      [DonationField.Amount]: toEurFloat(stripEuroDot(donation[1][0])),
      [DonationField.DonorName]: donor,
      [DonationField.Address]: extractAddress(donation[2])!,
      [DonationField.Date]: this.normalizeIsoDate(toIsoDate(dateString, year)),
    };
  }

  public async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const html = await this.cachedYearData(year);

    this.log(`Extracting donation data for year ${year}`);

    const rawDonationData = this.parseHtmlToRawDonations(html);

    return rawDonationData
      .filter((data) => data.columns.length > 1)
      .flatMap((data) => this.transformRawDonation(data, year))
      .filter(isNotNullandNotUndefined);
  }
}

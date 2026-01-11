/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import path from "path";

import { parse } from "node-xlsx";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";
import { fromPdfDonations } from "./from-pdf-donations";
import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";
import { exists } from "../util";

import type { Countries } from "../../../src/utils/locales";
import type {
  ExtractedDonationAddress,
  ReceiverId,
} from "../../../src/utils/types";
import type { ExtractedYearData, PartyConfig } from "../data-loader";

const mapCountry = (year: string, country: string | undefined): Countries => {
  if (country === "EL") return "GR";
  if (year === "2021") {
    // some unicode madness
    if (country === "ΒΕ") return "BE";
    return (country as Countries) ?? "??";
  }
  if (country === undefined) return "??";

  country = country
    .trim()
    // remove trailing *
    .replace(/\*$/, "");

  const mappings: Record<string, Countries> = {
    Latvia: "LV",
    Spain: "ES",
    Finland: "FI",
    Croatia: "HR",
    Belgium: "BE",
    Luxembourg: "LU",
    Slovenia: "SI",
    Estonia: "EE",
    France: "FR",
    Germany: "DE",
    Ireland: "IE",
    Italy: "IT",
    Poland: "PL",
    Romania: "RO",
    Cyprus: "CY",
    Netherlands: "NL",
    Hungary: "HU",
    Portugal: "PT",
    Sweden: "SE",
    Czechia: "CZ",
    Slovakia: "SK",
    Austria: "AT",
    Greece: "GR",
    Bulgaria: "BG",
    Lithuania: "LT",
    Venezuela: "VE",
  };
  const mapped = mappings[country];
  if (!mapped) {
    throw new Error(`Can't map country: ${country}`);
  }
  return mapped;
};

const extractEur = (strVal: string | number): number => {
  if (typeof strVal === "number") return strVal;

  const [currency, ...amount] = strVal.split(" ");
  if (currency !== "EUR") {
    throw new Error(`Unknown currency ${currency}`);
  }

  return parseFloat(amount.join("").replace(",", "."));
};

const normalizeParty = (party: string): string => {
  let normalized = party.replace("Ø  ", "").replace("’", "'");

  if (normalized.startsWith("Coppieters")) {
    return "Coppieters Foundation";
  }

  if (normalized === "Europe of Sovereign Nations") {
    return "Europe of Sovereign Nations Group";
  }

  if (
    normalized === "Identity et Democracy Party" ||
    normalized === "ID Parti – Identité et Démocratie Parti"
  )
    normalized = "Identity and Democracy Party";

  return normalized;
};

const cleanRow = (row: unknown[]) =>
  row.map((item) => {
    return typeof item === "string" ? item.trim() : item;
  });

const partyIdAlias: Record<string, string> = {
  IDP: "ID",
  ECRP: "ECR",
  Coppieters: "CF",
  "Patriots.eu": "PATRIOTS",
  PfE: "PFE",
};

export class EuLoader extends DataLoader {
  constructor() {
    super("EU", Country.europeanunion);
  }

  parties: Record<string, PartyConfig> = {
    "Alliance of Liberals and Democrats for Europe Party": {
      name: "Alliance of Liberals and Democrats for Europe Party",
      color: "#eb1897",
      short: "ALDE",
      code: "ALDE",
      wiki: 9865,
    },
    "European Green Party": {
      name: "European Green Party",
      color: "#57B45F",
      code: "EGP",
      short: "EGP",
      wiki: 480314,
    },
    "European Conservatives and Reformists Party": {
      name: "European Conservatives and Reformists Party",
      color: "#196da9",
      code: "ECR",
      short: "ECR",
      wiki: 23193233,
    },
    "European Christian Political Movement": {
      name: "European Christian Political Movement",
      color: "#000000",
      code: "ECPM",
      short: "ECPM",
      wiki: 3061330,
    },
    "European People's Party": {
      name: "European People's Party",
      code: "EPP",
      short: "EPP",
      color: "#0053A2",
      wiki: 9866,
    },
    "Party of European Socialists": {
      name: "Party of European Socialists",
      code: "PES",
      short: "PES",
      color: "#dc0000",
      wiki: 24083,
    },
    "Identity and Democracy Party": {
      name: "Identity and Democracy Party",
      code: "ID",
      short: "ID",
      color: "#130b5f",
      wiki: 44882868,
    },
    "Party of the European Left": {
      name: "Party of the European Left",
      code: "EL",
      short: "EL",
      color: "#e91d26",
      wiki: 434034,
    },
    "European Democratic Party": {
      name: "European Democratic Party",
      code: "EDP",
      short: "EDP",
      color: "#015AAA",
      wiki: 841934,
    },
    "European Free Alliance": {
      name: "European Free Alliance",
      code: "EFA",
      short: "EFA",
      color: "#80379b",
      wiki: 9864,
    },

    // foundations
    "Wilfried Martens Centre for European Studies": {
      name: "Wilfried Martens Centre for European Studies",
      code: "WMCES",
      short: "Martens Centre",
      color: "#61849c",
      wiki: 35526891,
    },

    "Green European Foundation": {
      name: "Green European Foundation",
      code: "GEF",
      short: "Green European Foundation",
      color: "#8ebe3f",
      wiki: 27459073,
    },

    "New Direction - The Foundation for European Reform": {
      name: "New Direction - The Foundation for European Reform",
      code: "ND",
      short: "New Direction",
      color: "#003f66",
      wiki: 31307534,
    },

    "Coppieters Foundation": {
      name: "Coppieters Foundation",
      code: "CF",
      short: "Coppieters Foundation",
      color: "#39d8de",
      wiki: 39180047,
    },

    "European Liberal Forum": {
      name: "European Liberal Forum",
      code: "ELF",
      short: "European Liberal Forum",
      color: "#007FA3",
      wiki: 22301753,
    },

    Sallux: {
      name: "Sallux",
      code: "SALLUX",
      short: "Sallux",
      color: "#8DC73F",
      wiki: 38308246,
    },

    "Transform Europe": {
      name: "Transform Europe",
      code: "TE",
      short: "Transform Europe",
      color: "#e41e26",
      wiki: 11775051,
    },

    "Foundation for European Progressive Studies": {
      name: "Foundation for European Progressive Studies",
      code: "FEPS",
      short: "FEPS",
      color: "#BA0909",
      wiki: 11593315,
    },

    "Institute of European Democrats": {
      name: "Institute of European Democrats",
      code: "IED",
      short: "IED",
      color: "#26195C",
    },

    "(previously Association pour l'Identité et Démocratie Fondation)": {
      name: "Identity and Democracy Foundation",
      short: "ID Foundation",
      code: "IDF",
      color: "#1f3173",
    },

    "Patriots.eu": {
      name: "Patriots.eu",
      code: "PATRIOTS",
      short: "Patriots.eu",
      color: "#242f80",
      wiki: 8624459,
    },

    "European Christian Political Party": {
      name: "European Christian Political Party",
      color: "#2754d9",
      code: "ECPP",
      short: "ECPP",
      wiki: 3061330,
    },

    "European Labour Authority": {
      name: "European Labour Authority",
      color: "#85145b",
      code: "ELA",
      short: "ELA",
      wiki: 61040516,
    },

    "Europe of Sovereign Nations Group": {
      name: "Europe of Sovereign Nations Group",
      color: "#19345a",
      code: "ESN",
      short: "ESN",
      wiki: 74785271,
    },

    "Patriots for Europe": {
      name: "Patriots for Europe",
      color: "#253082",
      code: "PFE",
      short: "Patriots for Europe",
      wiki: 77266055,
    },
  };

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.xlsx`);
  }

  private partiesCacheFile(year: string) {
    return path.join(this.cacheDir, `parties-${year}.xlsx`);
  }
  private foundationsCacheFile(year: string) {
    return path.join(this.cacheDir, `foundations-${year}.xlsx`);
  }

  yearExtractors: Record<
    string,
    (year: string, sheets: ReturnType<typeof parse>) => ExtractedYearData[]
  > = {
    "2021": (year, sheets) => {
      const [sheet] = sheets;

      const yearData: ExtractedYearData[] = [];

      let currentParty: string;
      let donationIdx: number | undefined;
      let donations: string[][] = [];

      (sheet.data as any[]).forEach((row, idx) => {
        if (idx < 6) return;

        row = cleanRow(row);

        if (row.length === 1 && row[0].startsWith("Ø ")) {
          currentParty = row[0];
        }

        if (row.length === 1 && row[0] === "Donations") {
          donationIdx = idx;
          return;
        }
        if (donationIdx !== undefined) {
          if (!row.length) return;
          if (row[3] === "Value") return;

          if (row[0] === "Total" || row[1] === "Total") {
            donations.forEach((row, idx) => {
              const [donor, _, country, value] = row as [
                string,
                string,
                string,
                number,
              ];
              yearData.push({
                idx: `${idx}`,
                [DonationField.Amount]: value,
                [DonationField.DonorName]: donor,
                [DonationField.Receiver]: normalizeParty(
                  currentParty,
                ) as ReceiverId,
                [DonationField.Date]: `${year}`,
                [DonationField.Address]: [mapCountry(year, country)],
              });
            });

            donationIdx = undefined;
            donations = [];
            return;
          }

          if (row.length === 4) {
            donations.push(row);
            return;
          }
        }
      });

      return yearData;
    },

    "2022": (year, sheets) => {
      const partySheets = sheets.slice(1);

      const yearData: ExtractedYearData[] = [];

      for (const partySheet of partySheets) {
        const partySheetName = partyIdAlias[partySheet.name] ?? partySheet.name;
        const partyKey = Object.entries(this.parties).find(([name, party]) => {
          return party.code === partySheetName;
        })?.[0];

        if (!partyKey) {
          throw new Error(
            `Unable to find party sheet party: ${partySheet.name} or ${partySheetName}`,
          );
        }

        const partyName: string = partyKey;
        let donorHeaderIdx: number | undefined;
        const donations: string[][] = [];

        (partySheet.data as any[]).forEach((row, idx) => {
          if (row.length === 0) return;

          row = cleanRow(row);

          if (row.length === 3 && row[0] === "Donor") {
            donorHeaderIdx = idx;
            return;
          }
          if (donorHeaderIdx !== undefined) {
            // skip sub total
            if (
              row.length &&
              typeof row[0] === "string" &&
              row[0].startsWith("Sub-Total")
            )
              return;

            if (
              row.length &&
              typeof row[0] === "string" &&
              row[0].startsWith("Total Donations from")
            )
              return;

            if (
              row.length === 3 &&
              ["Total", "Total Donations"].includes(row[0])
            ) {
              // is in donor block
              donorHeaderIdx = undefined;
              donations.forEach(([donor, country, amount], idx) => {
                yearData.push({
                  idx: `${idx}`,
                  [DonationField.DonorName]: donor,
                  [DonationField.Receiver]: partyName as ReceiverId,
                  [DonationField.Date]: `${year}`,
                  [DonationField.Amount]: parseFloat(amount),
                  [DonationField.Address]: {
                    [AddressField.Country]: mapCountry(year, country),
                  },
                });
              });
            } else if (row[0] === "Donor") {
              // is header row
              return;
            } else if (row.length === 3) {
              donations.push(row);
              return;
            }
          }
        });
      }

      return yearData;
    },
    "2023": (year, sheets) => {
      const partySheets = sheets.slice(1);

      const yearData: ExtractedYearData[] = [];

      for (const partySheet of partySheets) {
        const partySheetName = partyIdAlias[partySheet.name] ?? partySheet.name;
        const partyKey = Object.entries(this.parties).find(([name, party]) => {
          return party.code === partySheetName;
        })?.[0];

        if (!partyKey) {
          throw new Error(
            `Unable to find party sheet party: ${partySheet.name} or ${partySheetName}`,
          );
        }

        const partyName: string = partyKey;
        let donorHeaderIdx: number | undefined;
        const donations: string[][] = [];

        (partySheet.data as any[]).forEach((row, idx) => {
          if (row.length === 0) return;

          row = cleanRow(row);

          const firstRowString = typeof row[0] === "string";

          if (
            firstRowString &&
            ((row.length === 3 && row[0].startsWith("Donor")) ||
              (row.length === 1 && row[0] === "Donations"))
          ) {
            donorHeaderIdx = idx;
            return;
          }
          if (donorHeaderIdx !== undefined) {
            // skip sub total
            if (firstRowString && row[0].startsWith("Sub-Total")) return;
            if (
              firstRowString &&
              row[0].startsWith("Donations from Legal Persons")
            )
              return;
            if (firstRowString && row[0].startsWith("Total Donations from"))
              return;
            if (
              row.length === 3 &&
              ["Total", "Total Donations"].includes(row[0])
            ) {
              // is in donor block
              donorHeaderIdx = undefined;
              donations.forEach(([donor, country, amount], idx) => {
                yearData.push({
                  idx: `${idx}`,
                  [DonationField.DonorName]: donor,
                  [DonationField.Receiver]: partyName as ReceiverId,
                  [DonationField.Date]: `${year}`,
                  [DonationField.Amount]: parseFloat(amount),
                  [DonationField.Address]: {
                    [AddressField.Country]: mapCountry(year, country),
                  },
                });
              });
            } else if (firstRowString && row[0].startsWith("Donor")) {
              // is header row
              return;
            } else if (row.length === 3 && firstRowString) {
              donations.push(row);
              return;
            }
          }
        });
      }

      return yearData;
    },
    "2024": (year, sheets) => {
      return this.yearExtractors["2023"](year, sheets);
    },
    "2025": (year, sheets) => {
      const [sheet] = sheets;

      const yearData: ExtractedYearData[] = [];

      let currentParty: string;
      (sheet.data as any[]).forEach((row, idx, rows) => {
        if (idx < 13) return;

        const isPartyLine =
          row.length === 1 &&
          rows[idx + 1].length === 0 &&
          rows[idx + 1].length === 0;

        const isDonationLine = row.length === 3;

        const isPartyHeader =
          row.length === 3 && (row[0] === "Donor " || row[0] === "Contributor");

        if (isPartyHeader) return;

        if (isPartyLine) {
          currentParty = normalizeParty(row[0]);
          return;
        }

        if (isDonationLine) {
          yearData.push({
            idx: `${idx}`,
            [DonationField.Amount]: extractEur(row[2]),
            [DonationField.DonorName]: row[0],
            [DonationField.Receiver]: currentParty as ReceiverId,
            [DonationField.Date]: `${year}`,
            [DonationField.Address]: {
              [AddressField.Country]: mapCountry(year, row[1]),
            },
          });
        }
      });

      return yearData;
    },
  };

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    if (["2021", "2022", "2023", "2024", "2025"].includes(year)) {
      const partySheets = (await exists(this.partiesCacheFile(year)))
        ? parse(this.partiesCacheFile(year), {
            cellDates: true,
          })
        : [{ name: "", data: [] }];
      const foundationSheets = (await exists(this.foundationsCacheFile(year)))
        ? parse(this.foundationsCacheFile(year), {
            cellDates: true,
          })
        : [{ name: "", data: [] }];

      return [
        ...this.yearExtractors[year]
          .call(this, year, partySheets)
          .filter((d) => d[DonationField.Amount] > 0)
          .map((d) => {
            return {
              ...d,
              [DonationField.DonorName]:
                // the 2022 docs were redacted and removed some donor names
                d[DonationField.DonorName] ??
                this.redactDonor(
                  d[DonationField.Address][AddressField.Country],
                ),
              [DonationField.Address]: {
                [AddressField.Country]:
                  d[DonationField.Address][AddressField.Country],
                [AddressField.State]:
                  d[DonationField.Address][AddressField.Country],
              },
            };
          }),
        ...this.yearExtractors[year]
          .call(this, year, foundationSheets)
          .filter((d) => d[DonationField.Amount] > 0)
          .map((d) => {
            return {
              ...d,
              [DonationField.DonorName]:
                // the 2022 docs were redacted and removed some donor names
                d[DonationField.DonorName] ??
                this.redactDonor(
                  d[DonationField.Address][AddressField.Country],
                ),
              [DonationField.Address]: {
                [AddressField.Country]:
                  d[DonationField.Address][AddressField.Country],
                [AddressField.State]:
                  d[DonationField.Address][AddressField.Country],
              },
            };
          }),
      ];
    }

    // Fallbacks that are to annoying to parse. I've manually extracted them into the corresponding module
    if (fromPdfDonations[year]) {
      return [
        ...Object.entries(fromPdfDonations[year].parties),
        ...Object.entries(fromPdfDonations[year].foundations),
      ].flatMap(([party, donations], idx) => {
        const partyName = Object.entries(this.parties).find(
          ([name, partyConfig]) => {
            return partyConfig.code === party;
          },
        )?.[0];

        if (!partyName) {
          throw new Error(`Unable to find party: ${party}`);
        }

        return donations.map(([donor, country, amount]) => ({
          idx: `${idx}`,
          [DonationField.Amount]: ["2018", "2019"].includes(year)
            ? parseFloat(amount.replace(".", "").replace(",", "."))
            : parseFloat(amount.replace(",", "")),
          [DonationField.DonorName]: donor,
          [DonationField.Receiver]: partyName as ReceiverId,
          [DonationField.Date]: `${year}`,
          [DonationField.Address]: {
            [AddressField.Country]: country,
            [AddressField.State]: country,
          },
        }));
      });
    }

    return [];
  }

  yearFiles: Record<string, { parties?: string; foundations?: string }> = {
    "2020": {
      parties:
        "https://www.appf.europa.eu/cmsdata/297637/PARTIES%20Contributions%20and%20donations%20related%20to%20financial%20year%202020%20updated%202023-03-17_Redacted.xlsx",
      foundations:
        "https://www.appf.europa.eu/cmsdata/297635/FOUNDATIONS%20Contributions%20and%20donations%20related%20to%20financial%20year%202020%20updated%202023-03-17_Redacted.xlsx",
    },
    "2021": {
      parties:
        "https://www.appf.europa.eu/cmsdata/297619/PARTIES%20Contributions%20and%20donations%20related%20to%20financial%20year%202021_Redacted.xlsx",
      foundations:
        "https://www.appf.europa.eu/cmsdata/297617/FOUNDATIONS%20Contributions%20and%20donations%20related%20to%20financial%20year%202021_Redacted.xlsx",
    },
    "2022": {
      parties:
        "https://www.appf.europa.eu/cmsdata/297603/European%20Political%20Parties%20Contributions%20and%20Donations%202022_Redacted.xlsx",
      foundations:
        "https://www.appf.europa.eu/cmsdata/297602/European%20Political%20Foundations%20Contributions%20and%20Donations%202022_Redacted.xlsx",
    },
    "2023": {
      parties:
        "https://www.appf.europa.eu/cmsdata/291884/2023%20PARTIES%20Contributions%20and%20Donations.xlsx",
      foundations:
        "https://www.appf.europa.eu/cmsdata/294306/2023%20FOUNDATIONS%20Contributions%20and%20Donations.xlsx",
    },
    "2024": {
      parties:
        "https://www.appf.europa.eu/cmsdata/301299/2024%20PARTIES%20Contributions%20and%20Donations.xlsx",
      foundations:
        "https://www.appf.europa.eu/cmsdata/300387/2024%20FOUNDATIONS%20Contributions%20and%20Donations.xlsx",
    },
    "2025": {
      parties:
        "https://www.appf.europa.eu/cmsdata/302578/2025%20PARTIES%20Donations%20table%20as%20of%202026-02-09.xlsx",
      foundations:
        "https://www.appf.europa.eu/cmsdata/302576/2025%20FOUNDATIONS%20Donations%20table%20as%20of%202026-02-09.xlsx",
    },
  };

  protected override normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    let normalized = super
      .normalizeDonor(donor, address)
      // remove trailing *
      .replace(/\*$/, "");

    // strip the number in quotes
    if (normalized.match(/(\d+)/)) {
      // check each quoted block for more than 4 digits
      normalized = normalized.replace(/(\(.*\))/g, (match) => {
        if (match.replace(/\D/g, "").match(/\d{4}/)) {
          return "";
        }
        return match;
      });

      // normalized = normalized.replace(/\( ?\w*[ \d-:.]+\w?\)/, "").trim();
    }

    if (normalized.startsWith("AT&T Global Network")) {
      return "AT&T Global Network Services";
    }
    if (normalized.startsWith("Google ")) {
      return "Google";
    }
    if (normalized.startsWith("Apple ")) {
      return "Apple";
    }
    if (normalized.startsWith("Microsoft ")) {
      return "Microsoft";
    }
    if (normalized.startsWith("Meta ")) {
      return "Meta";
    }
    if (normalized.startsWith("Facebook ")) {
      return "Facebook";
    }
    if (normalized.startsWith("Deloitte ")) {
      return "Deloitte";
    }
    if (normalized.startsWith("Vodafone ")) {
      return "Vodafone";
    }
    if (normalized.startsWith("Amazon Europe")) {
      return "Amazon";
    }
    if (normalized.startsWith("AbbVie ")) {
      return "AbbVie";
    }
    if (normalized.startsWith("American Chamber of Commerce to the E")) {
      return "American Chamber of Commerce to the EU";
    }
    if (normalized.toLowerCase().startsWith("globsec")) {
      return "GLOBSEC";
    }
    if (
      normalized
        .toLowerCase()
        .replace(/[ \W]/g, "")
        .startsWith("zelenaalternativaodrivi")
    ) {
      return "Zelena alternativa - Održivi razvoj";
    }
    if (normalized.startsWith("Kurdish Institute of Brussels")) {
      return "Kurdish Institute of Brussels";
    }

    if (
      normalized.toLowerCase() === "Régions et Peuples solidaires".toLowerCase()
    ) {
      return "Régions et Peuples solidaires";
    }

    if (
      normalized.endsWith("minor donors") ||
      normalized.endsWith("minor donor")
    ) {
      return "Minor donors";
    }
    if (/Minor Donations? \(\d+\) from Natural Persons/.test(donor)) {
      normalized = "Minor Donations from Natural Persons";
    }

    return normalized;
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const url = this.yearFiles[year];

    if (url.parties) {
      this.log(`loading ${year} parties`);
      const res = await fetch(url.parties);

      if (!res.ok) {
        throw `Unable to load ${url.parties}: ${res.status}`;
      }

      await fs.writeFile(
        this.partiesCacheFile(year),
        Buffer.from(await res.arrayBuffer()),
      );
    }

    if (url.foundations) {
      this.log(`loading ${year} foundations`);
      const resFoundations = await fetch(url.foundations);

      if (!resFoundations.ok) {
        throw `Unable to load ${url.foundations}: ${resFoundations.status}`;
      }

      await fs.writeFile(
        this.foundationsCacheFile(year),
        Buffer.from(await resFoundations.arrayBuffer()),
      );
    }
  }
}

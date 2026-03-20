import type { ReadableStream } from "stream/web";

import { parse } from "csv-parse";
/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
import unzipper from "unzipper";

import type { Countries } from "@/utils/countries";
import type { ExtractedDonationAddress, ReceiverId } from "@/utils/types";

import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { Deferred } from "../util";
import { extractAddress } from "./address";
import { donorMeta } from "./donor-meta";

const normalizeDonor = (donor: string): string => {
  // some donors have trailing commas and spaces, remove them, e.g. "Estate of Thomas Robinson, _"
  return donor.replace(/, _$/, "");
};

export class CaLoader extends DataLoader {
  private loadedOnce = false;
  private extractedOnce = false;

  constructor() {
    super("CA", Country.canada);
  }

  parties: Record<string, PartyConfig> = {
    "Conservative Party of Canada": {
      code: "CPC",
      name: "Conservative Party of Canada",
      short: "Conservative",
      color: "#142F52",
      wiki: 308647,
    },
    "Green Party of Canada": {
      code: "GPC",
      name: "Green Party of Canada",
      short: "Green",
      color: "#20a242",
      wiki: 286271,
    },
    "Bloc Québécois": {
      code: "BQ",
      name: "Bloc Québécois",
      short: "Bloc",
      color: "#0e3b75",
      wiki: 60338,
    },
    "New Democratic Party": {
      code: "NDP",
      name: "New Democratic Party",
      short: "NDP",
      color: "#ef7b00",
      wiki: 19283982,
    },
    "Marxist-Leninist Party of Canada": {
      code: "MLPC",
      name: "Marxist-Leninist Party of Canada",
      short: "MLPC",
      color: "#f51212",
    },
    "Communist Party of Canada": {
      code: "CPCML",
      name: "Communist Party of Canada (Marxist-Leninist)",
      short: "Communist Party of Canada",
      color: "#f51213",
      wiki: 39607058,
    },
    "Marijuana Party": {
      code: "MJP",
      name: "Marijuana Party",
      short: "Marijuana Party",
      color: "#907430",
      wiki: 383537,
    },
    "Liberal Party of Canada": {
      code: "LPC",
      name: "Liberal Party of Canada",
      short: "Liberal",
      color: "#d91920",
      wiki: 149536,
    },
    "Canadian Action Party": {
      code: "CAP",
      name: "Canadian Action Party",
      short: "Canadian Action Party",
      color: "#ff0000",
      wiki: 383530,
    },
    "Christian Heritage Party of Canada": {
      code: "CHP",
      name: "Christian Heritage Party of Canada",
      short: "Christian Heritage",
      color: "#480D2B",
      wiki: 457907,
    },
    "Libertarian Party of Canada": {
      code: "LIBETARIAN",
      name: "Libertarian Party of Canada",
      short: "Libertarian",
      color: "#f2bb00",
      wiki: 476593,
    },
    "Progressive Canadian Party": {
      code: "PCP",
      name: "Progressive Canadian Party",
      short: "Progressive Canadian",
      color: "#002ba2",
      wiki: 562959,
    },
    "Animal Protection Party of Canada": {
      code: "APPC",
      name: "Animal Protection Party of Canada",
      short: "Animal Protection Party of Canada",
      color: "#0a492b",
      wiki: 2418729,
    },
    "First Peoples National Party of Canada": {
      code: "FPNPC",
      name: "First Peoples National Party of Canada",
      short: "First Peoples National Party",
      color: "#ff311c",
      wiki: 3342971,
    },
    "Western Block Party": {
      code: "WBP",
      name: "Western Block Party",
      short: "Western Block",
      color: "#111111",
      wiki: 1607216,
    },
    "Parti Rhinocéros Party": {
      code: "PRP",
      name: "Parti Rhinocéros Party",
      short: "Parti Rhinocéros Party",
      color: "#ef3e42",
      wiki: 12830268,
    },
    "People's Political Power Party of Canada": {
      code: "PPP",
      name: "People's Political Power Party of Canada",
      short: "People's Political Power",
      color: "#cc0000",
      wiki: 5158812,
    },
    "Maverick Party": {
      code: "MAVERICK",
      name: "Maverick Party",
      short: "Maverick",
      color: "#6cbd45",
      wiki: 62813558,
    },
    "Pirate Party of Canada": {
      code: "PPCA",
      name: "Pirate Party of Canada",
      short: "Pirate Party",
      color: "#000000",
      wiki: 26711820,
    },
    "United Party of Canada": {
      code: "UPC",
      name: "United Party of Canada",
      short: "United Party",
      color: "#E4002B",
    },
    "Centrist Party of Canada": {
      code: "CP",
      name: "Centrist Party of Canada",
      short: "Centrist Party",
      color: "#092246",
    },
    "Party for Accountability, Competency and Transparency": {
      code: "PACT",
      name: "Party for Accountability, Competency and Transparency",
      short: "PACT",
      color: "#cc2d02",
      wiki: 31836838,
    },
    "Forces et Démocratie": {
      code: "FED",
      name: "Forces et Démocratie",
      short: "Forces et Démocratie",
      color: "#5bb881",
      wiki: 44174200,
    },
    "National Advancement Party of Canada": {
      code: "NAPC",
      name: "National Advancement Party of Canada",
      short: "National Advancement Party",
      color: "#872c3b",
    },
    "Alliance of the North": {
      code: "AN",
      name: "Alliance of the North",
      short: "Alliance of the North",
      color: "#336601",
      wiki: 48202107,
    },
    "People's Party of Canada": {
      code: "PPC",
      name: "People's Party of Canada",
      short: "People's Party",
      color: "#673499",
      wiki: 58484250,
    },
    "National Citizens Alliance of Canada": {
      code: "NCA",
      name: "National Citizens Alliance of Canada",
      short: "National Citizens Alliance",
      color: "#ff0001",
      wiki: 53227433,
    },
    "Direct Democracy Party of Canada": {
      code: "DDP",
      name: "Direct Democracy Party of Canada",
      short: "Direct Democracy",
      color: "#d10000",
    },
    "Parti pour l'Indépendance du Québec": {
      code: "PIQ",
      name: "Parti pour l'Indépendance du Québec",
      short: "Parti pour l'Indépendance du Québec",
      color: "#d9ab00",
    },
    "Veterans Coalition Party of Canada": {
      code: "VCP",
      name: "Veterans Coalition Party of Canada",
      short: "Veterans Coalition Party",
      color: "#e2b13c",
      wiki: 68805115,
    },
    "Free Party Canada": {
      code: "FPC",
      name: "Free Party Canada",
      short: "Free Party Canada",
      color: "#e68f1a",
      wiki: 68787338,
    },
    "United Party of Canada (UP)": {
      code: "UP",
      name: "United Party of Canada (UP)",
      short: "United Party (UP)",
      color: "#044C7C",
    },
  };

  donorMeta = donorMeta;

  cacheFile() {
    return path.join(this.cacheDir, `donations.zip`);
  }

  async loadYearDataToCache(): Promise<void> {
    if (this.loadedOnce) {
      this.log(
        "Skipping year data load, already ran and loaded everything at once",
      );
      return;
    }

    this.loadedOnce = true;

    const url = "https://www.elections.ca/fin/oda/od_cntrbtn_de_e.zip";
    this.log(`Loading year data from ${url}`);
    const res = await fetch(url);

    if (!res.ok || !res.body) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    await finished(
      Readable.fromWeb(res.body as unknown as ReadableStream<Uint8Array>).pipe(
        fs.createWriteStream(this.cacheFile()),
      ),
    );
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    if (this.extractedOnce) {
      this.log(
        "Skipping year data extraction, already ran and loaded everything at once",
      );
      return [];
    }

    this.extractedOnce = true;

    const csvInZipStream = fs
      .createReadStream(this.cacheFile())
      .pipe(unzipper.ParseOne());

    const parser = parse({
      delimiter: ",",
      fromLine: 2, // Skip the header line
      relax_column_count: true,
    });

    const deferred = new Deferred<ExtractedYearData[]>();
    const records: ExtractedYearData[] = [];

    parser.on("end", function () {
      console.log("got donations", records.length);
      deferred.resolve(records);
    });

    // Use the readable stream api to consume records
    parser.on("readable", () => {
      let record: unknown;
      while ((record = parser.read()) !== null) {
        if (!record) continue;

        const [
          entity,
          recipientId,
          recipient,
          recipientLastName,
          recipientFirstName,
          recipientMiddleInitial,
          politicalPartyOfRecipient,
          electoralDistrict,
          electoralEvent,
          fiscalElectionDate,
          formId,
          financialReport,
          partyNumberOfReturn,
          financialReportPart,
          contributorType,
          contributorName,
          contributorLastName,
          contributorFirstName,
          contributorMiddleInitial,
          contributorCity,
          contributorProvince,
          contributorPostalCode,
          contributionReceivedDate,
          monetaryAmount,
          nonMonetaryAmount,
          contributionGivenThrought,
          leadershipContestant,
        ] = record as string[];
        if (entity.trim() !== "Registered parties") continue;
        if (
          financialReportPart.trim() !== "Statement of Contributions Received"
        )
          continue;

        // Skip records that are not for the annual electoral event
        if (electoralEvent !== "Annual") continue;

        const amount = parseFloat(monetaryAmount.trim());

        let date = contributionReceivedDate;

        if (date.startsWith("2049")) {
          date = `2019${date.substring(4)}`; // Fix the date for 2049 to 2019
        }

        if (date.slice(0, 4) < this.minimumProcessedYear) {
          // Skip donations before the minimum processed year
          continue;
        }

        if (!(contributorPostalCode || contributorProvince)) {
          this.log(
            "Missing contributor province|zip in record: " +
              contributorName +
              " " +
              JSON.stringify(record, null, " "),
          );
        }

        const address = !(contributorPostalCode || contributorProvince)
          ? { [AddressField.Country]: "CA" as Countries }
          : extractAddress(
              contributorPostalCode,
              contributorProvince,
              contributorCity,
            );

        records.push({
          idx: `${records.length}`,
          [DonationField.DonorName]: normalizeDonor(contributorName),
          [DonationField.Receiver]: recipient as ReceiverId,
          [DonationField.Date]: date,
          [DonationField.Amount]: amount,
          [DonationField.Address]: address,
        });
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
  }

  protected normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    const normalized = super.normalizeDonor(donor, address);

    if (normalized.startsWith("Stronach, Belinda")) {
      return "Stronach, Belinda";
    }

    return normalized;
  }
}

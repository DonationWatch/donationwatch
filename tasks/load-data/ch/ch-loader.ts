/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from "fs/promises";
import { parse } from "node-xlsx";
import path from "path";

import type { DonationAddress, ReceiverId } from "@/utils/types";

import { isNotNullandNotUndefined } from "@/utils/array";
import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";

export class ChLoader extends DataLoader {
  constructor() {
    super("CH", Country.switzerland);
  }

  parties: Record<string, PartyConfig> = {
    "Schweizerische Volkspartei": {
      color: "#009f4f",
      code: "SVP",
      short: "SVP Schweiz",
      name: "Schweizerische Volkspartei",
      wiki: 29952,
    },
    "FDP.Die Liberalen": {
      color: "#0e52a0",
      code: "FDP",
      short: "FDP Schweiz",
      name: "FDP.Die Liberalen",
      wiki: 4271266,
    },
    "Die Mitte": {
      color: "#ff9b00",
      code: "MITTE",
      short: "Die Mitte",
      name: "Die Mitte",
      wiki: 3118917,
    },
    "GRÜNE Schweiz": {
      color: "#84b414",
      code: "GRUENE",
      short: "GRÜNE Schweiz",
      name: "GRÜNE Schweiz",
      wiki: 159403,
    },
    "Grünliberale Partei": {
      color: "#004b32",
      code: "GLP",
      short: "GLP",
      name: "Grünliberale Partei Schweiz",
      wiki: 1065752,
    },
    "Sozialdemokratische Partei der Schweiz": {
      color: "#e4002b",
      code: "SP",
      short: "SP",
      name: "Sozialdemokratische Partei der Schweiz",
      wiki: 86495,
    },
    "Eidgenössisch-Demokratische Union": {
      color: "#e20613",
      code: "EDU",
      short: "EDU",
      name: "Eidgenössisch-Demokratische Union",
      wiki: 364818,
    },
    "Evangelische Volkspartei der Schweiz": {
      color: "#ffed00",
      code: "EVP",
      short: "EVP",
      name: "Evangelische Volkspartei der Schweiz",
      wiki: 34763,
    },
    "Übrige politische Parteien": {
      color: "#9ca3af",
      code: "OTHER",
      short: "Übrige politische Parteien",
      name: "Übrige politische Parteien",
    },
    Unabhängig: {
      color: "#a78bfa",
      code: "INDEPENDENT",
      short: "Unabhängig",
      name: "Unabhängig",
    },
  };

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.xlsx`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowFields(row: any[]) {
    const [
      offenlegungslauf,
      exportdate,
      date,
      akteur,
      akteurType,
      campaign,
      campaignFor,
      name,
      firstname,
      kandidierendeGruppierung,
      kanton,
      parteizugehoerigkeit,
      offenlegungsmeldung,
      anonymeZuwendung,
      urheberZuwendungName,
      urheberZuwendungFirstname,
      wohnsitz,
      land,
      auslandSchweizer,
      urheberZuwendungFirma,
      gemeindeGeschaeftssitz,
      zuwendungsType,
      leistungsType,
      beschreibungLeistung,
      wert,
      gewaehrungsDatumZuwendung,
    ] = row;

    return {
      offenlegungslauf,
      exportdate,
      date,
      akteur,
      akteurType,
      campaign,
      campaignFor,
      name,
      firstname,
      kandidierendeGruppierung,
      kanton,
      parteizugehoerigkeit,
      offenlegungsmeldung,
      anonymeZuwendung,
      urheberZuwendungName,
      urheberZuwendungFirstname,
      wohnsitz,
      land,
      auslandSchweizer,
      urheberZuwendungFirma,
      gemeindeGeschaeftssitz,
      zuwendungsType,
      leistungsType,
      beschreibungLeistung,
      wert,
      gewaehrungsDatumZuwendung,
    };
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const [gesamteinnahmenSheet, zuwendungenSheet] = parse(
      this.cacheFile(year),
      {
        cellDates: true,
      },
    );

    return zuwendungenSheet.data
      .map((row, idx, rows) => {
        if (idx === 0) return;

        const {
          offenlegungslauf,
          exportdate,
          date,
          akteur,
          akteurType,
          campaign,
          campaignFor,
          name,
          firstname,
          kandidierendeGruppierung,
          kanton,
          parteizugehoerigkeit,
          offenlegungsmeldung,
          anonymeZuwendung,
          urheberZuwendungName,
          urheberZuwendungFirstname,
          wohnsitz,
          land,
          auslandSchweizer,
          urheberZuwendungFirma,
          gemeindeGeschaeftssitz,
          zuwendungsType,
          leistungsType,
          beschreibungLeistung,
          wert,
          gewaehrungsDatumZuwendung,
        } = this.rowFields(row);

        if (zuwendungsType !== "Monetär") return;

        // check if is duplicate
        const prevRow = rows[idx - 1];
        if (prevRow) {
          const {
            campaign: prevCampaign,
            wert: prevWert,
            gewaehrungsDatumZuwendung: prevGewaehrungsDatumZuwendung,
            parteizugehoerigkeit: prevParteizugehoerigkeit,
          } = this.rowFields(prevRow);

          if (
            campaign === prevCampaign &&
            wert === prevWert &&
            gewaehrungsDatumZuwendung === prevGewaehrungsDatumZuwendung &&
            parteizugehoerigkeit === prevParteizugehoerigkeit
          )
            return;
        }

        const [day, month, year] = gewaehrungsDatumZuwendung.split(".");
        const donor: string | undefined = urheberZuwendungFirma
          ? urheberZuwendungFirma
          : urheberZuwendungName || urheberZuwendungFirstname
            ? [urheberZuwendungFirstname, urheberZuwendungName]
                .filter(Boolean)
                .join(" ")
            : undefined;

        if (!donor) return;

        return {
          id: "",
          idx: `r${idx}`,
          [DonationField.Receiver]: parteizugehoerigkeit as ReceiverId,
          [DonationField.Amount]: parseFloat(wert),
          [DonationField.Date]: this.normalizeIsoDate(
            `${year}-${month}-${day}`,
          ),
          [DonationField.Address]: {
            [AddressField.Country]: "CH",
          } as DonationAddress,
          [DonationField.DonorName]: donor,
        };
      })
      .filter(isNotNullandNotUndefined);
  }

  async loadYearDataToCache(year: string): Promise<void> {
    if (year !== "2023") {
      this.log("CH doesn't support data outside of 2023");
      return;
    }

    const url =
      "https://politikfinanzierung.efk.admin.ch/api/frontend/latest/de/downloads/financings/1?with_budget=false";

    const res = await fetch(url);

    if (!res.ok) {
      throw `Unable to load ${url}: ${res.status}`;
    }

    const resBuf = await res.arrayBuffer();

    await fs.writeFile(this.cacheFile(year), Buffer.from(resBuf));
  }
}

import fs from "fs/promises";
import path from "path";

import { donorMeta } from "./donor-meta";
import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";
import { DataLoader } from "../data-loader";

import type { ReceiverId } from "../../../src/utils/types";
import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { isNotNullandNotUndefined } from "@/utils/array";

export interface EeDonation {
  date: string;
  receipt_category: string;
  name: string;
  birthdate: string;
  amount: number;
  party: string;
}

const normalizeName = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
};

const toIsoDate = (date: string): string => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export class EeLoader extends DataLoader {
  constructor() {
    super("EE", Country.estonia);
  }

  parties: Record<string, PartyConfig> = {
    "Sotsiaaldemokraatlik Erakond": {
      color: "#e10600",
      name: "Sotsiaaldemokraatlik Erakond",
      code: "SDE",
      short: "SDE",
      wiki: 793508,
    },
    "Eesti Reformierakond": {
      color: "#ffe200",
      name: "Eesti Reformierakond",
      code: "RE",
      short: "RE",
      wiki: 424689,
    },
    "Eesti Konservatiivne Rahvaerakond": {
      color: "#0063af",
      name: "Eesti Konservatiivne Rahvaerakond",
      code: "EKRE",
      short: "EKRE",
      wiki: 38453075,
    },
    "ISAMAA Erakond": {
      color: "#009ce2",
      name: "Isamaa Erakond",
      code: "ISAMAA",
      short: "ISAMAA",
      wiki: 5421394,
    },
    "Eesti Keskerakond": {
      color: "#197d63",
      name: "Eesti Keskerakond",
      code: "EK",
      short: "EK",
      wiki: 379555,
    },
    "Erakond Eesti 200": {
      color: "#2f2a95",
      name: "Eesti 200",
      code: "E200",
      short: "E200",
    },
    "Erakond Eestimaa Rohelised": {
      color: "#004438",
      name: "Eestimaa Rohelised",
      code: "EER",
      short: "EER",
      wiki: 7413932,
    },
    "Erakond Parempoolsed": {
      color: "#FF6100",
      name: "Parempoolsed",
      code: "EPP",
      short: "Parempoolsed",
      wiki: 71550707,
    },
    "EESTIMAA ÜHENDATUD VASAKPARTEI": {
      color: "#78003d",
      name: "Eestimaa Ühendatud Vasakpartei",
      code: "EUEVP",
      short: "EÜVP",
      wiki: 18700145,
    },
    "KOOS organisatsioon osutab suveräänsusele": {
      color: "#005baa",
      name: "KOOS organisatsioon osutab suveräänsusele",
      code: "KOOS",
      short: "Koos",
      wiki: 73170344,
    },
    "Eesti Iseseisvuspartei": {
      color: "#0080cc",
      name: "Eesti Iseseisvuspartei",
      code: "EIP",
      short: "EIP",
      wiki: 1857725,
    },
    "Eesti Vabaerakond": {
      color: "#0086cf",
      name: "Eesti Vabaerakond",
      code: "VABAERAKOND",
      short: "Vabaerakond",
      wiki: 45492661,
    },
    "Rahva Ühtsuse Erakond": {
      color: "#d7b56d",
      name: "Rahva Ühtsuse Erakond",
      code: "RUE",
      short: "RÜE",
      wiki: 74636180,
    },
    "Erakond Rahva Tahe": {
      color: "#ef6b01",
      name: "Erakond Rahva Tahe",
      code: "RAHVATAHE",
      short: "Rahva Tahe",
    },
    "Elurikkuse Erakond": {
      color: "#ffe344",
      name: "Elurikkuse Erakond",
      code: "ELURIKKUSE",
      short: "Elurikkuse",
      wiki: 59563397,
    },
    "Vabaerakond Aru Pähe": {
      name: "Vabaerakond Aru Pähe",
      code: "TULE",
      short: "TULE",
      color: "#0085ce",
      wiki: 65551587,
    },
    "Eesti Rahvuslased ja Konservatiivid": {
      name: "Eesti Rahvuslased ja Konservatiivid",
      code: "ERK",
      short: "ERK",
      color: "#c9a218",
      wiki: 77163029,
    },
    "Eesti Vasakliit": {
      name: "Eesti Vasakliit",
      code: "VL",
      short: "Vasakliit",
      wiki: 18700145,
      color: "#fe0000",
    },
  };

  donorMeta = donorMeta;

  cacheFile(year: string) {
    return path.join(this.cacheDir, `donations-${year}.json`);
  }

  private async fetchErjkApi<T>(endpoint: string): Promise<T> {
    const url = `https://erjk.ee/api/${endpoint}`;
    this.log("Fetching", url);
    const res = await fetch(url);
    // Don't overload EE api
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1000),
    );
    return await res.json();
  }

  protected override normalizeReceiver(party: string): string {
    if (party === "Eesti Tulevikuerakond") {
      return "Vabaerakond Aru Pähe";
    }

    if (party.startsWith("Eesti Vasakliit")) {
      return "Eesti Vasakliit";
    }

    if (party.includes("Eesti Konservatiivne Rahvaerakond")) {
      return "Eesti Konservatiivne Rahvaerakond";
    }

    return party;
  }

  async loadYearDataToCache(year: string): Promise<void> {
    const donations: EeDonation[] = [];

    this.log("Fetching parties");
    const parties = await this.fetchErjkApi<
      { party_id: number; party_name: string }[]
    >("quarterly-reports/parties");

    for (const party of parties) {
      this.log("Fetching quarters for party", party.party_name);
      const quarters = await this.fetchErjkApi<
        {
          report_id: number;
          report_date: string;
        }[]
      >(`quarterly-reports/quarters/${party.party_id}`);

      for (const quarter of quarters.filter((q) =>
        q.report_date.startsWith(year),
      )) {
        this.log(
          "Fetching party receipts for quarter",
          party.party_name,
          quarter.report_date,
        );
        const receipts = await this.fetchErjkApi<
          {
            date: string;
            receipt_category: string;
            name: string;
            birthdate: string;
            amount: number;
          }[]
        >(`quarterly-reports/${quarter.report_id}?report_type=receipts`);

        receipts.forEach((receipt) => {
          if (receipt.receipt_category !== "Rahaline annetus") return;

          donations.push({
            ...receipt,
            party: party.party_name,
          });
        });
      }
    }

    await fs.writeFile(
      this.cacheFile(year),
      JSON.stringify(donations, null, " "),
      {
        encoding: "utf8",
      },
    );
  }

  public transformRawDonation(
    recipe: EeDonation,
    idx: number,
  ): ExtractedYearData | undefined {
    return {
      idx: `r${idx}`,
      [DonationField.Amount]: recipe.amount,
      [DonationField.DonorName]: normalizeName(recipe.name),
      [DonationField.Date]: this.normalizeIsoDate(toIsoDate(recipe.date)),
      [DonationField.Address]: { [AddressField.Country]: "EE" },
      [DonationField.Receiver]: recipe.party as ReceiverId,
    };
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const recipes = JSON.parse(await this.cachedYearData(year)) as EeDonation[];

    return recipes
      .map((recipe, idx) => this.transformRawDonation(recipe, idx))
      .filter(isNotNullandNotUndefined);
  }
}

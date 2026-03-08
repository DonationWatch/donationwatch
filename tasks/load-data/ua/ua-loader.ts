import fs from "fs/promises";
import path from "path";

import { Country } from "../../../src/utils/countries";
import { AddressField, DonationField } from "../../../src/utils/types";
import { DataLoader } from "../data-loader";
import { donorMeta } from "./donor-meta";
import { timeout } from "../util";

import type { Countries } from "../../../src/utils/countries";
import type {
  ExtractedDonationAddress,
  ReceiverId,
} from "../../../src/utils/types";
import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { isNotNullandNotUndefined } from "@/utils/array";

interface AddressModel {
  country: "Україна";
  post_index: null;
  region: null;
  district: null;
  city: null;
  street: null;
  building: null;
  apartments: null;
  common: null;
  building_part_num: null;
  address_uk: null;
  address_en: null;
}

interface PartyModel {
  id: string;
  parent: PartyModel;
  is_active: boolean;
  code: string;
  name: string;
  web_site_url: string | null;
  register_address: AddressModel;
  actual_address: AddressModel;
  actual_address_same_register: boolean;
}

interface PartyReportModel {
  id: string;
  schema_version: number;
  report_type: string;
  year: number;
  quarter: number;
  party_id: string;
  is_party_office: boolean;
  signed_date: string;
  created_date: string;
  signatory_id: string;
  special_status: null;
}

interface PaymentReportModel {
  id: string;
  report_id: string;
  group_code: string;
  payment_type: string | null;
  payment_code: string | null;
  payment_number: string | null;
  payment_amount: number;
  payment_currency: string | null;
  payment_reason: string | null;
  payment_purpose: string | null;
  payment_operation_date: string; // ISO Date string (YYYY-MM-DD)
  payment_instruction_date: string | null;
  payment_description: string | null;
  refund_date: string | null;
  refund_amount: number | null;
  refund_budget_amount: number | null;
  refund_reason: string | null;
  refund_purpose: string | null;
  refund_description: string | null;
  payer_type: string;
  payer_name: string;
  payer_code: string;
  payer_birthday: string;
  payer_address: string;
  payer_account_type: string | null;
  payer_account_iban: string | null;
  payer_bank_code: string | null;
  payer_bank_name: string | null;
  payer_bank_address: string | null;
  receiver_type: string | null;
  receiver_name: string | null;
  receiver_code: string | null;
  receiver_birthday: string | null;
  receiver_address: string | null;
  receiver_account_type: string | null;
  receiver_account_iban: string;
  receiver_bank_code: string | null;
  receiver_bank_name: string;
  receiver_bank_address: string | null;
  created_at: string; // Timestamp string
  updated_at: string | null;
}

let codeCounter = 0;
const IGNORE_CODE = () => `OVERWRITE_WITH_UPSTREAM_ID_${codeCounter++}`;

export class UaLoader extends DataLoader {
  parties: Record<string, PartyConfig> = {
    "БЛОК КЕРНЕСА – УСПІШНИЙ ХАРКІВ!": {
      name: "Блок Кернеса — Успішний Харків",
      short: "Блок Кернеса — Успішний Харків",
      code: IGNORE_CODE(),
      wiki: 67981225,
      color: "#1B4382",
    },
    "УДАР (УКРАЇНСЬКИЙ ДЕМОКРАТИЧНИЙ АЛЬЯНС ЗА РЕФОРМИ) ВІТАЛІЯ КЛИЧКА": {
      name: "УДАР (Український Демократичний Альянс за Реформи) Віталія Кличка",
      short: "УДАР Віталія Кличка",
      code: IGNORE_CODE(),
      color: "#CD0000",
      wiki: 17975055,
    },
    "РАДИКАЛЬНА ПАРТІЯ ОЛЕГА ЛЯШКА": {
      name: "Радикальна партія Олега Ляшка",
      short: "Радикальна партія Олега Ляшка",
      code: IGNORE_CODE(),
      color: "#f3534d",
      wiki: 37654687,
    },
    "УКРАЇНСЬКЕ ОБ'ЄДНАННЯ ПАТРІОТІВ - УКРОП": {
      name: "Українське об'єднання патріотів — УКРОП",
      short: "УКРОП",
      code: IGNORE_CODE(),
      color: "#0baf4d",
      wiki: 47365175,
    },
    'КОМАНДА ІГОРЯ САПОЖКА – "ЄДНІСТЬ': {
      name: 'КОМАНДА ІГОРЯ САПОЖКА - "ЄДНІСТЬ"',
      short: 'КОМАНДА ІГОРЯ САПОЖКА - "ЄДНІСТЬ"',
      code: IGNORE_CODE(),
      color: "#592862",
    },
    "ПАРТІЯ МИРУ ТА РОЗВИТКУ": {
      name: "Партія миру та розвитку",
      short: "Партія миру та розвитку",
      code: IGNORE_CODE(),
      color: "#2d3b8a",
    },
    ГАРАНТ: {
      name: "Гарант",
      short: "Гарант",
      code: IGNORE_CODE(),
      color: "#d7c449",
    },
  };
  private loadedOnce = false;
  private extractedOnce = false;

  donorMeta = donorMeta;

  constructor() {
    super("UA", Country.ukraine);
  }

  cacheFile() {
    return path.join(this.cacheDir, `donations.json`);
  }

  async loadYearDataToCache(): Promise<void> {
    if (this.loadedOnce) {
      this.log(
        "Skipping year data load, already ran and loaded everything at once",
      );
      return;
    }

    this.loadedOnce = true;

    const API_BASE = "https://politdata.nazk.gov.ua/api/v2";
    const partiesListUrl = `${API_BASE}/parties`;
    // const partiesListCacheFile = path.join(this.cacheDir, `parties-list.json`);

    this.log("Fetching", partiesListUrl);

    // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

    let hasListItems = true;
    const partiesList: PartyModel[] = [];
    while (hasListItems) {
      this.log(`Fetching parties list, current count: ${partiesList.length}`);
      const res = await fetch(partiesListUrl, {
        method: "POST",
        // set payload
        body: JSON.stringify({
          filters: null,
          order: null,
          pager: { page: 1, size: 10 },
        }),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to fetch parties list: ${res.status} ${res.statusText}`,
        );
      }

      const json: { results: { count: number; list: PartyModel[] } } =
        await res.json();

      partiesList.push(...json.results.list);
      hasListItems =
        partiesList.length < json.results.count && json.results.list.length > 0;

      await timeout(1000);
    }

    // await fs.writeFile(
    //   partiesListCacheFile,
    //   JSON.stringify(partiesList, null, " "),
    //   {
    //     encoding: "utf8",
    //   },
    // );

    const partiesResultList = partiesList;
    // const partiesResultList = JSON.parse(
    //   await fs.readFile(partiesListCacheFile, "utf-8"),
    // ) as PartyModel[];

    const partyReports: {
      party: PartyModel;
      reports: PaymentReportModel[];
    }[] = [];

    for (const party of partiesResultList) {
      // fetch party reports
      const reportFileName = path.join(
        this.cacheDir,
        `${party.id}-reports.json`,
      );

      const partyUrl = `${API_BASE}/party/${party.id}/reports`;
      this.log(`Fetching party reports for ${party.name}: ${partyUrl}`);
      await timeout(1000);
      const res = await fetch(partyUrl, {
        method: "POST",
      });

      if (!res.ok) {
        this.log(
          `Failed to fetch party reports for ${party.name}: ${res.status} ${res.statusText}`,
        );
        continue;
      }

      const json = (await res.json()) as {
        results: { list: PartyReportModel[] };
      };
      await fs.writeFile(reportFileName, JSON.stringify(json, null, " "), {
        encoding: "utf8",
      });
    }

    // fetch payments for each report of each party
    for (const party of partiesResultList) {
      const reportFileName = path.join(
        this.cacheDir,
        `${party.id}-reports.json`,
      );
      const reports = JSON.parse(
        await fs.readFile(reportFileName, "utf-8"),
      ) as { results: { list: PartyReportModel[] } };

      const yearReports = reports.results.list;

      const reportPayments: PaymentReportModel[] = [];

      for (const report of yearReports) {
        const paymentsUrl = `${API_BASE}/party/report/${report.id}/payments/monetary_contributions`;
        await timeout(1000);
        const res = await fetch(paymentsUrl, {
          method: "POST",
        });

        if (!res.ok) {
          this.log(
            `Failed to fetch payments for report ${report.id} of party ${party.name}: ${res.status} ${res.statusText}`,
          );
          continue;
        }

        const json = (await res.json()) as {
          results: { list: PaymentReportModel[] };
        };

        if (!json.results.list.length) {
          this.log(
            `No payments found for report ${report.id} of party ${party.name}, skipping...`,
          );
          continue;
        }

        reportPayments.push(...json.results.list);
      }

      if (reportPayments.length === 0) {
        this.log(`No payments found for party ${party.name}, skipping...`);
        continue;
      }

      partyReports.push({
        party,
        reports: reportPayments,
      });
    }

    // write party reports to cache
    await fs.writeFile(
      this.cacheFile(),
      JSON.stringify(partyReports, null, " "),
      { encoding: "utf8" },
    );
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    if (this.extractedOnce) {
      this.log(
        "Skipping year data extraction, already ran and extracted everything at once",
      );
      return [];
    }

    this.extractedOnce = true;

    const json: {
      party: PartyModel;
      reports: PaymentReportModel[];
    }[] = JSON.parse(await this.cachedYearData(year));

    const foundReports = new Set<string>();

    return json
      .filter((doc) => doc.reports.length > 0)
      .flatMap((doc, pidx) => {
        const partyName = this.normalizeReceiver(doc.party.name);

        {
          this.parties[partyName] = {
            ...{
              name: partyName,
              short: partyName,
              color: ("#" +
                Math.floor(Math.random() * 16777215)
                  .toString(16)
                  .padStart(6, "0")) as `#${string}`,
            },
            ...this.parties[partyName],
            // patch our party code with the upstream id
            ...{ code: doc.party.id },
          };
        }

        return doc.reports
          .map((report, idx) => {
            if (foundReports.has(report.id)) {
              this.log(
                `skipping duplicate report with id ${report.id} for party ${partyName}`,
              );
              return;
            }

            foundReports.add(report.id);

            return {
              idx: `${pidx}-${idx}`,
              [DonationField.Date]: this.normalizeIsoDate(
                report.payment_operation_date,
              ),
              [DonationField.Receiver]: partyName as ReceiverId,
              [DonationField.Amount]: report.payment_amount,
              [DonationField.DonorName]: report.payer_name,
              [DonationField.Address]: {
                [AddressField.Country]: "UA" as Countries,
              },
            };
          })
          .filter(isNotNullandNotUndefined);
      });
  }

  protected override normalizeReceiver(receiver: string) {
    const normalized = super
      .normalizeReceiver(receiver)
      // remove "ПОЛІТИЧНА ПАРТІЯ " from the beginning of the receiver name
      .replace("ПОЛІТИЧНА ПАРТІЯ ", "")
      // remove wrapping "
      .replace(/^"(.*)"$/, "$1")
      // remove wrapping «»
      .replace(/^«(.*)»$/, "$1");

    return normalized;
  }

  protected override normalizeDonor(
    donor: string,
    _address: ExtractedDonationAddress,
  ): string {
    const normalized = super.normalizeDonor(donor, _address);

    return normalized;
  }
}

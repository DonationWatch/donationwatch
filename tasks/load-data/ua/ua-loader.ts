import fs, { constants } from "fs/promises";
import path from "path";

import type { Countries } from "@/utils/countries";
import type { ReceiverId } from "@/utils/types";

import { isNotNullandNotUndefined } from "@/utils/array";
import { Country } from "@/utils/countries";
import { AddressField, DonationField } from "@/utils/types";

import type { ExtractedYearData, PartyConfig } from "../data-loader";

import { DataLoader } from "../data-loader";
import { RANDOM_COLOR_MARKER, timeout } from "../util";
import { donorMeta } from "./donor-meta";

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

// util for parallel execution with concurrency limit
const inParallel = async <T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = [];
  const chunks = [];
  for (let i = 0; i < items.length; i += concurrency) {
    chunks.push(items.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map(fn));
    results.push(...chunkResults);
    await timeout(500); // small delay between chunks
  }
  return results;
};

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
    "ЗА МАЙБУТНЄ": {
      name: "За майбутнє",
      short: "За майбутнє",
      wiki: 37165794,
      code: IGNORE_CODE(),
      color: "#5c068c",
    },
    "НАШ КРАЙ": {
      name: "Наш край",
      short: "Наш край",
      color: "#005cb9",
      wiki: 47995770,
      code: IGNORE_CODE(),
    },
    БДЖОЛА: {
      name: "Бджола",
      short: "Бджола",
      color: "#F4821F",
      code: IGNORE_CODE(),
    },
    "УКРАЇНСЬКА СТРАТЕГІЯ ГРОЙСМАНА": {
      name: "Українська Стратегія Гройсмана",
      short: "Українська Стратегія Гройсмана",
      wiki: 64192738,
      color: "#134478",
      code: IGNORE_CODE(),
    },
    "УКРАЇНСЬКА ГАЛИЦЬКА ПАРТІЯ": {
      name: "Украї́нська Га́лицька па́ртія",
      short: "Украї́нська Га́лицька па́ртія",
      color: "#0c519e",
      wiki: 66114674,
      code: IGNORE_CODE(),
    },
    НАРОДОВЛАДДЯ: {
      name: "Народовладдя",
      short: "Народовладдя",
      color: "#000000",
      code: IGNORE_CODE(),
    },
    "АГРАРНА ПАРТІЯ УКРАЇНИ": {
      name: "Агра́рна па́ртія Украї́ни",
      short: "Агра́рна па́ртія Украї́ни",
      wiki: 3734325,
      color: "#86c041",
      code: IGNORE_CODE(),
    },
    "Політична партія «НАРОДНИЙ ФРОНТ»": {
      name: "Народний фронт",
      short: "Народний фронт",
      wiki: 43789446,
      color: "#24609b",
      code: IGNORE_CODE(),
    },
    "СИЛА НАЦІЇ": {
      name: "Сила Нації",
      short: "Сила Нації",
      color: "#085A8A",
      code: IGNORE_CODE(),
    },
    "СИЛА ЛЮДЕЙ": {
      name: "Сила людей",
      short: "Сила людей",
      color: "#3face2",
      code: IGNORE_CODE(),
    },
    "РЕСПУБЛІКАНСЬКА ПЛАТФОРМА": {
      name: "Республіканська платформа",
      short: "Республіканська платформа",
      wiki: 2016410,
      color: "#0066ff",
      code: IGNORE_CODE(),
    },
    "ПАРТІЯ ІГОРЯ КОЛИХАЄВА «НАМ ТУТ ЖИТИ!": {
      name: "Партія Ігоря Колихаєва «Нам тут жити»",
      short: "Нам тут жити",
      wiki: 69128414,
      code: IGNORE_CODE(),
      color: "#1d2868",
    },
    "ДЕМОКРАТИЧНА СОКИРА": {
      name: "Демократична Сокира",
      short: "Демократична Сокира",
      wiki: 63244538,
      color: "#84171c",
      code: IGNORE_CODE(),
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

    // fetch all parties
    const partiesList: PartyModel[] = [];
    let page = 1;
    let hasMore = true;
    const PAGE_SIZE = 100;

    this.log("Fetching parties list...");
    while (hasMore) {
      this.log(
        `Fetching parties list page ${page}, total so far: ${partiesList.length}`,
      );
      const res = await fetch(`${API_BASE}/parties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filters: null,
          order: null,
          pager: { page, size: PAGE_SIZE },
        }),
      });
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const json = (await res.json()) as {
        results: { count: number; list: PartyModel[] };
      };

      partiesList.push(...json.results.list);
      hasMore =
        partiesList.length < json.results.count && json.results.list.length > 0;
      page++;
      if (hasMore) await timeout(500);
    }

    const partyReports: {
      party: PartyModel;
      reports: PaymentReportModel[];
    }[] = [];

    // fetch reports for each party
    this.log(`Fetching reports for ${partiesList.length} parties...`);
    const partiesWithReports = await inParallel(
      partiesList,
      5,
      async (party) => {
        const reportCacheFile = path.join(
          this.cacheDir,
          `${party.id}-reports.json`,
        );

        try {
          await fs.access(reportCacheFile, constants.F_OK);
          const cached = JSON.parse(
            await fs.readFile(reportCacheFile, "utf-8"),
          );
          return {
            party,
            reports: cached.results.list as PartyReportModel[],
          };
        } catch (e) {
          this.log(`Failed to read cache for ${party.name}, re-fetching...`, e);
        }

        try {
          const res = await fetch(`${API_BASE}/party/${party.id}/reports`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const json = (await res.json()) as {
            results: { list: PartyReportModel[] };
          };
          await fs.writeFile(reportCacheFile, JSON.stringify(json, null, " "), {
            encoding: "utf8",
          });
          return { party, reports: json.results.list };
        } catch (error) {
          this.log(`Failed to fetch reports for ${party.name}:`, error);
          return { party, reports: [] };
        }
      },
    );

    // fetch payments for each report
    this.log("Fetching payments for all reports...");
    for (const { party, reports } of partiesWithReports) {
      if (reports.length === 0) continue;

      const reportPayments: PaymentReportModel[] = [];

      this.log(
        `Fetching payments for ${party.name} (${reports.length} reports)...`,
      );
      const payments = await inParallel(reports, 10, async (report) => {
        try {
          const res = await fetch(
            `${API_BASE}/party/report/${report.id}/payments/monetary_contributions`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            },
          );
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const json = (await res.json()) as {
            results: { list: PaymentReportModel[] };
          };
          return json.results.list;
        } catch (error) {
          this.log(
            `Failed to fetch payments for report ${report.id} of ${party.name}:`,
            error,
          );
          return [];
        }
      });

      reportPayments.push(...payments.flat());

      if (reportPayments.length > 0) {
        partyReports.push({
          party,
          reports: reportPayments,
        });
      }
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
              color: RANDOM_COLOR_MARKER,
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
}

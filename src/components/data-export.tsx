"use client";
import { DownloadIcon } from "lucide-react";

import { useDonationsByYears } from "../hooks/use-api";
import { isNotNullandNotUndefined } from "../utils/array";
import { DonationField, AddressField } from "../utils/types";
import { Button } from "./ui/button";

import type { CountryConfig } from "../utils/countries";
import type { Donation } from "../utils/types";
import type { StrictNamespacedTranslator } from "@/utils/translator";
import type { createTranslator, Messages } from "next-intl";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonorName } from "@/utils/donor";

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function generateJSON(
  donations: Donation[],
  country: CountryConfig,
  t: ReturnType<typeof createTranslator<Messages>>,
  tCommon: StrictNamespacedTranslator<"common">,
): string {
  return JSON.stringify(
    donations.map((d) => {
      const receiver = d[DonationField.Receiver];
      const donorType = d[DonationField.DonorType];

      return {
        date: d[DonationField.Date],
        donor: getDonorName(d[DonationField.DonorName], tCommon),
        receiver:
          country.parties.find((p) => p.id === receiver)?.short ?? receiver,
        amount: d[DonationField.Amount],
        currency: country.currency,
        donor_type:
          donorType !== undefined ? t(`donor_type.${donorType}`) : undefined,
        country: d[DonationField.Address]?.[AddressField.Country],
        state: d[DonationField.Address]?.[AddressField.State],
      };
    }),
  );
}

function generateCSV(
  donations: Donation[],
  country: CountryConfig,
  t: ReturnType<typeof createTranslator<Messages>>,
  tCommon: StrictNamespacedTranslator<"common">,
): string {
  const headers = ["Date", "Donor Name", "Receiver", "Amount", "Currency"];

  if (country.hasDonorType) {
    headers.push("Donor Type");
  }
  if (country.hasOrigin) {
    headers.push("Country", "State");
  }

  const rows: string[] = [headers.join(",")];

  for (const donation of donations) {
    const party = country.parties.find(
      (p) => p.id === donation[DonationField.Receiver],
    );
    const row = [
      escapeCSVField(donation[DonationField.Date]),
      escapeCSVField(getDonorName(donation[DonationField.DonorName], tCommon)),
      escapeCSVField(party?.short ?? donation[DonationField.Receiver]),
      String(donation[DonationField.Amount]),
      country.currency,
    ];

    if (country.hasDonorType) {
      const donorType = donation[DonationField.DonorType];
      row.push(donorType !== undefined ? t(`donor_type.${donorType}`) : "");
    }

    if (country.hasOrigin) {
      const address = donation[DonationField.Address];
      row.push(
        escapeCSVField(address?.[AddressField.Country] ?? ""),
        escapeCSVField(address?.[AddressField.State] ?? ""),
      );
    }

    rows.push(row.join(","));
  }

  return rows.join("\n");
}

function downloadCSV(
  mimeType: string,
  fileContent: string,
  fileName: string,
): void {
  const blob = new Blob([fileContent], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface DataExportProps {
  country: CountryConfig;
}

export function DataExport({ country }: DataExportProps) {
  const t = useTranslations();
  const tData = useTranslations("data");
  const tCommon = useTranslations("common");

  const results = useDonationsByYears(country, country.years);

  const isLoading = results.some((r) => r.isLoading);
  const hasError = results.some((r) => r.error);
  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  const handleDownload = (format: "csv" | "json") => {
    const extension = format === "csv" ? "csv" : "json";
    const fileContent =
      format === "csv"
        ? generateCSV(donations, country, t, tCommon)
        : generateJSON(donations, country, t, tCommon);

    downloadCSV(
      format === "csv" ? "text/csv" : "application/json",
      fileContent,
      `DonationWatch-donations-${country.id}-${new Date().toISOString().split("T")[0]}.${extension}`,
    );
  };

  const canDownload = !isLoading && !hasError;

  return (
    <>
      {/* Status and Download */}
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant={"default"}
          type="button"
          onClick={() => handleDownload("csv")}
          disabled={!canDownload}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white disabled:cursor-not-allowed"
        >
          <DownloadIcon className="size-4" />
          {tCommon("download_format", {
            format: "CSV",
          })}
        </Button>

        <Button
          variant={"default"}
          type="button"
          onClick={() => handleDownload("json")}
          disabled={!canDownload}
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white disabled:cursor-not-allowed"
        >
          <DownloadIcon className="size-4" />
          {tCommon("download_format", {
            format: "JSON",
          })}
        </Button>

        <span className="text-sm">
          {isLoading ? (
            tData("loading")
          ) : hasError ? (
            <span className="text-red-500">{tData("error")}</span>
          ) : null}
        </span>
      </div>
    </>
  );
}

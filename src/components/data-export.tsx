"use client";
import type { Messages, createTranslator } from "next-intl";

import { DownloadIcon } from "lucide-react";

import type { PartiesMap } from "@/components/providers/country-provider";
import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";
import type { StrictNamespacedTranslator } from "@/utils/translator";
import type { Donation } from "@/utils/types";

import { CitationGenerator } from "@/components/citation/citation-generator";
import Loading from "@/components/loading/loading";
import {
  usePartiesMap,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { Button } from "@/components/ui/button";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { isNotNullandNotUndefined } from "@/utils/array";
import { PROD_URL } from "@/utils/config";
import { getCountryName } from "@/utils/countries";
import { getDonorName } from "@/utils/donor";
import { Features, hasFeature } from "@/utils/features";
import { AddressField, DonationField } from "@/utils/types";

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function generateJSON(
  donations: Donation[],
  country: CountryConfig,
  partiesMap: PartiesMap,
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
        receiver: partiesMap[receiver][PartyField.Short],
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
  partiesMap: PartiesMap,
  t: ReturnType<typeof createTranslator<Messages>>,
  tCommon: StrictNamespacedTranslator<"common">,
): string {
  const headers = ["Date", "Donor Name", "Receiver", "Amount", "Currency"];

  if (hasFeature(country, Features.DonorType)) {
    headers.push("Donor Type");
  }
  if (hasFeature(country, Features.Origin)) {
    headers.push("Country", "State");
  }

  const rows: string[] = [headers.join(",")];

  for (const donation of donations) {
    const party = partiesMap[donation[DonationField.Receiver]];
    const row = [
      escapeCSVField(donation[DonationField.Date]),
      escapeCSVField(getDonorName(donation[DonationField.DonorName], tCommon)),
      escapeCSVField(
        party?.[PartyField.Short] ?? donation[DonationField.Receiver],
      ),
      String(donation[DonationField.Amount]),
      country.currency,
    ];

    if (hasFeature(country, Features.DonorType)) {
      const donorType = donation[DonationField.DonorType];
      row.push(donorType !== undefined ? t(`donor_type.${donorType}`) : "");
    }

    if (hasFeature(country, Features.Origin)) {
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
  locale: ConstLocale;
}

export function DataExport({ locale }: DataExportProps) {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const tData = useTranslations("data");
  const tCommon = useTranslations("common");
  const tCitation = useTranslations("citation");
  const partiesMap = usePartiesMap();

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
        ? generateCSV(donations, country, partiesMap, t, tCommon)
        : generateJSON(donations, country, partiesMap, t, tCommon);

    downloadCSV(
      format === "csv" ? "text/csv" : "application/json",
      fileContent,
      `DonationWatch-donations-${country.id}-${new Date().toISOString().split("T")[0]}.${extension}`,
    );
  };

  if (isLoading) return <Loading />;
  if (hasError) return <div>{tData("error")}</div>;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          variant={"default"}
          type="button"
          onClick={() => handleDownload("csv")}
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
          className="bg-primary-600 hover:bg-primary-700 disabled:bg-primary-600/50 flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-white disabled:cursor-not-allowed"
        >
          <DownloadIcon className="size-4" />
          {tCommon("download_format", {
            format: "JSON",
          })}
        </Button>
      </div>
      <CitationGenerator
        locale={locale}
        title={tCitation("data", {
          country: getCountryName(country, tCountries),
        })}
        url={`${PROD_URL}/${locale}/${country.id}`}
      />
    </div>
  );
}

"use client";

import { DownloadIcon } from "lucide-react";
import Link from "next/link";

import { useDonationsByYears } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";
import { isNotNullandNotUndefined } from "../utils/array";
import { getCountryName } from "../utils/countries";
import { DonationField, AddressField } from "../utils/types";
import { Button } from "./ui/button";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { Donation } from "../utils/types";

import { t } from "@/app/[locale]/translations";
import { Translation } from "@/components/translation";
import { getDonorName } from "@/utils/donor";
import { formatNumber } from "@/utils/formatter";

function escapeCSVField(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function generateJSON(
  donations: Donation[],
  country: CountryConfig,
  translations: Translations,
): string {
  return JSON.stringify(
    donations.map((d) => {
      const receiver = d[DonationField.Receiver];
      const donorType = d[DonationField.DonorType];

      return {
        date: d[DonationField.Date],
        donor: getDonorName(d[DonationField.DonorName], translations),
        receiver: country.partiesById[receiver]?.short ?? receiver,
        amount: d[DonationField.Amount],
        currency: country.currency,
        donor_type:
          donorType !== undefined
            ? translations.donor_type[donorType]
            : undefined,
        country: d[DonationField.Address]?.[AddressField.Country],
        state: d[DonationField.Address]?.[AddressField.State],
      };
    }),
  );
}

function generateCSV(
  donations: Donation[],
  country: CountryConfig,
  translations: Translations,
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
    const party = country.partiesById[donation[DonationField.Receiver]];
    const row = [
      escapeCSVField(donation[DonationField.Date]),
      escapeCSVField(
        getDonorName(donation[DonationField.DonorName], translations),
      ),
      escapeCSVField(party?.short ?? donation[DonationField.Receiver]),
      String(donation[DonationField.Amount]),
      country.currency,
    ];

    if (country.hasDonorType) {
      const donorType = donation[DonationField.DonorType];
      row.push(
        donorType !== undefined ? translations.donor_type[donorType] : "",
      );
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
  const { translations, locale } = useTranslations();

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
        ? generateCSV(donations, country, translations)
        : generateJSON(donations, country, translations);

    downloadCSV(
      format === "csv" ? "text/csv" : "application/json",
      fileContent,
      `DonationWatch-donations-${country.id}-${new Date().toISOString().split("T")[0]}.${extension}`,
    );
  };

  const canDownload = !isLoading && !hasError;

  return (
    <div className="space-y-6">
      <p>
        <Translation
          text={translations.export.p0}
          variables={{
            country: getCountryName(country, translations),
            license: (
              <a
                href="https://creativecommons.org/licenses/by/4.0/deed.en"
                target="_blank"
                rel={"noopener noreferrer"}
                className="hover:text-primary-800 dark:hover:text-primary-400 underline"
              >
                CC BY 4.0
              </a>
            ),
          }}
        />
      </p>
      <p>
        <Translation
          text={translations.export.p1}
          variables={{
            source: (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={country.source.url}
                className="hover:text-primary-800 dark:hover:text-primary-400 underline"
              >
                {country.source.name}
              </a>
            ),
            transparency: (
              <Link
                href={`/${locale}/${country.id}/transparency`}
                prefetch={false}
                rel="nofollow"
                className="hover:text-primary-800 dark:hover:text-primary-400 underline"
              >
                {translations.transparency.title}
              </Link>
            ),
          }}
        />
      </p>
      <p>
        {
          <Translation
            text={translations.export.license}
            variables={{
              license: (
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-800 dark:hover:text-primary-400 underline"
                >
                  CC BY 4.0
                </a>
              ),
            }}
          />
        }
      </p>

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
          {t(translations.export.download, {
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
          {t(translations.export.download, {
            format: "JSON",
          })}
        </Button>

        <span className="text-sm">
          {isLoading ? (
            translations.loading
          ) : hasError ? (
            <span className="text-red-500">{translations.data_error}</span>
          ) : (
            t(translations.export.includes_donations, {
              num: formatNumber(locale, donations.length),
            })
          )}
        </span>
      </div>
    </div>
  );
}

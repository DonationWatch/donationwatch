"use client";

import {
  columnFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  flexRender,
  globalFilteringFeature,
  metaHelper,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useMemo, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { BrowserBasedLocale, ConstLocale } from "@/utils/locales";

import { TextPartyLink } from "@/components/parties/text-party-link";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useMobile } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { formatCountryCurrency, formatNumber } from "@/utils/formatter";

import type { ViaStat } from "./types";

interface CustomColumnMeta {
  className?: string;
  fill?: boolean;
}

const tableFeaturesConfig = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  columnMeta: metaHelper<CustomColumnMeta>(),
});

const columnHelper = createColumnHelper<typeof tableFeaturesConfig, ViaStat>();

interface DonorViaTableProps {
  viaList: ViaStat[];
  countryConfig: CountryConfig;
  locale: ConstLocale;
  browserBasedLocale: BrowserBasedLocale;
}

export const DonorViaTable = ({
  viaList,
  countryConfig,
  locale,
  browserBasedLocale,
}: DonorViaTableProps) => {
  const tDonor = useTranslations("donor");
  const tCommon = useTranslations("common");
  const tSort = useTranslations("sort");
  const isMobile = useMobile();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "sum", desc: true },
  ]);

  const columns = useMemo(() => {
    if (isMobile) {
      return columnHelper.columns([
        columnHelper.display({
          id: "mobileContent",
          meta: {
            fill: true,
          },
          cell: (cell) => {
            const item = cell.row.original;
            const yearsLabel =
              item.years.length > 0
                ? item.years[0] === item.years[item.years.length - 1]
                  ? String(item.years[0])
                  : `${item.years[0]}–${item.years[item.years.length - 1]}`
                : "—";

            return (
              <div className="w-full py-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="truncate font-semibold" title={item.name}>
                    {item.name}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {formatCountryCurrency(
                      browserBasedLocale,
                      item.sum,
                      countryConfig,
                    )}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-normal">
                  {item.primaryParty ? (
                    <TextPartyLink party={item.primaryParty} locale={locale} />
                  ) : (
                    <span>—</span>
                  )}
                  <span>&bull;</span>
                  <span>{tDonor("via.checks", { count: item.count })}</span>
                  {yearsLabel !== "—" ? (
                    <>
                      <span>&bull;</span>
                      <span>{yearsLabel}</span>
                    </>
                  ) : null}
                </div>
              </div>
            );
          },
        }),
      ]);
    }

    return columnHelper.columns([
      // Column 1: Intermediate Entity (Name on top; Primary Beneficiary & Active Years on sub-line with text-sm)
      columnHelper.accessor("name", {
        header: tDonor("via.intermediate_entity"),
        meta: {
          className: "text-left",
          fill: true,
        },
        cell: (cell) => {
          const item = cell.row.original;
          const years = item.years;
          const yearsLabel =
            years && years.length > 0
              ? years[0] === years[years.length - 1]
                ? String(years[0])
                : `${years[0]}–${years[years.length - 1]}`
              : null;

          return (
            <div className="flex min-w-0 flex-col pr-4">
              <span className="truncate" title={item.name}>
                {item.name}
              </span>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm font-normal">
                {item.primaryParty ? (
                  <TextPartyLink party={item.primaryParty} locale={locale} />
                ) : (
                  <span>—</span>
                )}
                {yearsLabel ? (
                  <>
                    <span>&bull;</span>
                    <span>{yearsLabel}</span>
                  </>
                ) : null}
              </div>
            </div>
          );
        },
      }),

      // Column 2: Transactions
      columnHelper.accessor("count", {
        header: tDonor("via.transactions"),
        meta: {
          className: "text-right tabular-nums justify-end",
        },
        cell: (cell) => (
          <span className="tabular-nums">
            {formatNumber(browserBasedLocale, cell.getValue())}
          </span>
        ),
      }),

      // Column 3: Amount
      columnHelper.accessor("sum", {
        header: tCommon("amount"),
        meta: {
          className: "text-right tabular-nums justify-end",
        },
        cell: (cell) =>
          formatCountryCurrency(
            browserBasedLocale,
            cell.getValue(),
            countryConfig,
          ),
      }),
    ]);
  }, [browserBasedLocale, countryConfig, isMobile, locale, tCommon, tDonor]);

  const table = useTable({
    features: tableFeaturesConfig,
    columns,
    data: viaList,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div className="relative mb-6 max-h-[500px] overflow-auto">
      <table className="w-full text-left">
        {isMobile ? null : (
          <thead className="sticky top-0 z-1 border-b border-zinc-200 bg-white dark:border-zinc-950 dark:bg-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isRightAligned =
                    header.column.columnDef.meta?.className?.includes(
                      "justify-end",
                    ) ?? false;

                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-2 py-1",
                        isRightAligned ? "text-right" : "text-left",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                          role={
                            header.column.getCanSort() ? "button" : undefined
                          }
                          className={cn(
                            "flex items-center space-x-1 select-none",
                            isRightAligned ? "justify-end" : "justify-start",
                            header.column.getCanSort()
                              ? "hover:text-primary cursor-pointer transition-colors"
                              : "",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          title={
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? tSort("asc")
                                : header.column.getNextSortingOrder() === "desc"
                                  ? tSort("desc")
                                  : tSort("clear")
                              : undefined
                          }
                        >
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          {{
                            asc: (
                              <ArrowDownNarrowWide
                                size={16}
                                className="shrink-0"
                              />
                            ),
                            desc: (
                              <ArrowUpNarrowWide
                                size={16}
                                className="shrink-0"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
        )}
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={cn(
                "border-b border-zinc-200 dark:border-zinc-950",
                index % 2 !== 0 && "bg-white dark:bg-zinc-900",
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cn(
                    "px-2 py-1",
                    cell.column.columnDef.meta?.className,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

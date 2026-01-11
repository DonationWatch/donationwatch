import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { useMobile } from "../../hooks/use-media-query";
import { useTranslations } from "../../hooks/use-translations";
import { useVirtual } from "../../hooks/use-virtual";
import { isNotNullandNotUndefined } from "../../utils/array";
import { cn } from "../../utils/classname";
import { getHistory } from "../../utils/data/get-history";
import { donationYear } from "../../utils/date";
import {
  formatCountryCurrency,
  formatTwoDigitDate,
} from "../../utils/formatter";
import { DonationField } from "../../utils/types";
import { DonorLink } from "../donor-link";
import { PartyDot } from "../party-dot";
import { PartyLink } from "../party-link";

import type { CountryConfig } from "../../utils/countries";
import type { HistoryEntry } from "../../utils/data/get-history";
import type { Donation } from "../../utils/types";
import type { FC } from "react";

import { getDonorName } from "@/utils/donor";

const columnHelper = createColumnHelper<HistoryEntry>();

export const DonationHistoryTable: FC<{
  country: CountryConfig;
  years?: string[];
  partiesIds: string[];
  donations: Donation[];
  readonlyDonor?: boolean;
}> = ({ country, years, partiesIds, donations, readonlyDonor = false }) => {
  const { translations, locale } = useTranslations();
  const partiesIdSet = new Set(partiesIds);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const columns = useMemo(() => {
    if (isMobile)
      return [
        columnHelper.display({
          id: "content",
          meta: {
            fill: true,
          },
          cell: (cell) => {
            const historyEntry = cell.row.original;

            return (
              <div className="grow">
                <div className="flex justify-between text-gray-700 dark:text-gray-400">
                  {
                    <div className="font-mono">
                      {historyEntry.date !==
                      donationYear({ [DonationField.Date]: historyEntry.date })
                        ? formatTwoDigitDate(
                            locale,
                            new Date(historyEntry.date),
                          )
                        : historyEntry.date}
                    </div>
                  }
                  <PartyLink
                    party={historyEntry.party}
                    country={country}
                    translations={translations}
                    locale={locale}
                  >
                    <PartyDot
                      className="text-sm"
                      party={historyEntry.party}
                      country={country}
                    />
                  </PartyLink>
                </div>
                <div className="justify-between space-y-1 sm:flex sm:space-y-0">
                  <div className="space-x-1 font-semibold">
                    {readonlyDonor ? (
                      getDonorName(historyEntry.donor, translations)
                    ) : (
                      <DonorLink country={country} donor={historyEntry.donor} />
                    )}
                  </div>
                  <div className="shrink-0 text-sm tabular-nums sm:text-base">
                    {formatCountryCurrency(
                      locale,
                      historyEntry.amount,
                      country,
                    )}
                  </div>
                </div>
              </div>
            );
          },
        }),
      ];

    return [
      columnHelper.accessor("date", {
        header: translations.common.date,
        size: 150,
        meta: {
          className: "font-mono",
        },
        cell: (cell) => {
          const date = cell.getValue();

          if (date === donationYear({ [DonationField.Date]: date }))
            return date;

          return formatTwoDigitDate(locale, new Date(date));
        },
      }),
      columnHelper.accessor("party", {
        header: translations.common.party,
        size: 150,
        cell: (cell) => (
          <PartyLink
            className="overflow-x-hidden"
            party={cell.getValue()}
            country={country}
            translations={translations}
            locale={locale}
          >
            <PartyDot
              className="overflow-x-hidden"
              nameClassName="truncate"
              party={cell.getValue()}
              country={country}
            />
          </PartyLink>
        ),
      }),
      columnHelper.accessor("donor", {
        header: translations.common.donor,
        meta: {
          fill: true,
        },
        cell: (cell) =>
          readonlyDonor ? (
            getDonorName(cell.row.original.donor, translations)
          ) : (
            <DonorLink country={country} donor={cell.row.original.donor} />
          ),
      }),
      columnHelper.accessor("amount", {
        header: translations.common.amount,
        size: 150,
        meta: {
          className: "justify-end tabular-nums",
        },
        cell: (cell) => formatCountryCurrency(locale, cell.getValue(), country),
      }),
    ].filter(isNotNullandNotUndefined);
  }, [locale, isMobile]);

  const history = useMemo(
    () =>
      getHistory(country, donations, years).filter((entry) =>
        partiesIds.length ? partiesIdSet.has(entry.party) : true,
      ),
    [donations],
  );
  const table = useReactTable<HistoryEntry>({
    columns,
    data: history,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtual({
    count: history.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  return (
    <div
      className="h-[80vh] min-h-[600px]"
      style={{
        overflow: "auto", //our scrollable table container
        position: "relative", //needed for sticky header
      }}
      ref={tableContainerRef}
    >
      <table className="grid">
        {isMobile ? null : (
          <thead className="sticky top-0 z-1 grid border-b border-slate-200 bg-white dark:border-slate-950 dark:bg-slate-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    className={cn(
                      header.column.columnDef.meta?.fill ? "grow" : undefined,
                    )}
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        tabIndex={0}
                        role="button"
                        className={cn(
                          header.column.columnDef.meta?.className,
                          "flex items-center space-x-1 px-2 py-1",
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(ev) => {
                          if (ev.key !== "Enter") return;

                          // on enter trigger the click action
                          ev.stopPropagation();
                          header.column.getToggleSortingHandler()?.(ev);
                        }}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? translations.sort.asc
                              : header.column.getNextSortingOrder() === "desc"
                                ? translations.sort.desc
                                : translations.sort.clear
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
                          asc: <ArrowDownNarrowWide size={16} />,
                          desc: <ArrowUpNarrowWide size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
        )}
        <tbody
          className="relative grid"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<HistoryEntry>;
            return (
              <tr
                data-index={virtualRow.index} //needed for dynamic row height measurement
                ref={(node) => {
                  rowVirtualizer.measureElement(node);
                }} //measure dynamic row height
                key={row.id}
                className="absolute flex w-full border-b border-slate-200 even:bg-white dark:border-slate-950 dark:even:bg-slate-900"
                style={{
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      "flex items-center px-2 py-1",
                      cell.column.columnDef.meta?.className,
                      cell.column.columnDef.meta?.fill ? "grow" : undefined,
                    )}
                    style={{
                      width: cell.column.getSize(),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

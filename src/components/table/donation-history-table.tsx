"use client";
import {
  createColumnHelper,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  ExternalLink,
  Search,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useCallback, useMemo, useRef, useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { HistoryEntry } from "@/utils/data/get-history";
import type { Donation } from "@/utils/types";

import { DonationTypeLabel } from "@/components/donations/donation-type";
import { ExternalDonationLink } from "@/components/donations/external-donation-link";
import { DonorLink } from "@/components/donors/donor-link";
import { DonorName } from "@/components/donors/donor-name";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useMobile } from "@/hooks/use-media-query";
import { useVirtual } from "@/hooks/use-virtual";
import { cn } from "@/lib/utils";
import { PartyField } from "@/types/party";
import { isNotNullandNotUndefined } from "@/utils/array";
import { getHistory } from "@/utils/data/get-history";
import { donationYear } from "@/utils/date";
import { Features, hasFeature } from "@/utils/features";
import { formatCountryCurrency, formatTwoDigitDate } from "@/utils/formatter";
import { DonationField, DonationType } from "@/utils/types";

const columnHelper = createColumnHelper<HistoryEntry>();

export const DonationHistoryTable = ({
  country,
  years,
  partiesIds,
  donations,
  readonlyDonor = false,
}: {
  country: CountryConfig;
  years?: string[];
  partiesIds: string[];
  donations: Donation[];
  readonlyDonor?: boolean;
}) => {
  const t = useTranslations();
  const tSort = useTranslations("sort");
  const tCommon = useTranslations("common");
  const tSearch = useTranslations("search");
  const locale = useLocale();
  const partiesIdSet = useMemo(() => new Set(partiesIds), [partiesIds]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");

  const partyNameMap = useMemo(() => {
    const map = new Map<string, { name: string; short: string }>();
    country.parties.forEach((party: Party) => {
      map.set(String(party[PartyField.Id]), {
        name: party[PartyField.Name],
        short: party[PartyField.Short],
      });
    });
    return map;
  }, [country.parties]);

  const globalFilterFn = useCallback<FilterFn<HistoryEntry>>(
    (row, _columnId, filterValue: string) => {
      const q = filterValue.trim().toLowerCase();
      if (!q) return true;
      const donor = row.original.donor?.toLowerCase() ?? "";
      const partyId = String(row.original.party);
      const partyName = (
        partyNameMap.get(partyId)?.name ?? partyId
      ).toLowerCase();
      const partyShort = (
        partyNameMap.get(partyId)?.short ?? partyId
      ).toLowerCase();
      return (
        donor.includes(q) || partyName.includes(q) || partyShort.includes(q)
      );
    },
    [partyNameMap],
  );

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
                    locale={locale}
                  >
                    <PartyDot
                      className="text-sm"
                      party={historyEntry.party}
                      country={country}
                    />
                  </PartyLink>
                </div>
                <div className="space-y-1">
                  <div className="space-x-1 font-semibold">
                    {readonlyDonor ? (
                      <DonorName donor={historyEntry.donor} />
                    ) : (
                      <DonorLink country={country} donor={historyEntry.donor} />
                    )}
                  </div>
                  {hasFeature(country, Features.DonationType) ? (
                    <DonationTypeLabel
                      donationType={
                        historyEntry.donationType ?? DonationType.Money
                      }
                      label={t(
                        `donation_type.${historyEntry.donationType ?? DonationType.Money}`,
                      )}
                    />
                  ) : null}
                  <div className="flex items-center justify-between">
                    <div className="shrink-0 text-sm tabular-nums">
                      {formatCountryCurrency(
                        locale,
                        historyEntry.amount,
                        country,
                      )}
                    </div>
                    <div className="shrink-0">
                      <ExternalDonationLink
                        countryConfig={country}
                        id={cell.row.original.id}
                        className={
                          "text-s1 flex items-center gap-1 pr-1 text-sm"
                        }
                        title={tCommon("view_source")}
                      >
                        <span>{tCommon("view_source")}</span>
                        <ExternalLink className={"inline"} size={16} />
                      </ExternalDonationLink>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        }),
      ];

    return [
      columnHelper.accessor("date", {
        header: t("common.date"),
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
        header: t("common.party"),
        size: 150,
        cell: (cell) => (
          <PartyLink
            className="overflow-x-hidden"
            party={cell.getValue()}
            country={country}
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
      hasFeature(country, Features.DonationType)
        ? columnHelper.accessor("donationType", {
            header: t("common.donation_type"),
            size: 150,
            cell: (cell) => {
              const donationType = cell.getValue() ?? DonationType.Money;

              return (
                <DonationTypeLabel
                  donationType={donationType}
                  label={t(`donation_type.${donationType}`)}
                />
              );
            },
          })
        : undefined,
      columnHelper.accessor("donor", {
        header: t("common.donor"),
        meta: {
          fill: true,
        },
        cell: (cell) =>
          readonlyDonor ? (
            <DonorName donor={cell.row.original.donor} />
          ) : (
            <DonorLink country={country} donor={cell.row.original.donor} />
          ),
      }),
      columnHelper.accessor("amount", {
        header: t("common.amount"),
        size: 150,
        meta: {
          className: "justify-end tabular-nums",
        },
        cell: (cell) => formatCountryCurrency(locale, cell.getValue(), country),
      }),
      hasFeature(country, Features.ExternalDonationIds)
        ? columnHelper.accessor("id", {
            header: "",
            size: 50,
            cell: (cell) => (
              <ExternalDonationLink
                countryConfig={country}
                id={cell.row.original.id}
                title={tCommon("view_source")}
              >
                <ExternalLink className={"m-1"} size={16} />
              </ExternalDonationLink>
            ),
          })
        : null,
    ].filter(isNotNullandNotUndefined);
  }, [locale, isMobile, country, readonlyDonor, t, tCommon]);

  const history = useMemo(
    () =>
      getHistory(country, donations, years).filter((entry) =>
        partiesIds.length ? partiesIdSet.has(entry.party) : true,
      ),
    [donations, country, years, partiesIdSet, partiesIds.length],
  );
  const table = useReactTable<HistoryEntry>({
    columns,
    data: history,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
  });
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtual({
    count: rows.length,
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
    <div className="flex flex-col gap-2">
      <div className="relative md:max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          name="donations-search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={tSearch("filter")}
          aria-label={tSearch("filter")}
          className="w-full rounded-md border border-slate-200 bg-white py-1.5 pr-3 pl-8 text-sm outline-none placeholder:text-slate-500 focus:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-400 dark:focus:border-slate-500"
        />
      </div>
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

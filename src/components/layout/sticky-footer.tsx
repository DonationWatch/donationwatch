"use client";

import type { ComponentProps } from "react";

import { Funnel } from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useContext } from "react";

import type { FilterContextValue } from "@/components/filter/filter-context";

import { FilterContext } from "@/components/filter/filter-context";
import { useClientTranslations } from "@/hooks/use-client-translations";
import { cn } from "@/lib/utils";

const FilterTriggerButton = ({
  onClick,
  yearFilter,
  activeFilterCount,
  ...props
}: ComponentProps<"button"> & {
  yearFilter: FilterContextValue | null;
  activeFilterCount: number;
}) => {
  const tFilter = useClientTranslations("filter");
  const isActive = yearFilter?.isFiltered;
  const label = tFilter("title");

  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={cn(
        "relative flex h-10 cursor-pointer items-center justify-center transition-all",
        isActive
          ? "bg-primary-700 hover:bg-primary-500 gap-2 rounded-full px-4 text-white"
          : "w-10 rounded-full text-neutral-600 hover:bg-neutral-600/10 dark:text-neutral-300",
      )}
      onClick={(event) => {
        onClick?.(event);
      }}
    >
      <Funnel size={18} className={cn(isActive ? "fill-current" : undefined)} />
      {isActive && activeFilterCount > 0 ? (
        <span className="text-sm font-medium whitespace-nowrap">
          {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}
        </span>
      ) : null}
      {isActive ? (
        <span className="ring-primary-700 dark:ring-primary-700 absolute top-1.5 left-2.5 size-2.5 rounded-full bg-white ring-2" />
      ) : null}
    </button>
  );
};

export const StickyFooter = () => {
  const pathname = usePathname() ?? "";
  const yearFilter = useContext(FilterContext);

  const segments = pathname.split("/").filter(Boolean);
  const isCountryRoot = segments.length <= 2;

  const isFilterVisible =
    !isCountryRoot && !!yearFilter && yearFilter.hasFilterSections;

  let activeFilterCount = 0;
  if (yearFilter?.isFiltered) {
    const { activeFilters, bounds } = yearFilter;
    if (
      activeFilters.fromYear !== bounds.minYear ||
      activeFilters.toYear !== bounds.maxYear
    ) {
      activeFilterCount++;
    }
    if (activeFilters.activePartyIds.size !== bounds.availableParties.length) {
      activeFilterCount++;
    }
    if (
      activeFilters.activeDonationTypes.size !==
      bounds.availableDonationTypes.length
    ) {
      activeFilterCount++;
    }
    if (
      activeFilters.activeDonorTypes.size !== bounds.availableDonorTypes.length
    ) {
      activeFilterCount++;
    }
  }

  return (
    <div className="sticky bottom-0 z-20 lg:-mx-16">
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex shrink-0 border-b border-transparent dark:text-white">
        <div className="flex grow items-end justify-between px-2 pb-4 lg:px-4 lg:pb-4">
          <div className="flex items-end">{/* left side */}</div>
          <div>
            {isFilterVisible && (
              <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-slate-200 bg-white/60 p-1 shadow backdrop-blur-sm transition-all lg:flex-col dark:border-slate-50/6 dark:bg-slate-900/60">
                <div className="flex items-center">
                  <FilterTriggerButton
                    activeFilterCount={activeFilterCount}
                    yearFilter={yearFilter}
                    onClick={() => yearFilter?.setIsOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

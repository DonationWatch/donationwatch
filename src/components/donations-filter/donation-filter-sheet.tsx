"use client";

import { RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

import type { UnloadedCountryConfig } from "@/types/country-config";

import {
  FilterSheetSection,
  FilterSheetSectionCounter,
  FilterSheetSectionFooterButtons,
} from "@/components/filter/filter-sheet-section";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useClientTranslations } from "@/hooks/use-client-translations";
import { useFilterEngine } from "@/hooks/use-filter-engine";
import { PartyField } from "@/types/party";
import { Features, hasFeature } from "@/utils/features";
import { capitalize } from "@/utils/string";

import { Button } from "../ui/button";

const DonationFilterSheetBase = ({
  countryConfig,
}: {
  countryConfig: UnloadedCountryConfig;
}) => {
  const tActions = useClientTranslations("actions");
  const tFilter = useClientTranslations("filter");
  const tDonationType = useClientTranslations("donation_type");
  const tDonorType = useClientTranslations("donor_type");

  const { activeFilters, bounds, controls, isFiltered, isOpen, setIsOpen } =
    useFilterEngine();

  // Accordion toggle states
  const [isYearsOpen, setIsYearsOpen] = useState(true);
  const [isPartiesOpen, setIsPartiesOpen] = useState(true);
  const [isTypesOpen, setIsTypesOpen] = useState(false);
  const [isDonorTypesOpen, setIsDonorTypesOpen] = useState(false);

  const fromYearsOptions = useMemo(() => {
    const list = [];
    for (let y = bounds.minYear; y <= activeFilters.toYear; y++) {
      list.push(y);
    }
    return list;
  }, [bounds.minYear, activeFilters.toYear]);

  const toYearsOptions = useMemo(() => {
    const list = [];
    for (let y = activeFilters.fromYear; y <= bounds.maxYear; y++) {
      list.push(y);
    }
    return list;
  }, [activeFilters.fromYear, bounds.maxYear]);

  // Handle manual input parsing
  const handleYearInput = (from: number, to: number) => {
    const clampedFrom = Math.max(
      bounds.minYear,
      Math.min(bounds.maxYear, from),
    );
    const clampedTo = Math.max(clampedFrom, Math.min(bounds.maxYear, to));
    controls.setYearRange(clampedFrom, clampedTo);
  };

  return (
    <Sheet modal={"trap-focus"} open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        className={
          "top-4 right-4 bottom-4 left-4 h-auto w-auto max-w-full rounded-2xl border-0 border-slate-200 bg-white/80 shadow backdrop-blur-sm sm:left-auto sm:w-3/4 dark:border-slate-50/6 dark:bg-slate-900/80"
        }
        hideOverlay={true}
        side="right"
        translations={{
          close: tActions("close"),
        }}
      >
        <SheetHeader>
          <SheetTitle>{tFilter("title")}</SheetTitle>
          <SheetDescription>{tFilter("description")}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-4">
          {bounds.minYear < bounds.maxYear && (
            <FilterSheetSection
              title={tFilter("years.title")}
              isOpen={isYearsOpen}
              onToggle={() => setIsYearsOpen(!isYearsOpen)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex grow flex-col">
                  <label className="sr-only" htmlFor={"fromYear"}>
                    {tFilter("years.from")}
                  </label>
                  <Combobox
                    value={activeFilters.fromYear.toString()}
                    onValueChange={(val) => {
                      if (val) {
                        handleYearInput(
                          parseInt(val, 10),
                          activeFilters.toYear,
                        );
                      }
                    }}
                  >
                    <ComboboxInput id="fromYear" className="w-full" />
                    <ComboboxContent>
                      <ComboboxList>
                        {fromYearsOptions.map((y) => (
                          <ComboboxItem key={y} value={y.toString()}>
                            {y}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
                <span className="shrink-0 text-sm font-semibold">
                  {tFilter("years.to")}
                </span>
                <div className="flex grow flex-col">
                  <label className="sr-only" htmlFor={"toYear"}>
                    {tFilter("years.to")}
                  </label>
                  <Combobox
                    value={activeFilters.toYear.toString()}
                    onValueChange={(val) => {
                      if (val) {
                        handleYearInput(
                          activeFilters.fromYear,
                          parseInt(val, 10),
                        );
                      }
                    }}
                  >
                    <ComboboxInput id="toYear" className="w-full" />
                    <ComboboxContent>
                      <ComboboxList>
                        {toYearsOptions.map((y) => (
                          <ComboboxItem key={y} value={y.toString()}>
                            {y}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>
              </div>
              <Button
                variant={"outline"}
                disabled={
                  activeFilters.fromYear === bounds.minYear &&
                  activeFilters.toYear === bounds.maxYear
                }
                onClick={() => {
                  controls.setYearRange(bounds.minYear, bounds.maxYear);
                }}
              >
                {tFilter("select_all")}
              </Button>
            </FilterSheetSection>
          )}

          {bounds.availableParties.length > 1 && (
            <FilterSheetSection
              title={tFilter("parties")}
              badge={
                <FilterSheetSectionCounter
                  value={activeFilters.activePartyIds.size}
                  max={bounds.availableParties.length}
                />
              }
              isOpen={isPartiesOpen}
              onToggle={() => setIsPartiesOpen(!isPartiesOpen)}
            >
              <div className="max-h-72 overflow-x-hidden overflow-y-auto pr-2">
                <div className="flex flex-col gap-2">
                  {bounds.availableParties.map((party) => {
                    const partyId = party[PartyField.Id];
                    const isChecked = activeFilters.activePartyIds.has(partyId);

                    return (
                      <label
                        className={"flex items-center gap-2"}
                        key={partyId}
                      >
                        <Checkbox
                          className="shrink-0 after:inset-0"
                          checked={isChecked}
                          onCheckedChange={() => controls.toggleParty(partyId)}
                        />
                        <div className="flex grow items-center gap-2.5">
                          <span
                            className="size-3.5 shrink-0 rounded-full border border-slate-950/20"
                            style={{
                              backgroundColor: party[PartyField.Color],
                            }}
                          />
                          <span className="text-sm">
                            {party[PartyField.Name]}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              <FilterSheetSectionFooterButtons
                selectAllDisabled={
                  activeFilters.activePartyIds.size ===
                  bounds.availableParties.length
                }
                selectAll={() => {
                  const allIds = bounds.availableParties.map(
                    (p) => p[PartyField.Id],
                  );
                  controls.setSelectedParties(allIds);
                }}
                selectNoneDisabled={activeFilters.activePartyIds.size === 0}
                selectNone={() => controls.setSelectedParties([])}
              />
            </FilterSheetSection>
          )}

          {hasFeature(countryConfig, Features.DonationType) &&
            bounds.availableDonationTypes.length > 1 && (
              <FilterSheetSection
                title={tFilter("donation_types")}
                badge={
                  <FilterSheetSectionCounter
                    value={activeFilters.activeDonationTypes.size}
                    max={bounds.availableDonationTypes.length}
                  />
                }
                isOpen={isTypesOpen}
                onToggle={() => setIsTypesOpen(!isTypesOpen)}
              >
                <div className="max-h-72 overflow-x-hidden overflow-y-auto">
                  <div className="flex flex-col gap-2">
                    {bounds.availableDonationTypes.map((type) => {
                      const isChecked =
                        activeFilters.activeDonationTypes.has(type);
                      return (
                        <label
                          className="flex cursor-pointer items-center gap-2"
                          key={type}
                        >
                          <Checkbox
                            className="shrink-0 after:inset-0"
                            checked={isChecked}
                            onCheckedChange={() =>
                              controls.toggleDonationType(type)
                            }
                          />
                          <div className="flex grow items-center gap-2.5">
                            <span className="text-sm tracking-tight">
                              {capitalize(tDonationType(`${type}`))}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <FilterSheetSectionFooterButtons
                  selectAllDisabled={
                    activeFilters.activeDonationTypes.size ===
                    bounds.availableDonationTypes.length
                  }
                  selectAll={() => {
                    controls.setSelectedDonationTypes(
                      bounds.availableDonationTypes,
                    );
                  }}
                  selectNoneDisabled={
                    activeFilters.activeDonationTypes.size === 0
                  }
                  selectNone={() => controls.setSelectedDonationTypes([])}
                />
              </FilterSheetSection>
            )}

          {hasFeature(countryConfig, Features.DonorType) &&
            bounds.availableDonorTypes.length > 1 && (
              <FilterSheetSection
                title={tFilter("donor_types")}
                badge={
                  <FilterSheetSectionCounter
                    value={activeFilters.activeDonorTypes.size}
                    max={bounds.availableDonorTypes.length}
                  />
                }
                isOpen={isDonorTypesOpen}
                onToggle={() => setIsDonorTypesOpen(!isDonorTypesOpen)}
              >
                <div className="max-h-72 overflow-x-hidden overflow-y-auto pr-2">
                  <div className="flex flex-col gap-2">
                    {bounds.availableDonorTypes.map((type) => {
                      const isChecked =
                        activeFilters.activeDonorTypes.has(type);

                      return (
                        <label
                          className="flex cursor-pointer items-center gap-2"
                          key={type}
                        >
                          <Checkbox
                            className="shrink-0 after:inset-0"
                            checked={isChecked}
                            onCheckedChange={() =>
                              controls.toggleDonorType(type)
                            }
                          />
                          <div className="flex grow items-center gap-2.5">
                            <span className="text-sm tracking-tight">
                              {tDonorType(`${type}`)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <FilterSheetSectionFooterButtons
                  selectAllDisabled={
                    activeFilters.activeDonorTypes.size ===
                    bounds.availableDonorTypes.length
                  }
                  selectAll={() => {
                    controls.setSelectedDonorTypes(bounds.availableDonorTypes);
                  }}
                  selectNoneDisabled={activeFilters.activeDonorTypes.size === 0}
                  selectNone={() => controls.setSelectedDonorTypes([])}
                />
              </FilterSheetSection>
            )}
        </div>
        <SheetFooter>
          <Button
            disabled={!isFiltered}
            size={"lg"}
            onClick={controls.resetFilters}
          >
            <RotateCcw size={13} />
            {tFilter("reset")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const DonationFilterSheet = dynamic(
  () => Promise.resolve(DonationFilterSheetBase),
  { ssr: false },
);

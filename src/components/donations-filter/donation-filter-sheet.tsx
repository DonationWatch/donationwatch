"use client";

import { RotateCcw } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

import {
  FilterSheetSection,
  FilterChecklistSection,
} from "@/components/filter/filter-sheet-section";
import { useOptionalCountryConfig } from "@/components/providers/country-provider";
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

const DonationFilterSheetBase = () => {
  const countryConfig = useOptionalCountryConfig();
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

  if (!countryConfig) return null;

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

  const activePartiesSet = useMemo(
    () =>
      new Set(
        bounds.availableParties.filter((p) =>
          activeFilters.activePartyIds.has(p[PartyField.Id]),
        ),
      ),
    [bounds.availableParties, activeFilters.activePartyIds],
  );

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

          <FilterChecklistSection
            title={tFilter("parties")}
            items={bounds.availableParties}
            activeItems={activePartiesSet}
            onToggleItem={(party) => controls.toggleParty(party[PartyField.Id])}
            onSelectAll={() => {
              const allIds = bounds.availableParties.map(
                (p) => p[PartyField.Id],
              );
              controls.setSelectedParties(allIds);
            }}
            onSelectNone={() => controls.setSelectedParties([])}
            isOpen={isPartiesOpen}
            onToggleOpen={() => setIsPartiesOpen(!isPartiesOpen)}
            renderItem={(party) => ({
              key: party[PartyField.Id],
              label: (
                <div className="flex grow items-center gap-2.5">
                  <span
                    className="size-3.5 shrink-0 rounded-full border border-slate-950/20"
                    style={{ backgroundColor: party[PartyField.Color] }}
                  />
                  <span className="text-sm">{party[PartyField.Short]}</span>
                </div>
              ),
            })}
          />

          {hasFeature(countryConfig, Features.DonationType) && (
            <FilterChecklistSection
              title={tFilter("donation_types")}
              items={bounds.availableDonationTypes}
              activeItems={activeFilters.activeDonationTypes}
              onToggleItem={controls.toggleDonationType}
              onSelectAll={() => {
                controls.setSelectedDonationTypes(
                  bounds.availableDonationTypes,
                );
              }}
              onSelectNone={() => controls.setSelectedDonationTypes([])}
              isOpen={isTypesOpen}
              onToggleOpen={() => setIsTypesOpen(!isTypesOpen)}
              renderItem={(type) => ({
                key: `${type}`,
                label: (
                  <div className="flex grow items-center gap-2.5">
                    <span className="text-sm tracking-tight">
                      {capitalize(tDonationType(`${type}`))}
                    </span>
                  </div>
                ),
              })}
            />
          )}

          {hasFeature(countryConfig, Features.DonorType) && (
            <FilterChecklistSection
              title={tFilter("donor_types")}
              items={bounds.availableDonorTypes}
              activeItems={activeFilters.activeDonorTypes}
              onToggleItem={controls.toggleDonorType}
              onSelectAll={() => {
                controls.setSelectedDonorTypes(bounds.availableDonorTypes);
              }}
              onSelectNone={() => controls.setSelectedDonorTypes([])}
              isOpen={isDonorTypesOpen}
              onToggleOpen={() => setIsDonorTypesOpen(!isDonorTypesOpen)}
              renderItem={(type) => ({
                key: `${type}`,
                label: (
                  <div className="flex grow items-center gap-2.5">
                    <span className="text-sm tracking-tight">
                      {tDonorType(`${type}`)}
                    </span>
                  </div>
                ),
              })}
            />
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

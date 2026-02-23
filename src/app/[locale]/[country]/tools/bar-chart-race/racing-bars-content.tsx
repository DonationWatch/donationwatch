"use client";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import { EChartsRacingBars } from "../../../../../components/echarts/echarts-racing-bars";
import { Button } from "../../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";
import { cn } from "../../../../../utils/classname";
import {
  type CountryConfig,
  getCountryName,
} from "../../../../../utils/countries";
import { formatYearsRange } from "../../../../../utils/formatter";
import { type Donation, DonationField } from "../../../../../utils/types";

import { firstItem, lastItem } from "@/utils/array";

export const RacingBarsContent = ({
  countryConfig,
  allDonations,
}: {
  countryConfig: CountryConfig;
  allDonations: Donation[];
}) => {
  const t = useTranslations();
  const tSearch = useTranslations("search");
  const tBarChartRace = useTranslations("bar_chart_race");
  const locale = useLocale();

  const lastLegislativeYear = lastItem(countryConfig.legislativeYears);
  const minYear = countryConfig.years[0];
  const maxYear = countryConfig.years[countryConfig.years.length - 1];

  const [fromYearParam, setFromYear] = useQueryState(
    "from",
    parseAsString.withDefault(firstItem(lastLegislativeYear)),
  );

  const [toYearParam, setToYear] = useQueryState(
    "to",
    parseAsString.withDefault(lastItem(lastLegislativeYear)),
  );

  const [groupByParam, setGroupBy] = useQueryState(
    "groupBy",
    parseAsString.withDefault("donor"),
  );

  const [durationParam, setDuration] = useQueryState(
    "duration",
    parseAsString.withDefault("10000"),
  );

  const groupByField =
    groupByParam === "receiver"
      ? DonationField.Receiver
      : DonationField.DonorName;

  // Parse duration (in milliseconds)
  const totalRuntimeMs = parseInt(durationParam, 10) || 5000;

  // Fallback if params initially loaded are invalid or outside range
  const fromYear = countryConfig.years.includes(fromYearParam)
    ? fromYearParam
    : minYear;
  const toYear = countryConfig.years.includes(toYearParam)
    ? toYearParam
    : maxYear;

  const validSelectedYears = useMemo(() => {
    // Ensure we have a valid range from the available years
    return countryConfig.years.filter((year) => {
      // String comparison works for "YYYY" format
      return year >= fromYear && year <= toYear;
    });
  }, [countryConfig.years, fromYear, toYear]);

  const filteredDonations = useMemo(() => {
    // If all years are selected, return all donations directly (optimization)
    if (validSelectedYears.length === countryConfig.years.length) {
      return allDonations;
    }

    const yearSet = new Set(validSelectedYears);
    return allDonations.filter((d) => {
      const date = d[DonationField.Date];
      const year = date.substring(0, 4);
      return yearSet.has(year);
    });
  }, [allDonations, validSelectedYears, countryConfig.years.length]);

  const handleFromYearChange = (year: string) => {
    // If new start > current end, push end to new start (or just let disabled attributes handle it)
    // With disabled attributes, this shouldn't happen, but good safety.
    if (year > toYear) {
      void setToYear(year);
    }
    void setFromYear(year);
  };

  const handleToYearChange = (year: string) => {
    if (year < fromYear) {
      void setFromYear(year);
    }
    void setToYear(year);
  };

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">
          {tSearch("legislative_years")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {countryConfig.legislativeYears.map((years) => {
            const start = years[0];
            const end = years[years.length - 1];
            const label = `${start}-${end}`;
            const isActive = fromYear === start && toYear === end;

            return (
              <Button
                key={label}
                variant={isActive ? "default" : "outline"}
                onClick={() => {
                  setFromYear(start);
                  setToYear(end);
                }}
              >
                {label}
              </Button>
            );
          })}
        </div>
      </fieldset>

      {/* Individual year buttons */}
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">
          {tBarChartRace("individual_years")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {countryConfig.years.map((year) => {
            const isActive = fromYear === year && toYear === year;
            return (
              <Button
                key={year}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFromYear(year);
                  setToYear(year);
                }}
              >
                {year}
              </Button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">
          {tBarChartRace("group_by.label")}
        </legend>
        <div
          className="flex gap-2"
          role="group"
          aria-label={tBarChartRace("group_by.label")}
        >
          <Button
            variant={groupByParam === "donor" ? "default" : "outline"}
            onClick={() => setGroupBy("donor")}
            aria-pressed={groupByParam === "donor"}
          >
            {tBarChartRace("group_by.donor")}
          </Button>
          <Button
            variant={groupByParam === "receiver" ? "default" : "outline"}
            onClick={() => setGroupBy("receiver")}
            aria-pressed={groupByParam === "receiver"}
          >
            {tBarChartRace("group_by.receiver")}
          </Button>
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">
          {tBarChartRace("animation_duration")}
        </legend>
        <div
          className="flex gap-2"
          role="group"
          aria-label={tBarChartRace("animation_duration")}
        >
          {[
            {
              label: tBarChartRace("duration_s", {
                seconds: "10",
              }),
              value: "10000",
            },
            {
              label: tBarChartRace("duration_s", {
                seconds: "30",
              }),
              value: "30000",
            },
            {
              label: tBarChartRace("duration_s", {
                seconds: "60",
              }),
              value: "60000",
            },
          ].map(({ label, value }) => (
            <Button
              key={value}
              variant={durationParam === value ? "default" : "outline"}
              size="sm"
              onClick={() => setDuration(value)}
              aria-pressed={durationParam === value}
            >
              {label}
            </Button>
          ))}
        </div>
      </fieldset>

      {/* Advanced year range selection */}
      <details className="group">
        <summary className="text-accent-foreground hover:text-foreground cursor-pointer text-sm font-medium">
          {tBarChartRace("custom_range")}
        </summary>
        <div className="mt-2 flex flex-row items-center gap-2">
          <label htmlFor="from-year-select" className="text-sm font-medium">
            {tBarChartRace("from")}
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger
              id="from-year-select"
              render={
                <Button variant="outline" className="w-32 justify-between" />
              }
            >
              {fromYear}
              <ChevronDownIcon className="size-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-64">
              {countryConfig.years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleFromYearChange(year)}
                  disabled={year > toYear}
                  className={cn(
                    "flex justify-between",
                    year === fromYear &&
                      "bg-accent text-accent-foreground font-bold",
                  )}
                >
                  {year}
                  {year === fromYear && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-muted-foreground">-</span>
          <label htmlFor="to-year-select" className="text-sm font-medium">
            {tBarChartRace("to")}
          </label>

          <DropdownMenu>
            <DropdownMenuTrigger
              id="to-year-select"
              render={
                <Button variant="outline" className="w-32 justify-between" />
              }
            >
              {toYear}
              <ChevronDownIcon className="size-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="h-64">
              {countryConfig.years.map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => handleToYearChange(year)}
                  disabled={year < fromYear}
                  className={cn(
                    "flex justify-between",
                    year === toYear &&
                      "bg-accent text-accent-foreground font-bold",
                  )}
                >
                  {year}
                  {year === toYear && <CheckIcon className="size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </details>

      {filteredDonations.length ? (
        <EChartsRacingBars
          key={`${fromYear}-${toYear}-${groupByParam}-${durationParam}`}
          countryConfig={countryConfig}
          years={validSelectedYears}
          donations={filteredDonations}
          groupByField={groupByField}
          locale={locale}
          currency={countryConfig.currency}
          title={tBarChartRace("chart_title")}
          subtitle={tBarChartRace("chart_subtitle", {
            years: formatYearsRange(validSelectedYears),
            country: getCountryName(countryConfig, t),
          })}
          partiesById={countryConfig.partiesById}
          totalRuntimeMs={totalRuntimeMs}
        />
      ) : (
        tBarChartRace("no_data")
      )}
    </div>
  );
};

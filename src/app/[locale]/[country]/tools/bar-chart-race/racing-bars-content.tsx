"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useMemo } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { NonEmptyArray } from "@/utils/array";

import { EChartsRacingBars } from "@/components/charts/echarts-racing-bars";
import { Button } from "@/components/ui/button";
import { YearRangeSelector } from "@/components/years/year-range-selector";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { firstItem, lastItem } from "@/utils/array";
import { getCountryName } from "@/utils/countries";
import { formatYearsRange } from "@/utils/formatter";
import { type Donation, DonationField } from "@/utils/types";

export const RacingBarsContent = ({
  countryConfig,
  allDonations,
}: {
  countryConfig: CountryConfig;
  allDonations: Donation[];
}) => {
  const tCountries = useTranslations("countries");
  const tBarChartRace = useTranslations("bar_chart_race");

  const lastLegislativeYear = lastItem(
    countryConfig.legislativeYears ?? [
      [countryConfig.years.at(0)!] as NonEmptyArray<string>,
    ],
  );
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

  return (
    <div className="flex flex-col gap-4">
      <YearRangeSelector
        countryConfig={countryConfig}
        fromYear={fromYear}
        toYear={toYear}
        setFromYear={setFromYear}
        setToYear={setToYear}
      />

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

      {filteredDonations.length ? (
        <EChartsRacingBars
          key={`${fromYear}-${toYear}-${groupByParam}-${durationParam}`}
          countryConfig={countryConfig}
          years={validSelectedYears}
          donations={filteredDonations}
          groupByField={groupByField}
          currency={countryConfig.currency}
          title={tBarChartRace("chart_title")}
          subtitle={tBarChartRace("chart_subtitle", {
            years: formatYearsRange(validSelectedYears),
            country: getCountryName(countryConfig, tCountries),
          })}
          totalRuntimeMs={totalRuntimeMs}
        />
      ) : (
        tBarChartRace("no_data")
      )}
    </div>
  );
};

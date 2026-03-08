import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "../utils/classname";

import type { CountryConfig } from "../utils/countries";

export const YearRangeSelector = ({
  countryConfig,
  fromYear,
  toYear,
  setFromYear,
  setToYear,
  showAllYears,
}: {
  countryConfig: CountryConfig;
  fromYear: string;
  toYear: string;
  setFromYear: (year: string) => void;
  setToYear: (year: string) => void;
  showAllYears?: boolean;
}) => {
  const tSearch = useTranslations("search");
  const tBarChartRace = useTranslations("bar_chart_race");

  const handleFromYearChange = (year: string) => {
    if (year > toYear) {
      setToYear(year);
    }
    setFromYear(year);
  };

  const handleToYearChange = (year: string) => {
    if (year < fromYear) {
      setFromYear(year);
    }
    setToYear(year);
  };

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-2 text-sm font-medium">
          {tSearch("legislative_years")}
        </legend>
        <div className="flex flex-wrap gap-2">
          {showAllYears && (
            <Button
              variant={
                fromYear === countryConfig.years[0] &&
                toYear === countryConfig.years[countryConfig.years.length - 1]
                  ? "default"
                  : "outline"
              }
              onClick={() => {
                setFromYear(countryConfig.years[0]);
                setToYear(countryConfig.years[countryConfig.years.length - 1]);
              }}
            >
              All years
            </Button>
          )}
          {countryConfig.legislativeYears?.map((years) => {
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
    </div>
  );
};

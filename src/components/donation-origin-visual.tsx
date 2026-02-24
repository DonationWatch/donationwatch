"use client";
import { Map, Workflow } from "lucide-react";
import { useState } from "react";

import { DonationStateMap } from "./chart/donation-state-map";
import { DonationStateSankey } from "./chart/donation-state-sankey";
import { DynamicGeoJsonLoader } from "./dynamic-geojson-loader";
import { NavigationTab } from "./navigation-tab";
import { TabList } from "./tabs";
import { type CountryConfig, getCountryName } from "../utils/countries";

import type { Donation, Party } from "../utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

type ChartType = "map" | "sankey";
const DEFAULT_TYPE: ChartType = "map";

export const DonationOriginVisual = ({
  donations,
  country,
  years,
  parties,
  subtitle,
}: {
  country: CountryConfig;
  donations: Donation[];
  years: string[];
  parties: Party[];
  subtitle: string;
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");

  const [chartType, setChartType] = useState<ChartType>(DEFAULT_TYPE);

  return (
    <>
      <TabList>
        <NavigationTab
          icon={<Map size={16} aria-hidden={true} />}
          label={t("origin.type.map")}
          isActive={chartType === "map"}
          onClick={() => setChartType("map")}
        />
        <NavigationTab
          icon={<Workflow size={16} aria-hidden={true} />}
          label={t("donors.sankey.title")}
          isActive={chartType === "sankey"}
          onClick={() => setChartType("sankey")}
        />
      </TabList>

      <div className="my-4">
        {chartType === "map" ? (
          <DynamicGeoJsonLoader country={country}>
            <DonationStateMap
              country={country}
              donations={donations}
              years={years}
              parties={parties}
              title={t("origin.country.title", {
                country: getCountryName(country, tCountries),
              })}
              subtitle={subtitle}
            />
          </DynamicGeoJsonLoader>
        ) : (
          <DonationStateSankey
            donations={donations}
            country={country}
            parties={parties}
            years={years}
            title={t("origin.country.title", {
              country: getCountryName(country, tCountries),
            })}
            subtitle={subtitle}
          />
        )}
      </div>
    </>
  );
};

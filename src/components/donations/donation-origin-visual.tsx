"use client";
import { Map, Workflow } from "lucide-react";
import { useState } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Donation, Party } from "@/utils/types";

import { DonationStateMap } from "@/components/charts/donation-state-map";
import { DonationStateSankey } from "@/components/charts/donation-state-sankey";
import { DynamicGeoJsonLoader } from "@/components/charts/dynamic-geojson-loader";
import { NavigationTab } from "@/components/layout/navigation-tab";
import { TabList } from "@/components/tabs";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getCountryName } from "@/utils/countries";

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
          icon={<Map size={16} />}
          label={t("origin.type.map")}
          isActive={chartType === "map"}
          onClick={() => setChartType("map")}
        />
        <NavigationTab
          icon={<Workflow size={16} />}
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

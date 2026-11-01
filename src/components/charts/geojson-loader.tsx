"use client";
import type { GeoJSONSourceInput } from "echarts/types/src/coord/geo/geoTypes.js";
import type { PropsWithChildren } from "react";

import { MapChart } from "echarts/charts";
import { VisualMapComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { Country } from "@/utils/countries";

echarts.use([VisualMapComponent, MapChart]);

const GEOJSON_FILES: Partial<Record<Country, string>> = {
  [Country.germany]: "/geojson/germany.json",
  [Country.austria]: "/geojson/austria.json",
  [Country.europeanunion]: "/geojson/europe.json",
  [Country.canada]: "/geojson/canada.json",
  [Country.unitedstates]: "/geojson/unitedstates.json",
};

export const GeoJsonLoader = ({ children }: PropsWithChildren) => {
  const country = useRequiredCountryConfig();
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const map = echarts.getMap(country.code);
        if (!map) {
          const jsonPath = GEOJSON_FILES[country.id];
          if (jsonPath) {
            const res = await fetch(jsonPath);
            if (!res.ok) {
              throw new Error(`Failed to load geojson: ${res.statusText}`);
            }
            const data = (await res.json()) as GeoJSONSourceInput;
            echarts.registerMap(country.code, data);
          }
        }
        setMapLoaded(true);
      } catch (error) {
        console.error("Error loading map data:", error);
      }
    };

    fetchData();
  }, [country]);

  return mapLoaded ? children : null;
};

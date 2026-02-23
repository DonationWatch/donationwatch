"use client";
import { MapChart } from "echarts/charts";
import { VisualMapComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { useEffect, useState } from "react";

import { Country } from "../utils/countries";

import type { CountryConfig } from "../utils/countries";
import type { GeoJSONSourceInput } from "echarts/types/src/coord/geo/geoTypes.js";
import type { PropsWithChildren } from "react";

echarts.use([VisualMapComponent, MapChart]);

const mapLoader: Partial<Record<Country, () => Promise<unknown>>> = {
  [Country.germany]: () =>
    import("../../public/geojson/germany").then((mod) => mod.default),
  [Country.austria]: () =>
    import("../../public/geojson/austria").then((mod) => mod.default),
  [Country.europeanunion]: () =>
    import("../../public/geojson/europe").then((mod) => mod.default),
  [Country.canada]: () =>
    import("../../public/geojson/canada").then((mod) => mod.default),
};

export const GeoJsonLoader = ({
  children,
  country,
}: PropsWithChildren<{
  country: CountryConfig;
}>) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const map = echarts.getMap(country.code);
        if (!map) {
          const data = await mapLoader[country.id]!();
          echarts.registerMap(country.code, data as GeoJSONSourceInput);
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

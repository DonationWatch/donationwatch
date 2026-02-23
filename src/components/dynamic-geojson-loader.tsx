"use client";
import dynamic from "next/dynamic";

import Loading from "./loading";

export const DynamicGeoJsonLoader = dynamic(
  () => import("./geojson-loader").then((mod) => mod.GeoJsonLoader),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

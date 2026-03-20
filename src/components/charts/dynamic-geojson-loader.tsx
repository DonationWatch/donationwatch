"use client";
import dynamic from "next/dynamic";

import Loading from "@/components/loading/loading";

export const DynamicGeoJsonLoader = dynamic(
  () => import("./geojson-loader").then((mod) => mod.GeoJsonLoader),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

"use client";
import dynamic from "next/dynamic";

import Loading from "../loading";

export const DynamicEchart = dynamic(
  () => import("./echart").then((mod) => mod.ReactECharts),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

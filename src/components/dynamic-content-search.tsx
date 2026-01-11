"use client";

import dynamic from "next/dynamic";

export const DynamicContentSearch = dynamic(
  () => import("./content-search").then((mod) => mod.CountryHeaderSearch),
  {
    ssr: false,
    loading: () => <div className="size-10 p-1" />,
  },
);

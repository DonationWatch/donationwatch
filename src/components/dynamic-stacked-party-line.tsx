"use client";

import dynamic from "next/dynamic";

export const DynamicStackedPartyDonations = dynamic(
  () => import("./stacked-party-line").then((mod) => mod.StackedPartyDonations),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full rounded-xs bg-gray-200 dark:bg-gray-700"></div>
    ),
  },
);

export const DynamicAbsoluteMultiplePartySumsGradient = dynamic(
  () =>
    import("./stacked-party-line").then(
      (mod) => mod.AbsoluteMultiplePartySumsGradient,
    ),
  { ssr: false },
);

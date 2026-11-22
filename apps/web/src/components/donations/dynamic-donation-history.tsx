"use client";
import dynamic from "next/dynamic";

import Loading from "@/components/loading/loading";

export const DynamicPartyDonationHistory = dynamic(
  () =>
    import("./party-donation-history").then((mod) => mod.PartyDonationHistory),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

export const DynamicYearDonationHistory = dynamic(
  () =>
    import("./party-donation-history").then((mod) => mod.YearDonationHistory),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

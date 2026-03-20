"use client";
import dynamic from "next/dynamic";

export const DynamicDonationHistoryDate = dynamic(
  () =>
    import("./donation-history-date").then((mod) => mod.DonationHistoryDate),
  {
    ssr: false,
    loading: () => <div className="h-[20px] w-[100px] shrink-0" />,
  },
);

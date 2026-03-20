"use client";
import dynamic from "next/dynamic";

export const DynamicDonorDonationsDetail = dynamic(
  () =>
    import("./donor-donations-detail").then((mod) => mod.DonorDonationsDetail),
  { ssr: false },
);

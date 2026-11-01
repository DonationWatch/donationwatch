"use client";

import dynamic from "next/dynamic";

import { useFilterEngine } from "@/hooks/use-filter-engine";
import { useHasEverOpened } from "@/hooks/use-has-ever-opened";

const DonationFilterSheetContent = dynamic(
  () =>
    import("./donation-filter-sheet-content").then(
      (m) => m.DonationFilterSheetContent,
    ),
  { ssr: false },
);

export const DonationFilterSheet = () => {
  const { isOpen } = useFilterEngine();
  const hasEverOpened = useHasEverOpened(isOpen);

  if (!hasEverOpened) {
    return null;
  }

  return <DonationFilterSheetContent />;
};

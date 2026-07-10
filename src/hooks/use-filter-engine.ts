import { useContext } from "react";

import type { Donation } from "@/utils/types";

import { FilterContext } from "@/components/filter/filter-context";

export const useFilterEngine = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterEngine must be used within a FilterProvider");
  }
  return context;
};

export const hasPendingFilterDonationSync = ({
  dataDonations,
  filterDonations,
  isFiltered,
}: {
  dataDonations: Donation[] | null | undefined;
  filterDonations: Donation[];
  isFiltered: boolean;
}) => {
  if (isFiltered || !dataDonations || dataDonations.length === 0) return false;
  if (filterDonations === dataDonations) return false;
  if (filterDonations.length !== dataDonations.length) return true;

  for (let i = 0; i < dataDonations.length; i++) {
    if (filterDonations[i] !== dataDonations[i]) return true;
  }

  return false;
};

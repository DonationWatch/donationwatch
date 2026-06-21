import { useContext } from "react";

import { FilterContext } from "@/components/filter/filter-context";

export const useFilterEngine = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterEngine must be used within a FilterProvider");
  }
  return context;
};

"use client";

import { useEffect } from "react";

import { useFilterEngine } from "@/hooks/use-filter-engine";
import { deserializeYears } from "@/utils/serializers";

export const YearsFilterSync = ({ yearsParam }: { yearsParam: string }) => {
  const { setAvailableRange } = useFilterEngine();

  useEffect(() => {
    const years = deserializeYears(yearsParam);
    if (years.length > 0) {
      const parsedYears = years
        .map((y) => parseInt(y, 10))
        .filter((y) => !Number.isNaN(y));
      if (parsedYears.length > 0) {
        setAvailableRange([
          parsedYears[0],
          parsedYears[parsedYears.length - 1],
        ]);
      }
    } else {
      setAvailableRange(null);
    }
    return () => {
      setAvailableRange(null);
    };
  }, [yearsParam, setAvailableRange]);

  return null;
};

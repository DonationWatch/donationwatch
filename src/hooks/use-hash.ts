import { useMemo } from "react";

import { sha1Sync } from "@/utils/hash";

export const useHash = (inputString: string) => {
  return useMemo(() => {
    if (!inputString) {
      return { hash: null, isHashing: false, error: null };
    }
    try {
      const hash = sha1Sync(inputString);
      return { hash, isHashing: false, error: null };
    } catch (err) {
      return {
        hash: null,
        isHashing: false,
        error: err instanceof Error ? err : new Error("Hashing failed"),
      };
    }
  }, [inputString]);
};

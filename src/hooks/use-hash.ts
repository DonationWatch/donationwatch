import { useEffect, useState } from "react";

import { clientSha1 } from "../utils/hash";

export const useHash = (inputString: string) => {
  const [hash, setHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  performance.mark("useHash.start");

  useEffect(() => {
    if (!inputString) return;

    const computeHash = async () => {
      setIsHashing(true);
      try {
        const hashed = await clientSha1(inputString);
        setHash(hashed);

        performance.mark("useHash.end");
        performance.measure("useHash", "useHash.start", "useHash.end");
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Hashing failed"));
      } finally {
        setIsHashing(false);
      }
    };

    computeHash();
  }, [inputString]);

  return { hash, isHashing, error };
};

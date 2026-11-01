import { useEffect, useState } from "react";

/**
 * Returns true once `isOpen` becomes true, and stays true thereafter.
 * Useful for deferring mounting/rendering of heavy modal/drawer content until first opened.
 */
export const useHasEverOpened = (isOpen: boolean): boolean => {
  const [hasOpened, setHasOpened] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setHasOpened(true);
    }
  }, [isOpen]);

  return hasOpened || isOpen;
};

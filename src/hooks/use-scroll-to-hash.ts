"client-only";

import { useEffect } from "react";

/**
 * Scrolls to the element matching `window.location.hash` once `isReady` flips
 * to `true`. Useful for pages that load content client-side and need to honor
 * deep-link anchors after data resolves.
 *
 * @param isReady - Set to `true` when the page content is fully rendered.
 */
export const useScrollToHash = (isReady: boolean) => {
  useEffect(() => {
    if (!isReady) return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    requestAnimationFrame(() => {
      document
        .getElementById(hash)
        ?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, [isReady]);
};

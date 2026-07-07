import "client-only";
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

    let observer: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let resizeTimer: NodeJS.Timeout | null = null;

    const scrollToElement = () => {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "auto", block: "start" });
        return true;
      }
      return false;
    };

    // Attempt to scroll immediately
    const scrolled = scrollToElement();

    // Set up a ResizeObserver to handle layout shifts (like Wikipedia or charts rendering)
    const setupResizeObserver = () => {
      if (observer) return;
      observer = new ResizeObserver(() => {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          scrollToElement();
        }, 50);
      });
      observer.observe(document.body);
    };

    if (scrolled) {
      setupResizeObserver();
    } else {
      // Element is not in DOM yet. Watch for its appearance.
      mutationObserver = new MutationObserver(() => {
        if (scrollToElement()) {
          // Once scrolled successfully, start watching for layout shifts
          setupResizeObserver();
          mutationObserver?.disconnect();
          mutationObserver = null;
        }
      });
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    // Stop all auto-scrolling adjustments after 2 seconds to not fight user actions
    const timeout = setTimeout(() => {
      observer?.disconnect();
      mutationObserver?.disconnect();
    }, 2000);

    return () => {
      observer?.disconnect();
      mutationObserver?.disconnect();
      if (resizeTimer) clearTimeout(resizeTimer);
      clearTimeout(timeout);
    };
  }, [isReady]);
};

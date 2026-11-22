import { useCallback, useSyncExternalStore } from "react";

// from https://github.com/uidotdev/usehooks
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (callback: () => void) => {
      const matchMedia = window.matchMedia(query);

      matchMedia.addEventListener("change", callback);
      return () => {
        matchMedia.removeEventListener("change", callback);
      };
    },
    [query],
  );

  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  const getServerSnapshot = () => {
    return false;
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useMobile() {
  return useMediaQuery("(max-width: 550px)");
}

const bp = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint(
  breakpoint: keyof typeof bp,
  width: "min" | "max" = "min",
) {
  const query = width === "min" ? "min-width" : "max-width";

  return useMediaQuery(`(${query}:${bp[breakpoint]}px)`);
}

export function useDarkColorScheme() {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

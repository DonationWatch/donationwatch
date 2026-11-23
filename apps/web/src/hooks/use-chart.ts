import { useMemo } from "react";

import { useDarkColorScheme, useMobile } from "./use-media-query";

const cssColorCache = new Map<string, string>();
let colorCanvasCtx: CanvasRenderingContext2D | null | undefined;

/**
 * Resolves a Tailwind CSS variable (e.g. `--color-zinc-900`, which may use oklch)
 * into an `rgb(...)` string that ECharts/zrender can parse natively.
 */
export const resolveCssVarColor = (
  cssVar: string,
  fallback: string,
): string => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return fallback;
  }

  const cached = cssColorCache.get(cssVar);
  if (cached) return cached;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  if (!raw) return fallback;

  if (colorCanvasCtx === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    colorCanvasCtx = canvas.getContext("2d", { willReadFrequently: true });
  }

  if (!colorCanvasCtx) return fallback;

  colorCanvasCtx.clearRect(0, 0, 1, 1);
  colorCanvasCtx.fillStyle = raw;
  colorCanvasCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = colorCanvasCtx.getImageData(0, 0, 1, 1).data;
  const resolved =
    a === 255
      ? `rgb(${r}, ${g}, ${b})`
      : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;

  cssColorCache.set(cssVar, resolved);
  return resolved;
};

export const useChart = () => {
  const isMobile = useMobile();
  const isDark = useDarkColorScheme();

  const white = resolveCssVarColor("--color-white", "#ffffff");
  const zinc50 = resolveCssVarColor("--color-zinc-50", "#fafafa");
  const zinc100 = resolveCssVarColor("--color-zinc-100", "#f4f4f5");
  const zinc200 = resolveCssVarColor("--color-zinc-200", "#e4e4e7");
  const zinc400 = resolveCssVarColor("--color-zinc-400", "#a1a1aa");
  const zinc600 = resolveCssVarColor("--color-zinc-600", "#52525b");
  const zinc800 = resolveCssVarColor("--color-zinc-800", "#27272a");
  const zinc900 = resolveCssVarColor("--color-zinc-900", "#18181b");

  const treemapColors = useMemo(
    () => ({
      zinc100,
      zinc200,
      zinc400,
      zinc600,
      zinc800,
      zinc900,
    }),
    [zinc100, zinc200, zinc400, zinc600, zinc800, zinc900],
  );

  return {
    isMobile,
    isDark,
    barBorderColor: isDark ? zinc900 : zinc50,
    backgroundColor: isDark ? zinc900 : white,
    treemapBorderColor: isDark ? zinc900 : zinc100,
    treemapColors,
  };
};

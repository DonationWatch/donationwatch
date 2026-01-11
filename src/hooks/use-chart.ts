import { useDarkColorScheme, useMobile } from "./use-media-query";

export const useChart = () => {
  const isMobile = useMobile();
  const isDark = useDarkColorScheme();

  return {
    isMobile,
    isDark,
    barBorderColor: isDark ? "#0f172a" : "#f8fafc",
    backgroundColor: isDark ? "#111827" : "#ffffff",
    // backgroundColor: "red", //isDark ? "#111827" : "#ffffff",
  };
};

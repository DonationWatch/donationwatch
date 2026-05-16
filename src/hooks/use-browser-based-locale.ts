import "client-only";
import { useContext } from "react";

import { BrowserBasedLocaleContext } from "@/app/providers";

export const useBrowserBasedLocale = () => {
  const ctx = useContext(BrowserBasedLocaleContext);

  if (!ctx)
    throw new Error(
      "useBrowserBasedLocale must be used within BrowserBasedLocaleProvider",
    );

  return ctx;
};

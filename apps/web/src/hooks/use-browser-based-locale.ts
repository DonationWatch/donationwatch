import "client-only";
import { use } from "react";

import { BrowserBasedLocaleContext } from "@/app/providers";

export const useBrowserBasedLocale = () => {
  const ctx = use(BrowserBasedLocaleContext);

  if (!ctx)
    throw new Error(
      "useBrowserBasedLocale must be used within BrowserBasedLocaleProvider",
    );

  return ctx;
};

"use client";

import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const replaceSearchParam = (
  router: AppRouterInstance,
  param: string,
  value: string | undefined,
  preventScroll?: boolean,
) => {
  const url = new URL(window.location.href);
  if (typeof value === "undefined") {
    url.searchParams.delete(param);
  } else {
    url.searchParams.set(param, value);
  }
  router.push(url.toString(), preventScroll ? { scroll: false } : undefined);
};

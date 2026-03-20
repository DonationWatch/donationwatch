import type { NextRequest } from "next/server";

import { localeFromAcceptLanguage } from "./locale-from-accept-language";

export const extractYearsRange = (
  pathname: string,
): undefined | { start: string; end: string } => {
  const yearRangeRegex = /^\/\w+\/\w+\/(\d{4})-(\d{4})/;

  const match = pathname.match(yearRangeRegex);
  if (!match) return undefined;

  const [, start, end] = match;

  return { start, end };
};

// Get the preferred locale, similar to above or using a library
export const getLocale = (request: NextRequest) => {
  return localeFromAcceptLanguage(request.headers.get("accept-language"));
};

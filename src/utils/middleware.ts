import type { NextRequest } from "next/server";

import { localeFromAcceptLanguage } from "./locale-from-accept-language";

// Get the preferred locale, similar to above or using a library
export const getLocale = (request: NextRequest) => {
  return localeFromAcceptLanguage(request.headers.get("accept-language"));
};

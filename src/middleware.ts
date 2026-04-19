import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import type { ConstLocale } from "./utils/locales";

import { DEFAULT_COUNTRY } from "./utils/config";
import { COUNTRIES } from "./utils/countries";
import { LOCALES_SET } from "./utils/locales";
import { getLocale } from "./utils/middleware";

const PATHS_WITHOUT_COUNTRY = [
  "about",
  "imprint",
  "fun",
  "privacy",
  "other-countries",
];

const countriesArray = [...COUNTRIES];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract the first path segment: e.g. "/de/germany/2024" -> "de"
  const firstSegment = pathname.split("/")[1] ?? "";
  const pathnameIsMissingLocale = !LOCALES_SET.has(firstSegment as ConstLocale);

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    // if we open the url without path, pathname is / meaning it'll construct /de// without this check
    const url = pathname !== "/" ? `/${locale}${pathname}` : `/${locale}`;

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(url, request.url), {
      headers: request.headers,
    });
  }

  const localeRoot = `/${firstSegment}`;
  const isAllowedWithoutCountry = PATHS_WITHOUT_COUNTRY.some((path) =>
    pathname.startsWith(`${localeRoot}/${path}`),
  );

  // Allow locale root paths (e.g., /en, /de) to show the homepage
  const isLocaleRoot = pathname === localeRoot;

  if (!isAllowedWithoutCountry && !isLocaleRoot) {
    const pathnameIsMissingCountry = countriesArray.every(
      (country) => !pathname.startsWith(`${localeRoot}/${country}`),
    );

    if (pathnameIsMissingCountry) {
      const newUrl = `${localeRoot}/${DEFAULT_COUNTRY}${pathname.substring(
        localeRoot.length,
      )}`;

      // e.g. incoming request is /de/foo/bar/baz
      // The new URL is now /de/DEFAULT_COUNTRY/foo/bar/baz
      return NextResponse.redirect(new URL(newUrl, request.url), {
        headers: request.headers,
        status: 308,
      });
    }
  }

  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const config = {
  matcher: [
    // skip api, next/static requests, and static asset extensions
    "/((?!api|_next|.well-known|schema|llms.txt|favicon.ico|sitemap-global.xml|sitemap.xml|sitemap_index.xml|robots.txt|b505b06a6ef745df9fb702d2c8ab9fee.txt|sitemap/[a-z]{2}\\.xml|.+\\.(?:png|ico|jpg|json|svg)$).*)",
  ],
};

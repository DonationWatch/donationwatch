import { NextResponse } from "next/server";

import { DEFAULT_COUNTRY } from "./utils/config";
import { COUNTRIES, findCorrectParty, getParty } from "./utils/countries";
import { getCountryConfig } from "./utils/data/get-country-config";
import { DEFAULT_LOCALE, LOCALES } from "./utils/locales";
import { extractYearsRange, getLocale } from "./utils/middleware";

import type { Country } from "./utils/countries";
import type { ReceiverId } from "./utils/types";
import type { NextRequest } from "next/server";

const PATHS_WITHOUT_COUNTRY = [
  "about",
  "imprint",
  "fun",
  "privacy",
  "other-countries",
];

const ignoredPathnameExtension = /\.(png|ico|jpg|json|svg)$/;

const countriesArray = [...COUNTRIES];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/.well-known")) {
    // we don't have any well-known stuff. Return 404 early. This is primarily for devtools workspaces auto requesting
    return NextResponse.rewrite(new URL("/404", request.url), {
      headers: request.headers,
      status: 404,
    });
  }

  // do nothing for these static assets
  if (ignoredPathnameExtension.test(pathname)) {
    return;
  }

  const pathnameIsMissingLocale = !LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

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

  // redirect to country if it's missing
  const match = pathname.match(/^\/(\w+)/) || [
    `/${DEFAULT_LOCALE}`,
    DEFAULT_LOCALE,
  ];

  const [localeRoot] = match;

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

  // handle same year range, e.g. /de/germany/2023-2023/overview and replace it with /de/germany/2023/overview
  const range = extractYearsRange(pathname);
  if (range && range.start === range.end) {
    const newUrl = pathname.replace(`${range.start}-${range.end}`, range.start);
    return NextResponse.redirect(new URL(newUrl, request.url), {
      headers: request.headers,
      status: 308,
    });
  }

  // handle potentially mistyped party id /locale/country/party/...
  // e.g. /en/australia/party/advance/donors -> /en/australia/party/ADVANCE/donors
  // Parse the URL segments
  if (pathname.includes("/party/")) {
    const segments = pathname.split("/").filter(Boolean);

    // Check if this matches your dynamic route pattern
    if (segments.length >= 4 && segments[2] === "party") {
      const [locale, country, , partyId, ...restPath] = segments;
      const countryConfig = await getCountryConfig(country as Country);

      if (countryConfig) {
        const party = getParty(countryConfig, partyId as ReceiverId);
        if (!party) {
          const correctParty = findCorrectParty(countryConfig, partyId);

          if (correctParty) {
            const correctedPath = `/${locale}/${country}/party/${correctParty.id}${
              restPath.length > 0 ? `/${restPath.join("/")}` : ""
            }`;
            return NextResponse.redirect(
              new URL(correctedPath, request.url),
              308,
            );
          }
        }
      }
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
    // skip api and next/static requests
    "/((?!api|_next|favicon.ico|sitemap.xml|sitemap_index.xml|robots.txt|b505b06a6ef745df9fb702d2c8ab9fee.txt|sitemap/[a-z]{2}\\.xml).*)",
  ],
};

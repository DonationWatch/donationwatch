import { test, expect } from "vitest";

import { middleware } from "../src/middleware";
import { extractYearsRange, getLocale } from "../src/utils/middleware";

import type { NextRequest } from "next/server";
import { skipIfFakeEnv } from "./config";

test("does nothing with static files", async () => {
  const skippedRequests = [
    "/image.png",
    "/favicon.ico",
    "/image.jpg",
    "_next/static/media/germany.1fe47647.svg",
    "/data/germany/donations/by-year/2024.json?t=1734083138390",
  ];

  for (const pathname of skippedRequests) {
    expect(
      await middleware({
        nextUrl: new URL(`https://example.com${pathname}`),
      } as unknown as NextRequest),
    ).toEqual(undefined);
  }
});

test("redirects with locale if missing", async () => {
  const tests: [
    lang: string,
    statusCode: number,
    path: string,
    expectedLocation: string | null,
  ][] = [
    ["de-DE", 307, "/", "https://example.com/de"],
    ["de-DE", 307, "/about", "https://example.com/de/about"],
    ["de-DE", 307, "/imprint", "https://example.com/de/imprint"],
    ["de-DE", 307, "/fun", "https://example.com/de/fun"],
    [
      "de-DE",
      307,
      "/germany/2024/donors",
      "https://example.com/de/germany/2024/donors",
    ],
    [
      "la-LA",
      307,
      "/germany/2024/donors",
      "https://example.com/en/germany/2024/donors",
    ],

    ["de-DE", 200, "/en/germany/2024/donors", null],
  ];

  for (const [lang, statusCode, path, expectedLocation] of tests) {
    const request = {
      url: new URL(`https://example.com${path}`),
      nextUrl: new URL(`https://example.com${path}`),
      headers: new Headers({ "accept-language": lang }),
    } as unknown as NextRequest;
    const response = await middleware(request);

    expect(response?.status).toEqual(statusCode);
    expect(response?.headers.get("location")).toEqual(expectedLocation);
  }
});

test("adds country if it's missing", async () => {
  const tests = [
    ["/de/about", 200, null],
    ["/de", 200, null],
    ["/en/2024/overview", 308, "https://example.com/en/germany/2024/overview"],
  ] as [path: string, status: number, expected: string | null][];

  for (const [path, status, expected] of tests) {
    const request = {
      url: new URL(`https://example.com${path}`),
      nextUrl: new URL(`https://example.com${path}`),
      headers: new Headers(),
    } as unknown as NextRequest;
    const response = await middleware(request);

    expect(response?.status).toEqual(status);
    expect(response?.headers.get("location")).toEqual(expected);
  }
});

test("removes same year range", async () => {
  const tests = [
    ["/en/germany/2025/overview", 200, null],
    ["/en/germany/2022-2025/overview", 200, null],
    ["/en/germany/party/FDP/donors", 200, null],
    [
      "/en/germany/2022-2022/overview",
      308,
      "https://example.com/en/germany/2022/overview",
    ],
  ] as [path: string, status: number, expected: string | null][];

  for (const [path, status, expected] of tests) {
    const request = {
      url: new URL(`https://example.com${path}`),
      nextUrl: new URL(`https://example.com${path}`),
      headers: new Headers(),
    } as unknown as NextRequest;
    const response = await middleware(request);

    expect(response?.status).toEqual(status);
    expect(response?.headers.get("location")).toEqual(expected);
  }
});

test("redirects mistyped party ids to the correct ones", async (context) => {
  skipIfFakeEnv(context);

  const tests = [
    ["/en/germany/party/FDP/", 200, null],
    ["/en/germany/party/FDP", 200, null],
    ["/en/germany/party/FDP/donors", 200, null],

    ["/de/germany/party/fdp/", 308, "https://example.com/de/germany/party/FDP"],
    ["/de/germany/party/fdp", 308, "https://example.com/de/germany/party/FDP"],
    [
      "/de/germany/party/fdp/donors",
      308,
      "https://example.com/de/germany/party/FDP/donors",
    ],
    [
      "/en/australia/party/advance/timeline",
      308,
      "https://example.com/en/australia/party/ADVANCE/timeline",
    ],
  ] as [path: string, status: number, expected: string | null][];

  for (const [path, status, expected] of tests) {
    const request = {
      url: new URL(`https://example.com${path}`),
      nextUrl: new URL(`https://example.com${path}`),
      headers: new Headers(),
    } as unknown as NextRequest;
    const response = await middleware(request);

    expect(response?.status).toEqual(status);
    expect(response?.headers.get("location")).toEqual(expected);
  }
});

test("extractYearsRange", () => {
  (
    [
      ["/", undefined],
      ["", undefined],
      ["/de", undefined],
      ["/de/fun", undefined],
      ["/de/germany", undefined],
      ["/de/germany/", undefined],
      ["/de/germany/party/CDU", undefined],
      ["/de/germany/party/CDU/donors", undefined],
      ["/de/germany/2022", undefined],
      ["/de/germany/2022/overview", undefined],

      ["/de/germany/2022-2025", { start: "2022", end: "2025" }],
      ["/de/germany/2022-2022", { start: "2022", end: "2022" }],
      ["/de/germany/2022-2025/overview", { start: "2022", end: "2025" }],
    ] as [string, ReturnType<typeof extractYearsRange>][]
  ).forEach(([pathname, expected]) => {
    expect(extractYearsRange(pathname)).toEqual(expected);
  });
});

test("getLocale", () => {
  const tests: [lang: string | undefined, expected: string][] = [
    ["de", "de"],
    ["de-DE", "de"],
    ["nl-NL", "nl"],
    ["cs-CZ", "cs"],
    ["lv-LV", "lv"],
    ["et-EE", "et"],

    [undefined, "en"],
    ["", "en"],
    ["en-US,en;q=0.9", "en"],
    ["ja-JP", "en"],
  ];

  for (const [lang, expected] of tests) {
    const request = {
      headers: new Headers(lang ? { "accept-language": lang } : {}),
    } as unknown as NextRequest;
    expect(getLocale(request)).toEqual(expected);
  }
});

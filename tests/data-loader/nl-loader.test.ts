import { describe, expect, test } from "vitest";

import {
  uboExtractor2024,
  uboExtractorAfter2025,
} from "../../tasks/load-data/nl/nl-loader";

describe("uboExtractorAfter2025", () => {
  test("it works", () => {
    expect(uboExtractorAfter2025("")).toEqual([]);
    expect(uboExtractorAfter2025("Foo")).toEqual(["Foo"]);
    expect(uboExtractorAfter2025("Foo\nBar")).toEqual(["Foo", "Bar"]);
  });
});

describe("uboExtractor2024", () => {
  test("it works", () => {
    expect(uboExtractor2024("Name", "City")).toEqual(["Name, City"]);
    expect(uboExtractor2024("Name 1\nName 2", "City 1\nCity 2")).toEqual([
      "Name 1, City 1",
      "Name 2, City 2",
    ]);
  });

  test("some entries have one name and multiple times the same city", () => {
    expect(uboExtractor2024("Name", "City 1\nCity 1")).toEqual([
      "Name, City 1",
    ]);
  });

  test("some entries have multiple names and only one city", () => {
    expect(uboExtractor2024("Name 1\nName 2", "City 1")).toEqual([
      "Name 1, City 1",
      "Name 2, City 1",
    ]);
  });
});

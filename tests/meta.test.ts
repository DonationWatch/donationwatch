import { expect, test } from "vitest";

import { generateAlternates } from "../src/utils/meta";

test("generateAlternates", () => {
  expect(generateAlternates()).toEqual({
    canonical: `./`,
    languages: {
      cs: "https://donation.watch/cs",
      de: "https://donation.watch/de",
      en: "https://donation.watch/en",
      nl: "https://donation.watch/nl",
      lv: "https://donation.watch/lv",
      et: "https://donation.watch/et",
      hr: "https://donation.watch/hr",
      no: "https://donation.watch/no",
      uk: "https://donation.watch/uk",
    },
  });

  expect(generateAlternates("foo")).toEqual({
    canonical: `./`,
    languages: {
      cs: "https://donation.watch/cs/foo",
      de: "https://donation.watch/de/foo",
      en: "https://donation.watch/en/foo",
      nl: "https://donation.watch/nl/foo",
      lv: "https://donation.watch/lv/foo",
      et: "https://donation.watch/et/foo",
      hr: "https://donation.watch/hr/foo",
      no: "https://donation.watch/no/foo",
      uk: "https://donation.watch/uk/foo",
    },
  });

  expect(generateAlternates("foo/bar/baz")).toEqual({
    canonical: `./`,
    languages: {
      cs: "https://donation.watch/cs/foo/bar/baz",
      de: "https://donation.watch/de/foo/bar/baz",
      en: "https://donation.watch/en/foo/bar/baz",
      nl: "https://donation.watch/nl/foo/bar/baz",
      lv: "https://donation.watch/lv/foo/bar/baz",
      et: "https://donation.watch/et/foo/bar/baz",
      hr: "https://donation.watch/hr/foo/bar/baz",
      no: "https://donation.watch/no/foo/bar/baz",
      uk: "https://donation.watch/uk/foo/bar/baz",
    },
  });
});

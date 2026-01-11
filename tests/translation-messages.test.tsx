/* eslint-disable @typescript-eslint/no-unused-vars */

import { test, expect } from "vitest";

import Cs from "../src/messages/cs";
import De from "../src/messages/de";
import En from "../src/messages/en";
import Et from "../src/messages/et";
import Hr from "../src/messages/hr";
import Lv from "../src/messages/lv";
import Nl from "../src/messages/nl";
import No from "../src/messages/no";

import type { ExtendsBoth } from "../src/utils/types";

test("all languages have all translations", () => {
  type CheckDe = ExtendsBoth<typeof De, typeof En>;
  type CheckNl = ExtendsBoth<typeof Nl, typeof En>;
  type CheckCs = ExtendsBoth<typeof Cs, typeof En>;
  type CheckLv = ExtendsBoth<typeof Lv, typeof En>;
  type CheckEt = ExtendsBoth<typeof Et, typeof En>;
  type CheckHr = ExtendsBoth<typeof Hr, typeof En>;
  type CheckNo = ExtendsBoth<typeof No, typeof En>;

  expect(true).toEqual(true);
});

// These are allowed to have mismatching variables
const allowedMismatchingVariables = new Set(["origin.elsewhere.title"]);

const extractTemplateVariables = (
  translations: Record<string, unknown>,
  path: string = "",
  variables: Record<string, string[]> = {},
) => {
  Object.entries(translations).forEach(([key, value]) => {
    if (typeof value === "string") {
      const matchRegex = /\{([a-zA-Z0-9]+)}/g;
      let match: RegExpExecArray | null;
      while ((match = matchRegex.exec(value))) {
        const keypath = `${path}${key}`;
        if (allowedMismatchingVariables.has(keypath)) continue;

        variables[keypath] ??= [];
        variables[keypath].push(`${match[1]}`);
        // Note: this is pretty stupid in regard to perf, but it's just a test
        variables[keypath] = variables[keypath].toSorted();
      }
    } else {
      extractTemplateVariables(
        value as Record<string, unknown>,
        `${path}${key}.`,
        variables,
      );
    }
  });

  return variables;
};

test("all languages variables match", () => {
  expect(extractTemplateVariables(En), "German variables match").toEqual(
    extractTemplateVariables(De),
  );
  expect(extractTemplateVariables(En), "Dutch variables match").toEqual(
    extractTemplateVariables(Nl),
  );
  expect(extractTemplateVariables(En), "Czech variables match").toEqual(
    extractTemplateVariables(Cs),
  );
  expect(extractTemplateVariables(En), "Latvian variables match").toEqual(
    extractTemplateVariables(Lv),
  );
  expect(extractTemplateVariables(En), "Estonian variables match").toEqual(
    extractTemplateVariables(Et),
  );
  expect(extractTemplateVariables(En), "Croatian variables match").toEqual(
    extractTemplateVariables(Hr),
  );
  expect(extractTemplateVariables(En), "Norwegian variables match").toEqual(
    extractTemplateVariables(No),
  );
});

import { checkbox } from "@inquirer/prompts";
import assert from "assert";
import fs from "fs/promises";

import {
  COUNTRIES,
  COUNTRY_CONFIG,
  countryCodesToCountry,
} from "@/utils/countries";

// Non-interactive override for scripting/agents: skips the checkbox prompt entirely.
// Example: COUNTRIES=ZA,SE pnpm run data:rebuild:cached
export const promptCountries = async (
  message: string,
  autoSelectAll: boolean = process.env["CI"] === "true",
) => {
  const envCountries = process.env["COUNTRIES"];
  if (envCountries) {
    return envCountries
      .split(",")
      .map((code) => code.trim().toUpperCase())
      .filter(Boolean)
      .map((code) => {
        const country = countryCodesToCountry[code];
        assert(country, `Unknown country code in COUNTRIES env var: ${code}`);
        return country;
      });
  }

  return autoSelectAll
    ? [...COUNTRIES]
    : await checkbox({
        message,
        required: true,
        choices: [...COUNTRIES]
          .toSorted((a, b) =>
            `${COUNTRY_CONFIG[a].code}`.localeCompare(
              `${COUNTRY_CONFIG[b].code}`,
            ),
          )
          .map((c) => ({
            name: `${COUNTRY_CONFIG[c].code} (${c})`,
            value: c,
            checked: true,
          })),
      });
};

// Non-interactive override for scripting/agents: skips the checkbox prompt entirely.
// Example: YEARS=2024,2025 pnpm run data:rebuild:cached, or YEARS=all for the full available range.
export const promptYears = async (
  message: string,
  years: string[],
  preselectedYears: string[] = [],
  autoSelectAll: boolean = process.env["CI"] === "true",
) => {
  const envYears = process.env["YEARS"];
  if (envYears) {
    if (envYears.trim().toLowerCase() === "all") return [...years];

    const selectedYears = envYears
      .split(",")
      .map((year) => year.trim())
      .filter(Boolean);
    selectedYears.forEach((year) =>
      assert(years.includes(year), `Unknown year in YEARS env var: ${year}`),
    );
    return selectedYears;
  }

  return autoSelectAll
    ? [...preselectedYears]
    : await checkbox({
        message,
        required: true,
        choices: [...years].map((y) => ({
          name: y,
          value: y,
          checked: preselectedYears.includes(y),
        })),
      });
};

export const jsonAsTsModule = (jsonString: string): string => {
  return `const data = JSON.parse(${JSON.stringify(jsonString)});export default data;`;
};

export const jsonAsTsModuleWithType = (
  jsonString: string,
  type: { name: string; import: string; as?: string },
): string => {
  return `${type.import}const data: ${type.name} = JSON.parse(${JSON.stringify(jsonString)})${type.as ? ` as ${type.as}` : ""};export default data;`;
};

export const writeIfChanged = async (
  file: string,
  content: string,
): Promise<boolean> => {
  // attempt to read file, if it doesn't exist return early
  let currentContent: string;

  try {
    currentContent = await fs.readFile(file, { encoding: "utf8" });
  } catch {
    currentContent = "";
  }

  if (currentContent === content) {
    return false;
  }

  await fs.writeFile(file, content, { encoding: "utf8" });

  return true;
};

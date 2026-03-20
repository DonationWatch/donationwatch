import { checkbox } from "@inquirer/prompts";
import fs from "fs/promises";

import { COUNTRIES, COUNTRY_CONFIG } from "@/utils/countries";

export const promptCountries = async (
  message: string,
  autoSelectAll: boolean = process.env["CI"] === "true",
) =>
  autoSelectAll
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

export const promptYears = async (
  message: string,
  years: string[],
  preselectedYears: string[] = [],
  autoSelectAll: boolean = process.env["CI"] === "true",
) =>
  autoSelectAll
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

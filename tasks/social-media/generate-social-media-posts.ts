import { exec } from "child_process";
import debug from "debug";
import {
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
  transpileModule,
} from "typescript";
import { promisify } from "util";

import type { CountryConfig } from "@/types/country-config";
import type { Currency } from "@/utils/countries";
import type { ConstLocale } from "@/utils/locales";
import type { Donation, ReceiverId } from "@/utils/types";

import { PartyField } from "@/types/party";
import { getParty, Country } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { Features, hasFeature } from "@/utils/features";
import { DonationField } from "@/utils/types";

import { getDonations } from "../data/load-donations";
import { promptCountries } from "../utils";

const log = debug(`generate-social-media-posts`);

debug.enable("*");

const execAsync = promisify(exec);

const countries = await promptCountries(
  "What country to generate a social media post for?",
);

const countryLanguage: Record<Country, ConstLocale | string> = {
  [Country.germany]: "de-DE",
  [Country.canada]: "en-CA",
  [Country.austria]: "de-AT",
  [Country.croatia]: "hr-HR",
  [Country.serbia]: "sr-RS",
  [Country.latvia]: "lv-LV",
  [Country.estonia]: "et-EE",
  [Country.australia]: "en-AU",
  [Country.europeanunion]: "en",
  [Country.czechrepublic]: "cs-CZ",
  [Country.switzerland]: "de-CH",
  [Country.unitedkingdom]: "en-GB",
  [Country.netherlands]: "nl-NL",
  [Country.georgia]: "ka-GE",
  [Country.norway]: "nb-NO",
  [Country.ukraine]: "uk-UA",
  [Country.france]: "fr-FR",
  [Country.sweden]: "sv-SE",
};

// Mapping of our countries to the "best" language in the url, that we support
const ourLanguage: Record<Country, ConstLocale> = {
  [Country.germany]: "de",
  [Country.canada]: "en",
  [Country.austria]: "de",
  [Country.croatia]: "hr",
  [Country.serbia]: "en",
  [Country.latvia]: "lv",
  [Country.estonia]: "et",
  [Country.australia]: "en",
  [Country.europeanunion]: "en",
  [Country.czechrepublic]: "cs",
  [Country.switzerland]: "de",
  [Country.unitedkingdom]: "en",
  [Country.netherlands]: "nl",
  [Country.georgia]: "en",
  [Country.norway]: "no",
  [Country.ukraine]: "uk",
  [Country.france]: "fr",
  [Country.sweden]: "en",
};

const getDonationsFromLastGitRevision = async (
  countryConfig: CountryConfig,
): Promise<Donation[]> => {
  log(`Fetching donations from last Git revision for ${countryConfig.code}`);

  const relativePath = `tasks/data/${countryConfig.code.toLowerCase()}/donations.ts`;

  // Get the file content from the previous Git revision
  const { stdout: tsContent } = await execAsync(
    `git show $(git log --format=%H --skip=1 -n 1 -- "${relativePath}"):${relativePath}`,
    { maxBuffer: 1024 * 1024 * 1024 }, // 20 MB buffer size
  );

  // Transpile TypeScript to JavaScript
  const result = transpileModule(tsContent, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2020,
      moduleResolution: ModuleResolutionKind.Node16,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
    },
  });

  // Execute the JavaScript code
  const moduleCode = result.outputText;
  const moduleExports: { default: Donation[] } = { default: [] };
  const moduleObject = { exports: moduleExports };

  // Create a function that executes the module code
  const moduleFunction = new Function("module", "exports", moduleCode);
  moduleFunction(moduleObject, moduleExports);

  return moduleObject.exports.default;
};

interface LLMUpdateContext {
  country: Country;
  currency: Currency;
  overallTotalNewFunds: number;
  parties: {
    partyName: string;
    metrics: {
      newDonationSum: number;
      newDonationCount?: number;
      averageDonation?: number;
      medianDonation?: number;
      topDonorConcentrationPercent?: number;
    };
    largestDonationsThisUpdate?: {
      donorName: string;
      amount: number;
      date: string;
    }[];
  }[];
}

const getMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
};

const calculatePartySums = (
  currentDonations: Donation[],
  lastDonations: Donation[],
  countryConfig: CountryConfig,
): LLMUpdateContext["parties"] => {
  const lastDonationIds = new Set(
    lastDonations.map((d) => d[DonationField.Id]),
  );

  const newDonations = currentDonations.filter(
    (d) => !lastDonationIds.has(d[DonationField.Id]),
  );

  const allPartyIds = new Set<ReceiverId>([
    ...currentDonations.map((d) => d[DonationField.Receiver]),
    ...lastDonations.map((d) => d[DonationField.Receiver]),
  ]);

  const partiesMetrics: LLMUpdateContext["parties"] = [];

  for (const partyId of allPartyIds) {
    const newDonationsForParty = newDonations.filter(
      (d) => d[DonationField.Receiver] === partyId,
    );

    const newDonationCount = newDonationsForParty.length;
    if (newDonationCount === 0) {
      continue;
    }

    const newDonationSum = newDonationsForParty.reduce(
      (sum, d) => sum + d[DonationField.Amount],
      0,
    );

    const party = getParty(countryConfig, partyId);
    const partyName = party ? party[PartyField.Name] : partyId;

    if (!hasFeature(countryConfig, Features.Donors)) {
      partiesMetrics.push({
        partyName,
        metrics: {
          newDonationSum,
        },
      });
    } else {
      const averageDonation =
        newDonationCount > 0 ? newDonationSum / newDonationCount : 0;

      const donationAmounts = newDonationsForParty.map(
        (d) => d[DonationField.Amount],
      );
      const medianDonation = getMedian(donationAmounts);

      const largestDonationsThisUpdate = [...newDonationsForParty]
        .sort((a, b) => b[DonationField.Amount] - a[DonationField.Amount])
        .slice(0, 5)
        .map((d) => ({
          donorName: d[DonationField.DonorName],
          amount: d[DonationField.Amount],
          date: d[DonationField.Date],
        }));

      // Top donor concentration (percentage of new funds from single largest donor, aggregated by donor name)
      const donorSums: Record<string, number> = {};
      for (const d of newDonationsForParty) {
        const name = d[DonationField.DonorName];
        donorSums[name] = (donorSums[name] || 0) + d[DonationField.Amount];
      }
      const maxDonorSum = Object.values(donorSums).reduce(
        (max, sum) => (sum > max ? sum : max),
        0,
      );
      const topDonorConcentrationPercent =
        newDonationSum > 0 ? (maxDonorSum / newDonationSum) * 100 : 0;

      partiesMetrics.push({
        partyName,
        metrics: {
          newDonationSum,
          newDonationCount,
          averageDonation,
          medianDonation,
          topDonorConcentrationPercent,
        },
        largestDonationsThisUpdate,
      });
    }
  }

  // Sort parties by newDonationSum descending
  return partiesMetrics.sort(
    (a, b) => b.metrics.newDonationSum - a.metrics.newDonationSum,
  );
};

const main = async () => {
  for (const country of countries) {
    const currentDonations = await getDonations(country);
    const countryConfig = await getCountryConfig(country);

    const getDonationsFromLastRevision =
      await getDonationsFromLastGitRevision(countryConfig);

    const lastDonationIds = new Set(
      getDonationsFromLastRevision.map((d) => d[DonationField.Id]),
    );

    const newDonations = currentDonations.filter(
      (d) => !lastDonationIds.has(d[DonationField.Id]),
    );

    const overallTotalNewFunds = newDonations.reduce(
      (sum, d) => sum + d[DonationField.Amount],
      0,
    );

    const partiesMetrics = calculatePartySums(
      currentDonations,
      getDonationsFromLastRevision,
      countryConfig,
    );

    const lang = countryLanguage[country];

    const llmContext: LLMUpdateContext = {
      country,
      currency: countryConfig.currency,
      overallTotalNewFunds,
      parties: partiesMetrics,
    };

    const prompt = `You are an automated, neutral AI social media content generator for donation.watch.
Generate a concise, high-quality social media post (e.g., for X/Twitter) in the local language of the country (${lang}) based on the following structured update payload:

${JSON.stringify(llmContext, null, 2)}

Instructions for Generation:
1. Be extremely concise, direct, and avoid any redundancy. Keep the post short and punchy.
2. Blend metrics naturally and ONLY mention them if they add useful, non-obvious context.
3. Handle single donation cases elegantly:
   - If a party has only 1 donation: Do NOT mention average or median values, and do NOT mention the "100% top donor concentration". Simply say: "[Party Name] received a single donation of [Amount] from [Donor Name] on [Date]."
4. Handle multiple donation cases concisely:
   - Blend metrics naturally into narrative sentences (e.g., "[Party Name] received €6,010 across 8 donations, with a median of €140.").
   - Explain donor concentration naturally (e.g. "A single donor, [Donor Name], contributed 83% of their new funds (€5,000)") ONLY when it is high (e.g. > 50%) and there are multiple donations.
5. Maintain strict neutrality, objectivity, and factual accuracy. donation.watch is an independent tracking platform.
6. Do not include any additional emojis other than the specified country flag
7. Avoid all typical AI slop, promotional buzzwords, verbosity, and stylistic indicators such as em dashes (—), exclamations, or lists of slogans.
8. Include appropriate hashtags (e.g. #donations, #transparency).
9. End with the link: https://donation.watch/${ourLanguage[countryConfig.id]}/${countryConfig.id}`;

    console.log("\n########################################");
    console.log(
      "### PROMPT FOR LLM GENERATION (" + countryConfig.code + ") ###",
    );
    console.log("########################################\n");
    console.log(prompt);
    console.log("\n########################################\n");
  }
};

main();

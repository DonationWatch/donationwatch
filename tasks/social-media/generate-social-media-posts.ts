import { exec } from "child_process";
import debug from "debug";
import { createTranslator } from "next-intl";
import {
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
  transpileModule,
} from "typescript";
import { promisify } from "util";

import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";
import type { StrictNamespacedTranslator } from "@/utils/translator";
import type { Donation, ReceiverId } from "@/utils/types";

import { PartyField } from "@/types/party";
import { Country, getCountryName, getParty } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { formatCompactCountryCurrency } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

import { getDonations } from "../data/load-donations";
import { promptCountries } from "../utils";
import { interpolate } from "./string";

const log = debug(`generate-social-media-posts`);

debug.enable("*");

const execAsync = promisify(exec);

const countries = await promptCountries(
  "What country to generate a social media post for?",
);

const PARTIES_TO_LIST_FULLY = 3;

const countryTranslations: Record<Country, ConstLocale> = {
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

const countryFlags: Record<Country, string> = {
  [Country.germany]: "🇩🇪",
  [Country.canada]: "🇨🇦",
  [Country.austria]: "🇦🇹",
  [Country.croatia]: "🇭🇷",
  [Country.serbia]: "🇷🇸",
  [Country.latvia]: "🇱🇻",
  [Country.estonia]: "🇪🇪",
  [Country.australia]: "🇦🇺",
  [Country.europeanunion]: "🇪🇺",
  [Country.czechrepublic]: "🇨🇿",
  [Country.switzerland]: "🇨🇭",
  [Country.unitedkingdom]: "🇬🇧",
  [Country.netherlands]: "🇳🇱",
  [Country.georgia]: "🇬🇪",
  [Country.norway]: "🇳🇴",
  [Country.ukraine]: "🇺🇦",
  [Country.france]: "🇫🇷",
  [Country.sweden]: "🇸🇪",
};

const deltaPrefix = (delta: number): string => (delta > 0 ? `+` : "");

const messageTranslations = {
  en: {
    title: "The donation data for {country} got refreshed:",
    line: "{receiver} {delta} ({count} donations, {sum})",
    hashtags: `#{country} #donations`,
    more: "and {otherParties} other parties {otherDelta} ({otherCount} donations)",
  },
  de: {
    title: "Die Spendendaten für {country} wurden aktualisiert:",
    line: "{receiver} {delta} ({count} Spenden, {sum})",
    hashtags: "#{country} #Spenden",
    more: "und {otherParties} weitere Parteien {otherDelta} ({otherCount} Spenden)",
  },
  cs: {
    title: "Údaje o darech pro {country} byly aktualizovány:",
    line: "{receiver} {delta} ({count} darů, {sum})",
    hashtags: `#{country} #dary`,
    more: "a {otherParties} dalších stran {otherDelta} ({otherCount} darů)",
  },
  nl: {
    title: "De donatiegegevens voor {country} zijn bijgewerkt:",
    line: "{receiver} {delta} ({count} donaties, {sum})",
    hashtags: `#{country} #donaties`,
    more: "en nog {otherParties} partijen {otherDelta} ({otherCount} donaties)",
  },
  lv: {
    title: "{country} ziedojumu dati ir atjaunināt:",
    line: "{receiver} {delta} ({count} ziedojumi, {sum})",
    hashtags: `#{country} #ziedojumi`,
    more: "un vēl {otherParties} partijas {otherDelta} ({otherCount} ziedojumi)",
  },
  et: {
    title: "{country} annetuste andmed on uuendatud:",
    line: "{receiver} {delta} ({count} annetust, {sum})",
    hashtags: `#{country} #annetused`,
    more: "ja veel {otherParties} parteid {otherDelta} ({otherCount} annetust)",
  },
  hr: {
    title: "Podaci o donacijama za {country} su ažurirani:",
    line: "{receiver} +{delta} (+{count} donacija, {sum})",
    hashtags: `#{country} #donacije`,
    more: "i još {otherParties} stranaka +{otherDelta} ({otherCount} donacija)",
  },
  no: {
    title: "Donasjonsdataene for {country} ble oppdatert:",
    line: "{receiver} {delta} ({count} donasjoner, {sum})",
    hashtags: `#{country} #donasjoner`,
    more: "og {otherParties} andre partier {otherDelta} ({otherCount} donasjoner)",
  },
  uk: {
    title: "Дані про пожертви для {country} оновлено:",
    line: "{receiver} {delta} ({count} пожертв, {sum})",
    hashtags: `#{country} #пожертви`,
    more: "та {otherParties} інших партій {otherDelta} ({otherCount} пожертв)",
  },
  fr: {
    title: "Les données de dons pour {country} ont été actualisées :",
    line: "{receiver} {delta} ({count} dons, {sum})",
    hashtags: "#{country} #financementpolitique #transparence",
    more: "et {otherParties} autres partis {otherDelta} ({otherCount} dons)",
  },
} satisfies Record<ConstLocale, unknown>;

const toHashTag = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/^[^a-z]+/, "");
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

type FlatPartySum = Record<
  string,
  {
    sum: number;
    count: number;
    delta: number;
  }
>;

const calculatePartySums = (donations: Donation[]): FlatPartySum => {
  return donations.reduce<FlatPartySum>((acc, donation) => {
    acc[donation[DonationField.Receiver]] ??= { sum: 0, count: 0, delta: 0 };
    acc[donation[DonationField.Receiver]].sum += donation[DonationField.Amount];
    acc[donation[DonationField.Receiver]].count++;

    return acc;
  }, {});
};

const main = async () => {
  for (const country of countries) {
    const currentDonations = await getDonations(country);
    const countryConfig = await getCountryConfig(country);

    const getDonationsFromLastRevision =
      await getDonationsFromLastGitRevision(countryConfig);

    const currentPartySums = calculatePartySums(currentDonations);
    const lastPartySums = calculatePartySums(getDonationsFromLastRevision);

    // calculate the difference
    const partySumsDiff: FlatPartySum = {};
    for (const partyId in currentPartySums) {
      const currentSum = currentPartySums[partyId];
      const lastSum = lastPartySums[partyId] || { sum: 0, count: 0 };

      partySumsDiff[partyId] = {
        sum: currentSum.sum,
        delta: currentSum.sum - lastSum.sum,
        count: currentSum.count - lastSum.count,
      };
    }

    const partyDiffs = Object.entries(partySumsDiff)
      .filter(([, data]) => data.delta !== 0)
      .toSorted(([, a], [, b]) => b.delta - a.delta);

    log("Found party diffs:", partyDiffs);

    const lang = countryTranslations[country];

    const messages = await import(`../../src/messages/${lang}.json`, {
      with: { type: "json" },
    }).then((mod) => mod.default);

    const tCountries: StrictNamespacedTranslator<"countries"> =
      createTranslator({
        locale: lang,
        messages,
        namespace: "countries",
      });

    let message = `${countryFlags[countryConfig.id]} ${interpolate(
      messageTranslations[lang].title,
      {
        country: getCountryName(countryConfig, tCountries),
      },
    )}\n`;

    partyDiffs.slice(0, PARTIES_TO_LIST_FULLY).forEach(([receiver, data]) => {
      message += `- ${interpolate(messageTranslations[lang].line, {
        receiver: getParty(countryConfig, receiver as ReceiverId)[
          PartyField.Short
        ],
        delta:
          deltaPrefix(data.delta) +
          formatCompactCountryCurrency(lang, data.delta, countryConfig),
        count: deltaPrefix(data.count) + data.count,
        sum: formatCompactCountryCurrency(lang, data.sum, countryConfig),
      })}\n`;
    });

    if (partyDiffs.length > PARTIES_TO_LIST_FULLY) {
      const otherParties = partyDiffs.slice(PARTIES_TO_LIST_FULLY);
      let otherDelta = 0;
      let otherCount = 0;
      otherParties.forEach(([, data]) => {
        otherDelta += data.delta;
        otherCount += data.count;
      });

      message += `${interpolate(messageTranslations[lang].more, {
        otherParties: otherParties.length,
        otherDelta:
          deltaPrefix(otherDelta) +
          formatCompactCountryCurrency(lang, otherDelta, countryConfig),
        otherCount: deltaPrefix(otherCount) + otherCount,
      })}`;
    }

    message += `\n${interpolate(messageTranslations[lang].hashtags, {
      country: toHashTag(getCountryName(countryConfig, tCountries)),
    })}`;

    message += `\nhttps://donation.watch/${lang}/${countryConfig.id}`;

    console.log("\n###\n");
    console.log(message);
    console.log("\n###\n");
  }
};

main();

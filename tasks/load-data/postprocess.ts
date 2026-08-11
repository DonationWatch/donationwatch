import assert from "assert";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { PartyStats } from "@/types/party-stats";
import type { CountryCode, Currency } from "@/utils/countries";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type {
  Donation,
  DonorMeta,
  DonorMetaDefinition,
  DonorMetaRelation,
} from "@/utils/types";

import { PartyField } from "@/types/party";
import { PartyStatField } from "@/types/party-stats";
import { firstItem, lastItem } from "@/utils/array";
import {
  BIGGEST_DONATIONS_COUNT,
  DONOR_ID_HASH_LEN,
  MOST_RECENT_HISTORY_SIZE,
} from "@/utils/config";
import { Country, COUNTRIES } from "@/utils/countries";
import { getCountryConfig } from "@/utils/data/get-country-config";
import { getHistory } from "@/utils/data/get-history";
import { donationYear } from "@/utils/date";
import { getWikiArticles } from "@/utils/loader/wiki";
import { sumPartySums } from "@/utils/math";
import { getLongName } from "@/utils/party";
import { donationDateSorter } from "@/utils/sort";
import { DonationField } from "@/utils/types";

import { getDonations } from "../data/load-donations";
import { jsonAsTsModule, jsonAsTsModuleWithType } from "../utils";
import {
  donationsToDonationsDocumentWithDonorIds,
  donationsToDonationsDocumentWithoutDonorIds,
  hash,
} from "./util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildMostRecentDonations = (
  country: CountryConfig,
  donations: Donation[],
) => {
  return getHistory(country, donations)
    .filter((entry) => entry.date)
    .toSorted((a, b) =>
      donationDateSorter(
        {
          [DonationField.Date]: a.date,
          [DonationField.Id]: a.id,
          idx: a.id,
        },
        {
          [DonationField.Date]: b.date,
          [DonationField.Id]: b.id,
          idx: b.id,
        },
      ),
    )
    .toReversed()
    .slice(0, MOST_RECENT_HISTORY_SIZE)
    .toSorted((a, b) =>
      donationDateSorter(
        {
          [DonationField.Date]: a.date,
          [DonationField.Id]: a.id,
          idx: a.id,
        },
        {
          [DonationField.Date]: b.date,
          [DonationField.Id]: b.id,
          idx: b.id,
        },
      ),
    )
    .toReversed();
};

const getPartiesForCountry = async (country: Country): Promise<Party[]> => {
  const partiesModule = await import(`../../src/data/${country}/parties.ts`);
  return partiesModule.default;
};

const buildPartySums = (
  country: CountryConfig,
  parties: Party[],
  donations: Donation[],
) => {
  const result: PartyYearsSums = {};

  const rawSums: Record<
    string,
    Record<
      string,
      {
        sum: number;
        count: number;
        lastDonation: string;
        hasYearOnlyDonations?: boolean;
      }
    >
  > = {};

  const yearsSet = new Set(country.years);
  const partiesSet = new Set(parties.map((p) => p[PartyField.Id]));

  donations.forEach((donation) => {
    const year = donationYear(donation);
    if (!yearsSet.has(year)) return;
    const receiver = donation[DonationField.Receiver];
    if (!partiesSet.has(receiver)) return;

    rawSums[year] ??= {};
    rawSums[year][receiver] ??= {
      sum: 0,
      count: 0,
      lastDonation: donation[DonationField.Date],
    };

    if (donation[DonationField.Date].length === 4) {
      rawSums[year][receiver].hasYearOnlyDonations = true;
    }

    rawSums[year][receiver].sum += donation[DonationField.Amount];
    rawSums[year][receiver].count++;
    if (rawSums[year][receiver].lastDonation < donation[DonationField.Date]) {
      rawSums[year][receiver].lastDonation = donation[DonationField.Date];
    }
  });

  country.years.forEach((year) => {
    const partyStatsForYear: Record<string, PartyStats> = {};
    const activeParties = parties.filter(
      (party: Party) =>
        firstItem(party[PartyField.Years]) <= year &&
        year <= lastItem(party[PartyField.Years]),
    );

    activeParties.forEach((party) => {
      const stats = rawSums[year]?.[party[PartyField.Id]];
      if (stats) {
        partyStatsForYear[party[PartyField.Id]] = {
          [PartyStatField.Sum]: stats.sum,
          [PartyStatField.Count]: stats.count,
          [PartyStatField.LastDonation]: stats.lastDonation,
          ...(stats.hasYearOnlyDonations
            ? { [PartyStatField.HasYearOnlyDonations]: true }
            : {}),
        };
      }
    });
    result[year] = partyStatsForYear;
  });

  return result;
};

const buildBiggestDonors = (country: CountryConfig, donations: Donation[]) => {
  const result: Record<
    string,
    { name: string; sum: number; partyYearSums: PartyYearsSums }
  > = {};
  const amount = 30;

  donations.forEach((donation) => {
    const year = donationYear(donation);
    const donorId = hash(donation[DonationField.DonorName]);
    result[donorId] ??= {
      sum: 0,
      name: donation[DonationField.DonorName],
      partyYearSums: {},
    };
    result[donorId].sum += donation[DonationField.Amount];

    result[donorId].partyYearSums ??= {};
    result[donorId].partyYearSums[year] ??= {};
    result[donorId].partyYearSums[year][donation[DonationField.Receiver]] ??= {
      [PartyStatField.Sum]: 0,
      [PartyStatField.Count]: 0,
      [PartyStatField.LastDonation]: donation[DonationField.Date],
    };

    result[donorId].partyYearSums[year][donation[DonationField.Receiver]][
      PartyStatField.Sum
    ] += donation[DonationField.Amount];
    result[donorId].partyYearSums[year][donation[DonationField.Receiver]][
      PartyStatField.Count
    ]++;
  });

  return Object.entries(result)
    .toSorted(([, a], [, b]) => b.sum - a.sum)
    .slice(0, amount)
    .map(([id, { name, sum, partyYearSums }]) => ({
      id,
      name,
      sum,
      partyYearSums,
    }));
};

const buildBiggestDonations = (
  country: CountryConfig,
  donations: Donation[],
) => {
  return donations
    .toSorted((a, b) => b[DonationField.Amount] - a[DonationField.Amount])
    .slice(0, BIGGEST_DONATIONS_COUNT);
};

const prebuildWikipediaJsons = async (country: CountryConfig) => {
  const publicDataDir = path.join(__dirname, "../../public/data", country.id);
  const byPageId = path.join(publicDataDir, "wikipedia/by-pageId");

  await fs.mkdir(byPageId, { recursive: true });

  const { articles } = await getWikiArticles(country.id);

  for (const [pageId, article] of Object.entries(articles)) {
    await fs.writeFile(
      path.join(byPageId, `${pageId}.json`),
      JSON.stringify({ extract: article }),
    );
  }
};

const buildDataIndex = async (countries: Country[]) => {
  const dataDir = path.join(__dirname, "../../public/data");

  // load all country configs
  const configs: {
    id: Country;
    currency: Currency;
    years: string[];
    parties: { id: string; name: string }[];
  }[] = [];

  for (const country of countries) {
    const config = await getCountryConfig(country);
    const parties = await getPartiesForCountry(country);
    configs.push({
      id: country,
      currency: config.currency,
      years: config.years,
      parties: parties.map((p) => ({
        id: p[PartyField.Id],
        name: getLongName(p),
      })),
    });
  }

  await fs.writeFile(
    path.join(dataDir, `index.json`),
    JSON.stringify({
      last_updated: new Date().toISOString(),
      configs,
    }),
  );
};

const postprocessGeojson = async () => {
  const publicDataDir = path.join(__dirname, "../../public/geojson");

  await fs.mkdir(publicDataDir, { recursive: true });

  for (const file of ["europe.ts", "austria.ts", "germany.ts", "canada.ts"]) {
    const content = await import(`./geojson/${file}`).then(
      (module) => module.default,
    );
    await fs.writeFile(
      path.join(publicDataDir, file),
      jsonAsTsModule(JSON.stringify(content)),
    );
  }
};

const prebuildStaticNormalizationJsons = async (country: CountryConfig) => {
  const dataDir = path.join(__dirname, "../../public/data", country.id);
  const transparencyPath = path.join(
    __dirname,
    `../data/${country.code.toLowerCase()}/transparency.ts`,
  );
  const {
    default: normalized,
  }: {
    default: {
      filteredDonors: string[];
      normalizedDonors: Record<string, string[]>;
    };
  } = await import(transparencyPath);

  await fs.writeFile(
    path.join(dataDir, "normalized.json"),
    JSON.stringify(normalized),
  );
};

const prebuiltDonorIds = async (
  country: CountryConfig,
  donations: Donation[],
) => {
  const publicDataDir = path.join(__dirname, "../../public/data", country.id);
  const fileName = path.join(publicDataDir, "donor-ids.json");
  const donorSums: Record<string, number> = {};

  donations.forEach((donation) => {
    donorSums[donation[DonationField.DonorName]] ??= 0;
    donorSums[donation[DonationField.DonorName]] +=
      donation[DonationField.Amount];
  });

  await fs.writeFile(
    fileName,
    JSON.stringify({
      donors: Object.entries(donorSums)
        .toSorted(([, a], [, b]) => b - a)
        .map(([id]) => id),
    }),
  );
};

const prebuildDonorMeta = async (
  country: CountryConfig,
  donations: Donation[],
) => {
  const donorMetaDir = path.join(
    __dirname,
    "../../public/data",
    country.id,
    "donor-meta",
  );

  await fs.mkdir(donorMetaDir, { recursive: true });

  const donorMetaPath = path.join(
    __dirname,
    `../data/${country.code.toLowerCase()}/donor-meta.ts`,
  );
  const { default: donorMeta }: { default: DonorMetaDefinition } = await import(
    donorMetaPath
  );
  const processedMeta: Record<string, DonorMeta> = {};

  const relationDonors = new Set<string>();

  donorMeta.relations?.forEach((relations) => {
    relations.forEach((rel) => relationDonors.add(rel[0]));
  });

  // [donor, sums]
  const donorPartySums: Record<string, PartyYearsSums> = {};

  donations.forEach((donation) => {
    const receiver = donation[DonationField.Receiver];
    const donor = donation[DonationField.DonorName];

    if (!relationDonors.has(donor)) {
      return;
    }

    const year = donationYear(donation);
    donorPartySums[donor] ??= {};
    donorPartySums[donor][year] ??= {};
    donorPartySums[donor][year][receiver] ??= {
      [PartyStatField.Sum]: 0,
      [PartyStatField.Count]: 0,
      [PartyStatField.LastDonation]: donation[DonationField.Date],
    };

    donorPartySums[donor][year][donation[DonationField.Receiver]][
      PartyStatField.Sum
    ] += donation[DonationField.Amount];
    donorPartySums[donor][year][donation[DonationField.Receiver]][
      PartyStatField.Count
    ]++;
    if (
      donorPartySums[donor][year][donation[DonationField.Receiver]][
        PartyStatField.LastDonation
      ] < donation[DonationField.Date]
    ) {
      donorPartySums[donor][year][donation[DonationField.Receiver]][
        PartyStatField.LastDonation
      ] = donation[DonationField.Date];
    }
  });

  // populate relations
  donorMeta.relations?.forEach((entries) => {
    entries.forEach(([donor]) => {
      assert(
        donorPartySums[donor],
        `Relation uses donor that has no sums: ${donor}`,
      );

      processedMeta[donor] ??= {};
      processedMeta[donor].relations ??= [];

      // add all other donors in the relation for that donor
      processedMeta[donor].relations.push(
        ...entries
          .filter((entry) => entry[0] !== donor)
          .map((entry): DonorMetaRelation => [
            ...entry,
            donorPartySums[entry[0]],
          ])
          .toSorted(
            ([, , sumsA], [, , sumsB]) =>
              sumPartySums(sumsB) - sumPartySums(sumsA),
          ),
      );
    });
  });

  // populate singular donor metadata
  Object.entries(donorMeta.donors).forEach(([donor, meta]) => {
    if (Object.keys(meta).length === 0) {
      // skip empty meta
      return;
    }

    processedMeta[donor] ??= {};
    if (meta.wiki) {
      processedMeta[donor].wiki = meta.wiki;
    }
  });

  for (const [donor, meta] of Object.entries(processedMeta)) {
    if (Object.keys(meta).length === 0) {
      // skip empty meta
      continue;
    }

    const fileName = path.join(donorMetaDir, `${hash(donor)}.json`);

    await fs.writeFile(fileName, JSON.stringify(meta));
  }
};

const prebuildStaticDonationJsons = async (
  country: CountryConfig,
  parties: Party[],
  donations: Donation[],
) => {
  const publicDataDir = path.join(__dirname, "../../public/data", country.id);
  const byYearDataDir = path.join(publicDataDir, "donations/by-year");
  const byPartyDataDir = path.join(publicDataDir, "donations/by-party");
  const byDonorHashDataDir = path.join(publicDataDir, "donations/by-donor");

  await fs.mkdir(byYearDataDir, { recursive: true });
  await fs.mkdir(byPartyDataDir, { recursive: true });
  await fs.mkdir(byDonorHashDataDir, { recursive: true });

  const perYear: Record<string, Donation[]> = {};
  const perParty: Record<string, Donation[]> = {};
  const perDonorHash: Record<string, Donation[]> = {};

  country.years.forEach((year) => {
    perYear[year] ??= [];
  });
  parties.forEach((party) => {
    perParty[party[PartyField.Id]] ??= [];
  });

  for (const donation of donations) {
    const donorId = hash(donation[DonationField.DonorName]);
    perYear[donationYear(donation)].push(donation);
    if (!perParty[donation[DonationField.Receiver]]) {
      console.log(
        "No party found for donation",
        donation[DonationField.Receiver],
        donation,
      );
    }
    perParty[donation[DonationField.Receiver]].push(donation);

    const shortDonorHash = donorId.substring(0, DONOR_ID_HASH_LEN);
    perDonorHash[shortDonorHash] ??= [];
    perDonorHash[shortDonorHash].push(donation);
  }

  await Promise.all([
    Object.entries(perYear).map(([year, donations]) =>
      fs.writeFile(
        path.join(byYearDataDir, `${year}.json`),
        JSON.stringify(donationsToDonationsDocumentWithoutDonorIds(donations)),
      ),
    ),
    Object.entries(perParty).map(([party, donations]) =>
      fs.writeFile(
        path.join(byPartyDataDir, `${party}.json`),
        JSON.stringify(donationsToDonationsDocumentWithoutDonorIds(donations)),
      ),
    ),
    Object.entries(perDonorHash).map(([hash, donations]) =>
      fs.writeFile(
        path.join(byDonorHashDataDir, `${hash}.json`),
        JSON.stringify(donationsToDonationsDocumentWithDonorIds(donations)),
      ),
    ),
  ]);
};

const postprocess = async (
  countryConfig: CountryConfig,
  donations: Donation[],
) => {
  const parties = await getPartiesForCountry(countryConfig.id);
  const dataDir = path.join(__dirname, "../../src/data", countryConfig.id);

  await Promise.all([
    fs.writeFile(
      path.join(dataDir, "most-recent.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildMostRecentDonations(countryConfig, donations)),
        {
          name: "HistoryEntry[]",
          as: "HistoryEntry[]",
          import:
            'import type {HistoryEntry} from "../../utils/data/get-history";',
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "party-sums.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildPartySums(countryConfig, parties, donations)),
        {
          name: "PartyYearsSums",
          import:
            "import {PartyYearsSums} from '../../utils/loader/party-years-sums';",
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "biggest-donors.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildBiggestDonors(countryConfig, donations)),
        {
          name: "BigDonor[]",
          import: "import {BigDonor} from '../../utils/loader/biggest-donors';",
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "biggest-donations.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildBiggestDonations(countryConfig, donations)),
        {
          name: "Donation[]",
          import: "import {Donation} from '../../utils/types';",
        },
      ),
    ),
  ]);

  const publicDataDir = path.join(
    __dirname,
    "../../public/data",
    countryConfig.id,
  );
  await fs.rm(publicDataDir, { force: true, recursive: true });
  await fs.mkdir(publicDataDir, { recursive: true });

  await Promise.all([
    prebuildStaticDonationJsons(countryConfig, parties, donations),
    prebuiltDonorIds(countryConfig, donations),
    prebuildWikipediaJsons(countryConfig),
    prebuildStaticNormalizationJsons(countryConfig),
    prebuildDonorMeta(countryConfig, donations),
  ]);
};

const countries: CountryCode[] = [
  "AT",
  "CH",
  "DE",
  "NL",
  "EU",
  "EE",
  "CZ",
  "LV",
  "AU",
  "UK",
  "RS",
  "HR",
  "CA",
  "GE",
  "NO",
  "UA",
  "FR",
  "SE",
  "ZA",
];
const codeCountry: Record<CountryCode, Country> = {
  DE: Country.germany,
  CH: Country.switzerland,
  AT: Country.austria,
  NL: Country.netherlands,
  EU: Country.europeanunion,
  EE: Country.estonia,
  CZ: Country.czechrepublic,
  LV: Country.latvia,
  AU: Country.australia,
  UK: Country.unitedkingdom,
  RS: Country.serbia,
  HR: Country.croatia,
  CA: Country.canada,
  GE: Country.georgia,
  NO: Country.norway,
  UA: Country.ukraine,
  FR: Country.france,
  SE: Country.sweden,
  ZA: Country.southafrica,
};
const main = async () => {
  await Promise.all(
    countries.map(async (countryCode) => {
      const country = codeCountry[countryCode];
      const [countryConfig, countryDonations] = await Promise.all([
        getCountryConfig(country),
        getDonations(country),
      ]);

      return postprocess(countryConfig, countryDonations);
    }),
  );

  await buildDataIndex([...COUNTRIES]);
  await postprocessGeojson();
};

main();

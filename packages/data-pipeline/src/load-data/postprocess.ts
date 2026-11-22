import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { DonorInterestAttribution } from "@donationwatch/core/types/interests";
import type { Party } from "@donationwatch/core/types/party";
import type { PartyStats } from "@donationwatch/core/types/party-stats";
import type { TransparencyData } from "@donationwatch/core/types/transparency";
import type {
  CountryCode,
  Currency,
} from "@donationwatch/core/utils/countries";
import type {
  Donation,
  DonorMeta,
  DonorMetaDefinition,
  DonorMetaRelation,
} from "@donationwatch/core/utils/types";
import type {
  GlobalBiggestDonation,
  GlobalBiggestDonor,
} from "@donationwatch/data/loader/global-biggest-donations";
import type { CountryPartyDonorStats } from "@donationwatch/data/loader/party-donor-stats";
import type { PartyYearsSums } from "@donationwatch/data/loader/party-years-sums";

import { PartyField } from "@donationwatch/core/types/party";
import { PartyStatField } from "@donationwatch/core/types/party-stats";
import { firstItem, lastItem } from "@donationwatch/core/utils/array";
import {
  ANONYMIZED_DONOR_KEYWORD,
  BIGGEST_DONATIONS_COUNT,
  DONOR_ID_HASH_LEN,
  DONOR_TO_PARTY_BY_YEAR,
  GLOBAL_BIGGEST_DONATIONS_COUNT,
  GLOBAL_BIGGEST_DONORS_COUNT,
  MOST_RECENT_HISTORY_SIZE,
  REDACTED_DONOR_KEYWORD,
} from "@donationwatch/core/utils/config";
import { Country, COUNTRIES } from "@donationwatch/core/utils/countries";
import { convertToEur } from "@donationwatch/core/utils/currency";
import { donationYear } from "@donationwatch/core/utils/date";
import { sumPartySums } from "@donationwatch/core/utils/math";
import { getLongName } from "@donationwatch/core/utils/party";
import { donationDateSorter } from "@donationwatch/core/utils/sort";
import {
  DonationField,
  DonationType,
  DonorType,
} from "@donationwatch/core/utils/types";
import { getWikiArticles } from "@donationwatch/data/loader/wiki";
import { getCountryConfig } from "@donationwatch/data/queries/get-country-config";
import { getHistory } from "@donationwatch/data/queries/get-history";
import { computePartyDonorStats } from "@donationwatch/data/queries/get-party-donor-stats";
import assert from "assert";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { getDonations } from "../load-donations";
import { DATA_COUNTRIES_DIR, WEB_PUBLIC_DIR } from "../paths";
import { jsonAsTsModuleWithType } from "../utils";
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
  const partiesModule = await import(
    `../../../../packages/data/src/countries/${country}/parties.ts`
  );
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

const buildPartyDonorStats = (
  parties: Party[],
  donations: Donation[],
): CountryPartyDonorStats => {
  const perParty: Record<string, Donation[]> = {};
  for (const party of parties) {
    perParty[party[PartyField.Id]] = [];
  }
  for (const donation of donations) {
    const receiver = donation[DonationField.Receiver];
    if (perParty[receiver]) {
      perParty[receiver].push(donation);
    }
  }

  const result: CountryPartyDonorStats = {};
  for (const party of parties) {
    const partyId = party[PartyField.Id];
    const stats = computePartyDonorStats(partyId, perParty[partyId] ?? []);
    if (stats) {
      result[partyId] = stats;
    }
  }

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

const buildWikiDonors = (
  country: CountryConfig,
  donations: Donation[],
  donorMeta?: DonorMetaDefinition,
) => {
  if (!donorMeta?.donors) return [];

  const result: Record<
    string,
    { name: string; sum: number; partyYearSums: PartyYearsSums }
  > = {};

  const wikiDonorNames = new Set(
    Object.entries(donorMeta.donors)
      .filter(([, meta]) => meta.wiki)
      .map(([name]) => name),
  );

  donations.forEach((donation) => {
    const donorName = donation[DonationField.DonorName];
    if (!wikiDonorNames.has(donorName)) return;

    const year = donationYear(donation);
    const donorId = hash(donorName);
    result[donorId] ??= {
      sum: 0,
      name: donorName,
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

  return Object.entries(result).map(([id, { name, sum, partyYearSums }]) => ({
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

class GlobalBiggestDataBuilder {
  private donorSums = new Map<
    string,
    {
      donor: string;
      donorId: string;
      country: Country;
      currency: Currency;
      sum: number;
      donationCount: number;
    }
  >();
  private donorMaxDonations = new Map<string, GlobalBiggestDonation>();

  public processCountryDonations(
    countryConfig: CountryConfig,
    donations: Donation[],
  ) {
    for (const donation of donations) {
      const donorName = donation[DonationField.DonorName];
      if (
        !donorName ||
        donorName.startsWith(DONOR_TO_PARTY_BY_YEAR) ||
        donorName.startsWith(REDACTED_DONOR_KEYWORD) ||
        donorName.startsWith(ANONYMIZED_DONOR_KEYWORD)
      ) {
        continue;
      }
      if (
        donation[DonationField.DonationType] === DonationType.PublicFunds ||
        donation[DonationField.DonorType] === DonorType.PublicFund
      ) {
        continue;
      }

      const amount = donation[DonationField.Amount];
      const amountInEur = convertToEur(amount, countryConfig.currency);
      const donorId = hash(donorName);
      const donorKey = `${countryConfig.id}:${donorId}`;

      const currentMax = this.donorMaxDonations.get(donorKey);
      if (!currentMax || amountInEur > currentMax.amountInEur) {
        this.donorMaxDonations.set(donorKey, {
          id: donation[DonationField.Id],
          donor: donorName,
          donorId,
          country: countryConfig.id,
          party: donation[DonationField.Receiver],
          amount,
          currency: countryConfig.currency,
          amountInEur,
          date: donation[DonationField.Date],
          ...(donation[DonationField.DonorType] !== undefined
            ? { donorType: donation[DonationField.DonorType] }
            : {}),
        });
      }

      const existing = this.donorSums.get(donorKey) || {
        donor: donorName,
        donorId,
        country: countryConfig.id,
        currency: countryConfig.currency,
        sum: 0,
        donationCount: 0,
      };

      existing.sum += amount;
      existing.donationCount += 1;
      this.donorSums.set(donorKey, existing);
    }
  }

  public async writeFiles() {
    const topDonations = Array.from(this.donorMaxDonations.values())
      .sort((a, b) => b.amountInEur - a.amountInEur)
      .slice(0, GLOBAL_BIGGEST_DONATIONS_COUNT);

    const topDonors: GlobalBiggestDonor[] = Array.from(this.donorSums.values())
      .map((item) => ({
        donor: item.donor,
        donorId: item.donorId,
        country: item.country,
        currency: item.currency,
        sum: item.sum,
        sumInEur: convertToEur(item.sum, item.currency),
        donationCount: item.donationCount,
      }))
      .sort((a, b) => b.sumInEur - a.sumInEur)
      .slice(0, GLOBAL_BIGGEST_DONORS_COUNT);

    const globalDataDir = path.join(DATA_COUNTRIES_DIR, "global");
    await fs.mkdir(globalDataDir, { recursive: true });

    await Promise.all([
      fs.writeFile(
        path.join(globalDataDir, "biggest-donations.ts"),
        jsonAsTsModuleWithType(JSON.stringify(topDonations), {
          name: "GlobalBiggestDonation[]",
          import:
            "import type {GlobalBiggestDonation} from '../../loader/global-biggest-donations';",
        }),
      ),
      fs.writeFile(
        path.join(globalDataDir, "biggest-donors.ts"),
        jsonAsTsModuleWithType(JSON.stringify(topDonors), {
          name: "GlobalBiggestDonor[]",
          import:
            "import type {GlobalBiggestDonor} from '../../loader/global-biggest-donations';",
        }),
      ),
    ]);
  }
}

const prebuildWikipediaJsons = async (country: CountryConfig) => {
  const publicDataDir = path.join(WEB_PUBLIC_DIR, "data", country.id);
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
  const dataDir = path.join(WEB_PUBLIC_DIR, "data");

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
  const publicDataDir = path.join(WEB_PUBLIC_DIR, "geojson");

  await fs.mkdir(publicDataDir, { recursive: true });

  for (const name of [
    "europe",
    "austria",
    "germany",
    "canada",
    "unitedstates",
  ]) {
    const content = await import(`./geojson/${name}.ts`).then(
      (module) => module.default,
    );
    await fs.writeFile(
      path.join(publicDataDir, `${name}.json`),
      JSON.stringify(content),
    );
  }
};

const prebuildStaticNormalizationJsons = async (country: CountryConfig) => {
  const dataDir = path.join(WEB_PUBLIC_DIR, "data", country.id);
  const transparencyPath = path.join(
    __dirname,
    `../data/${country.code.toLowerCase()}/transparency.ts`,
  );
  const {
    default: normalized,
  }: {
    default: TransparencyData;
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
  const publicDataDir = path.join(WEB_PUBLIC_DIR, "data", country.id);
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
  donorMeta: DonorMetaDefinition,
) => {
  const donorMetaDir = path.join(
    WEB_PUBLIC_DIR,
    "data",
    country.id,
    "donor-meta",
  );

  await fs.mkdir(donorMetaDir, { recursive: true });

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
    if (meta.interests) {
      processedMeta[donor].interests = meta.interests;
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
  const publicDataDir = path.join(WEB_PUBLIC_DIR, "data", country.id);
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
    ...Object.entries(perYear).map(([year, donations]) =>
      fs.writeFile(
        path.join(byYearDataDir, `${year}.json`),
        JSON.stringify(donationsToDonationsDocumentWithoutDonorIds(donations)),
      ),
    ),
    ...Object.entries(perParty).map(([party, donations]) =>
      fs.writeFile(
        path.join(byPartyDataDir, `${party}.json`),
        JSON.stringify(donationsToDonationsDocumentWithoutDonorIds(donations)),
      ),
    ),
    ...Object.entries(perDonorHash).map(([hash, donations]) =>
      fs.writeFile(
        path.join(byDonorHashDataDir, `${hash}.json`),
        JSON.stringify(donationsToDonationsDocumentWithDonorIds(donations)),
      ),
    ),
  ]);
};

const buildDonorInterests = (
  donorMeta: DonorMetaDefinition,
): Record<string, DonorInterestAttribution[]> => {
  const result: Record<string, DonorInterestAttribution[]> = {};
  for (const [donor, meta] of Object.entries(donorMeta.donors)) {
    if (meta.interests && meta.interests.length > 0) {
      result[donor] = meta.interests;
    }
  }
  return result;
};

const postprocess = async (
  countryConfig: CountryConfig,
  donations: Donation[],
) => {
  const donorMetaPath = path.join(
    __dirname,
    `../data/${countryConfig.code.toLowerCase()}/donor-meta.ts`,
  );
  const { default: donorMeta }: { default: DonorMetaDefinition } = await import(
    donorMetaPath
  );
  const sourceDonorMetaPath = path.join(
    __dirname,
    `./${countryConfig.code.toLowerCase()}/donor-meta.ts`,
  );
  let sourceDonorMeta = donorMeta;
  try {
    const mod: { donorMeta?: DonorMetaDefinition } = await import(
      sourceDonorMetaPath
    );
    if (mod.donorMeta) {
      sourceDonorMeta = mod.donorMeta;
    }
  } catch {
    // Fall back to prebuilt donorMeta if load-data/<cc>/donor-meta.ts is absent
  }
  const donorInterests = buildDonorInterests(sourceDonorMeta);
  const parties = await getPartiesForCountry(countryConfig.id);
  const dataDir = path.join(DATA_COUNTRIES_DIR, countryConfig.id);

  await Promise.all([
    fs.writeFile(
      path.join(dataDir, "most-recent.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildMostRecentDonations(countryConfig, donations)),
        {
          name: "HistoryEntry[]",
          as: "HistoryEntry[]",
          import:
            'import type {HistoryEntry} from "../../queries/get-history";',
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
            "import type {PartyYearsSums} from '../../loader/party-years-sums';",
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "party-donor-stats.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildPartyDonorStats(parties, donations)),
        {
          name: "CountryPartyDonorStats",
          import:
            "import type {CountryPartyDonorStats} from '../../loader/party-donor-stats';",
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "biggest-donors.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildBiggestDonors(countryConfig, donations)),
        {
          name: "BigDonor[]",
          import: "import type {BigDonor} from '../../loader/biggest-donors';",
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "wiki-donors.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildWikiDonors(countryConfig, donations, donorMeta)),
        {
          name: "BigDonor[]",
          import: "import type {BigDonor} from '../../loader/biggest-donors';",
        },
      ),
    ),
    fs.writeFile(
      path.join(dataDir, "biggest-donations.ts"),
      jsonAsTsModuleWithType(
        JSON.stringify(buildBiggestDonations(countryConfig, donations)),
        {
          name: "Donation[]",
          import:
            "import type {Donation} from '@donationwatch/core/utils/types';",
        },
      ),
    ),
    ...(Object.keys(donorInterests).length > 0
      ? [
          fs.writeFile(
            path.join(dataDir, "donor-interests.ts"),
            jsonAsTsModuleWithType(JSON.stringify(donorInterests), {
              name: "DonorInterestMap",
              import:
                "import type {DonorInterestMap} from '@donationwatch/core/types/interests';",
            }),
          ),
        ]
      : []),
  ]);

  const publicDataDir = path.join(WEB_PUBLIC_DIR, "data", countryConfig.id);
  await fs.rm(publicDataDir, { force: true, recursive: true });
  await fs.mkdir(publicDataDir, { recursive: true });

  await Promise.all([
    prebuildStaticDonationJsons(countryConfig, parties, donations),
    prebuiltDonorIds(countryConfig, donations),
    prebuildWikipediaJsons(countryConfig),
    prebuildStaticNormalizationJsons(countryConfig),
    prebuildDonorMeta(countryConfig, donations, donorMeta),
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
  "US",
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
  US: Country.unitedstates,
};
const main = async () => {
  const globalBuilder = new GlobalBiggestDataBuilder();

  await Promise.all(
    countries.map(async (countryCode) => {
      const country = codeCountry[countryCode];
      const [countryConfig, countryDonations] = await Promise.all([
        getCountryConfig(country),
        getDonations(country),
      ]);

      globalBuilder.processCountryDonations(countryConfig, countryDonations);
      await postprocess(countryConfig, countryDonations);
    }),
  );

  await globalBuilder.writeFiles();
  await buildDataIndex([...COUNTRIES]);
  await postprocessGeojson();
};

void main();

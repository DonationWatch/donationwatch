import assert from "assert";
import debug from "debug";
import fs, { constants } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import type {
  CountryConfig,
  UnloadedCountryConfig,
} from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Country, CountryCode } from "@/utils/countries";
import type {
  Donation,
  DonorMetaDefinition,
  ExtractedDonationAddress,
  ReceiverId,
} from "@/utils/types";

import { PartyField } from "@/types/party";
import { assertNonEmptyArray, firstItem, lastItem } from "@/utils/array";
import {
  ANONYMIZED_DONOR_KEYWORD,
  REDACTED_DONOR_KEYWORD,
} from "@/utils/config";
import { COUNTRY_CONFIG } from "@/utils/countries";
import { donationYear, fillYears } from "@/utils/date";
import { Features, hasFeature } from "@/utils/features";
import { donationDateSorter } from "@/utils/sort";
import {
  DonationType,
  AddressField,
  DonationField,
  DonorType,
} from "@/utils/types";

import {
  jsonAsTsModule,
  jsonAsTsModuleWithType,
  writeIfChanged,
} from "../utils";
import {
  assertNoDuplicateIds,
  generatePartyColor,
  RANDOM_COLOR_MARKER,
} from "./util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface PartyConfig {
  color: `#${string}`;
  code: string;
  short: string;
  name: string;
  wiki?: number;
}

export type ExtractedYearData = Omit<
  Donation,
  DonationField.Id | DonationField.Address
> & {
  idx: string;
  [DonationField.Address]: ExtractedDonationAddress;
  [DonationField.Id]?: string;
};

/**
 * Bag of data that's going to be written to the filesystem.
 */
interface ProcessedDonationData {
  donations: Donation[];
  countryConfig: CountryConfig;
  transparencyData: {
    donorFilters?: UnloadedCountryConfig["donorFilters"];
    receiverFilters?: UnloadedCountryConfig["receiverFilters"];
    filteredDonors: string[];
    filteredReceivers: string[];
    normalizedDonors: [string, string[]][];
    normalizedReceivers: [string, string[]][];
  };
  donorMeta: DonorMetaDefinition;
}

const applyDonorReceiverFilters = (
  name: string,
  filters: RegExp[],
): boolean => {
  if (!filters.length) return true;

  for (const filter of filters) {
    if (filter.test(name)) return false;
  }

  return true;
};

export abstract class DataLoader {
  /**
   * Define the parties relevant for the country.
   * The key should match the receiver field in the extracted data, and the value should contain the party metadata including the code which will be used in the final data.
   */
  abstract parties: Record<string, PartyConfig>;
  /**
   * Define any donor metadata such as relations between donors that should be included in the final data.
   * This is optional but can be useful for enriching the data with additional information that is not directly available in the extracted year data.
   */
  public abstract donorMeta: DonorMetaDefinition;

  /**
   * Return the path to the cache file for a given year.
   * This is used to store the raw extracted data for each year, so that it can be reused in subsequent runs without needing to re-extract from the original source.
   */
  abstract cacheFile(year: string): string;

  /**
   * Load the data for a given year into the cache.
   * This typically involves downloading or reading the raw data from the original source, extracting the relevant information, and writing it to the cache file defined by `cacheFile(year)`.
   */
  abstract loadYearDataToCache(year: string): Promise<void>;

  /**
   * Extract the relevant donation data for a given year from the cache.
   */
  abstract extractYearData(year: string): Promise<ExtractedYearData[]>;

  protected anonymizedDonors: string[] = [];

  protected readonly log: debug.Debugger;
  protected readonly cacheDir: string;
  protected readonly minimumProcessedYear: string;

  private readonly dataDir: string;
  private readonly taskDataDir: string;
  private readonly donationsDataPath: string;
  private readonly transparencyDataPath: string;
  private readonly donorMetaPath: string;
  private readonly countryConfigPath: string;
  private readonly buildMetaPath: string;
  protected readonly anonymizedDonorsPath: string;

  protected constructor(
    public countryCode: CountryCode,
    protected country: Country,
  ) {
    this.log = debug(`data-loader:${countryCode}`);

    this.minimumProcessedYear = COUNTRY_CONFIG[country].minYear;
    this.cacheDir = path.join(
      __dirname,
      countryCode.toLowerCase(),
      ".donations-cache",
    );
    this.dataDir = path.join(__dirname, "../../src/data", country);
    this.taskDataDir = path.join(
      __dirname,
      "../data",
      countryCode.toLowerCase(),
    );

    this.donationsDataPath = path.join(this.taskDataDir, "donations.ts");
    this.donorMetaPath = path.join(this.taskDataDir, "donor-meta.ts");
    this.transparencyDataPath = path.join(this.taskDataDir, "transparency.ts");

    this.countryConfigPath = path.join(this.dataDir, "country-config.ts");
    this.buildMetaPath = path.join(this.dataDir, "build.ts");

    this.anonymizedDonorsPath = path.join(
      __dirname,
      countryCode.toLowerCase(),
      "anonymized-donors.json",
    );
  }

  private redactedDonorCount = 0;
  protected redactDonor(suffix = ""): string {
    return `${REDACTED_DONOR_KEYWORD}${suffix}${++this.redactedDonorCount}`;
  }

  private generateDonorKey(donor: string): string {
    return donor
      .replace(/[^\p{L}\p{N}]/gu, "")
      .replace(/\./g, "")
      .toUpperCase();
  }

  // This is mostly a non-destructive normalization
  private preNormalizeDonor(donor: string): string {
    return (
      donor
        .trim()
        // remove leading and trailing " if exists
        .replace(/^"(.+)"$/, "$1")
        // remove trailing comma
        .replace(/,$/, "")
        // remove duplicate spaces
        .replace(/\s+/g, " ")
        // trim again
        .trim()
        // normalize unicode
        .normalize("NFKC")
    );
  }

  // This is mostly a non-destructive normalization
  private preNormalizeReceiver(receiver: string): string {
    return (
      receiver
        .trim()
        // remove leading and trailing " if exists
        .replace(/^"(.+)"$/, "$1")
        // remove trailing comma
        .replace(/,$/, "")
        // remove duplicate spaces
        .replace(/\s+/g, " ")
        // trim again
        .trim()
        // normalize unicode
        .normalize("NFKC")
    );
  }

  protected normalizeDonor(
    donor: string,
    // oxlint-disable-next-line @typescript-eslint/no-unused-vars
    _address: ExtractedDonationAddress,
  ): string {
    return (
      donor
        .trim()
        // remove leading and trailing " if exists
        .replace(/^"(.+)"$/, "$1")
        // remove trailing comma
        .replace(/,$/, "")
        // remove duplicate spaces
        .replace(/\s+/g, " ")
        // normalize unicode
        .normalize("NFKC")
    );
  }

  protected normalizeReceiver(receiver: string): string {
    return receiver.normalize("NFKC").trim();
  }

  protected normalizeIsoDate(isoString: string) {
    const [year, month, day] = isoString.split("-");

    return [
      year.substring(0, 4),
      month.substring(0, 2).padStart(2, "0"),
      day.substring(0, 2).padStart(2, "0"),
    ].join("-") as `${number}-${number}-${number}`;
  }

  protected partyId(party: string): string {
    return party.replace(/[^a-zA-Z0-9]/g, "");
  }

  protected partyConfig(party: string): PartyConfig {
    assert(this.parties[party], `Unknown party ${party}`);
    return this.parties[party];
  }

  public async prepareCache(): Promise<void> {
    await fs.mkdir(this.cacheDir, { recursive: true });
  }

  protected async cachedYearData(
    year: string,
    encoding: BufferEncoding = "utf8",
  ): Promise<string> {
    this.log("Reading cache file", year);
    let cached = "";
    try {
      cached = await fs.readFile(this.cacheFile(year), { encoding });
    } catch (error) {
      this.log("Error reading cache file", year, error);
      return "";
    }

    return cached;
  }

  private async extractAllYearData(
    years: string[],
  ): Promise<ExtractedYearData[]> {
    const data = await Promise.all(
      years.map((year) =>
        this.extractYearData(year).catch((error) => {
          this.log("Error extracting data for year", year, error);
          return [];
        }),
      ),
    );
    return data.flat();
  }

  /**
   * Process extracted year data into donation data ready for writing.
   */
  public processYearData(
    extractedData: ExtractedYearData[],
  ): ProcessedDonationData {
    const rawUnloadedCountryConfig = COUNTRY_CONFIG[this.country];
    const parties = new Set<string>([]);
    const partySums: Record<string, number> = {};
    const partyYears: Record<string, Set<string>> = {};

    const hasDonationType = hasFeature(
      rawUnloadedCountryConfig,
      Features.DonationType,
    );
    const hasDonorType = hasFeature(
      rawUnloadedCountryConfig,
      Features.DonorType,
    );

    let extractedDonations = extractedData
      .filter((d) => {
        // Filter out donations before minimumProcessedYear
        if (d[DonationField.Date].substring(0, 4) < this.minimumProcessedYear)
          return false;

        // Filter out lower than minPublicDonationAmount
        // Uses absolute value to also filter out negative donations below the threshold
        if (
          Math.abs(d[DonationField.Amount]) <
          rawUnloadedCountryConfig.minPublicDonationAmount
        ) {
          return false;
        }

        return true;
      })
      .toSorted(donationDateSorter);

    const filteredOutDonors = new Set<string>();
    const filteredOutReceivers = new Set<string>();
    const donorFiltersRegex = (rawUnloadedCountryConfig.donorFilters ?? []).map(
      (filter) => new RegExp(filter, "i"),
    );
    const receiverFilterRegex = (
      rawUnloadedCountryConfig.receiverFilters ?? []
    ).map((filter) => new RegExp(filter, "i"));

    const normalizedReceivers: Record<string, Set<string>> = {};

    {
      // remove donors where the sum donated is negative/zero
      // This is required because some countries report seem to do refunds as negative donations
      const preDonorSums = extractedDonations.reduce<Record<string, number>>(
        (acc, donation) => {
          acc[donation[DonationField.DonorName]] ??= 0;
          acc[donation[DonationField.DonorName]] +=
            donation[DonationField.Amount];
          return acc;
        },
        {},
      );
      extractedDonations = extractedDonations.filter(
        (d) => preDonorSums[d[DonationField.DonorName]] > 0,
      );
    }

    {
      // normalize receiver names
      extractedDonations.forEach((extracted) => {
        const preNormalized = this.preNormalizeReceiver(
          extracted[DonationField.Receiver],
        );
        const normalized = this.normalizeReceiver(preNormalized);

        normalizedReceivers[normalized] ??= new Set();
        if (preNormalized !== normalized) {
          normalizedReceivers[normalized].add(preNormalized);
        }

        extracted[DonationField.Receiver] = normalized as ReceiverId;
      });
    }

    {
      // remove donations where the party in sum received more than minimumPartySum
      const prePartySums = extractedDonations.reduce<Record<string, number>>(
        (acc, donation) => {
          acc[donation[DonationField.Receiver]] ??= 0;
          acc[donation[DonationField.Receiver]] +=
            donation[DonationField.Amount];
          return acc;
        },
        {},
      );
      extractedDonations = extractedDonations
        .filter((d) => prePartySums[d[DonationField.Receiver]] >= 0)
        .filter((d) => {
          const receiver = d[DonationField.Receiver];

          // filter if ignored receiver
          if (!applyDonorReceiverFilters(receiver, receiverFilterRegex)) {
            filteredOutReceivers.add(receiver);
            return false;
          }
          return true;
        });
    }

    const yearDonations: Record<string, Donation[]> = {};
    const yearsSet = new Set<string>([`${new Date().getFullYear()}`]);
    const donations: Donation[] = [];

    const donorMappings: Record<string, string> = {};
    const normalizedDonors: Record<string, string[]> = {};

    const foundDonorTypes = new Set<DonorType>();
    const foundDonationTypes = new Set<DonationType>();

    this.expectNoUnknownParties(extractedDonations, donorFiltersRegex).forEach(
      (extracted) => {
        const { idx, ...extractedDonation } = extracted;

        // normalize name
        extractedDonation[DonationField.DonorName] = this.preNormalizeDonor(
          extractedDonation[DonationField.DonorName],
        );
        const donorName = this.preNormalizeDonor(
          this.normalizeDonor(
            extractedDonation[DonationField.DonorName],
            extractedDonation[DonationField.Address],
          ),
        );

        // filter if ignored donor
        if (!applyDonorReceiverFilters(donorName, donorFiltersRegex)) {
          filteredOutDonors.add(donorName);
          return;
        }

        const extractedYear = donationYear(extracted);
        parties.add(extracted[DonationField.Receiver]);
        yearsSet.add(extractedYear);

        partySums[extracted[DonationField.Receiver]] ??= 0;
        partySums[extracted[DonationField.Receiver]] +=
          extracted[DonationField.Amount];
        partyYears[extracted[DonationField.Receiver]] ??= new Set();
        partyYears[extracted[DonationField.Receiver]].add(extractedYear);

        const donorKey = this.generateDonorKey(donorName);
        const knownDonorName = donorMappings[donorKey] ?? donorName;
        donorMappings[donorKey] = knownDonorName;

        if (donorMappings[donorKey] !== donorName) {
          normalizedDonors[knownDonorName] ??= [];
          if (
            !normalizedDonors[knownDonorName].includes(
              extractedDonation[DonationField.DonorName],
            )
          ) {
            normalizedDonors[knownDonorName].push(
              extractedDonation[DonationField.DonorName],
            );
          }
        } else if (donorName !== extractedDonation[DonationField.DonorName]) {
          normalizedDonors[knownDonorName] ??= [];
          if (
            !normalizedDonors[knownDonorName].includes(
              extractedDonation[DonationField.DonorName],
            )
          ) {
            normalizedDonors[knownDonorName].push(
              extractedDonation[DonationField.DonorName],
            );
          }
        }

        if (hasDonationType) {
          foundDonationTypes.add(
            extractedDonation[DonationField.DonationType] ?? DonationType.Money,
          );
        }
        if (hasDonorType) {
          foundDonorTypes.add(
            extractedDonation[DonationField.DonorType] ?? DonorType.Other,
          );
        }

        const donation: Donation = {
          // we use -1 as a placeholder for the id, we will generate them later
          [DonationField.Id]: "-1",
          ...extractedDonation,
          [DonationField.DonorName]: knownDonorName,
          [DonationField.Receiver]: this.partyConfig(
            extractedDonation[DonationField.Receiver],
          ).code as ReceiverId,
          [DonationField.Address]: {
            [AddressField.Country]:
              extractedDonation[DonationField.Address][AddressField.Country],
            [AddressField.State]:
              extractedDonation[DonationField.Address][AddressField.State],
          },
        };

        // if state is missing, only keep country in the address
        if (!donation[DonationField.Address][AddressField.State]) {
          delete donation[DonationField.Address][AddressField.State];
        }

        // normalize date if needed
        if (donation[DonationField.Date].length > 4) {
          donation[DonationField.Date] = this.normalizeIsoDate(
            donation[DonationField.Date],
          );
        }

        // check if date is actually a valid date
        const date = new Date(donation[DonationField.Date]);
        assert(
          !isNaN(date.getTime()),
          `Date is valid: ${donation[DonationField.Date]} (${date.getTime()})`,
        );

        yearDonations[extractedYear] ??= [];
        yearDonations[extractedYear].push(donation);
        donations.push(donation);
      },
    );

    // generate ids by combining the year and index of each donations sorted by oldest -> newest
    Object.values(yearDonations).forEach((donations) => {
      // iterate donations from the end
      for (let i = donations.length - 1; i >= 0; i--) {
        const donation = donations[i];
        if (donation[DonationField.Id] === "-1") {
          donation[DonationField.Id] = `${donationYear(donation)}-${i}`;
        }
      }
    });

    if (this.anonymizedDonors.length) {
      // anonymize specified donors
      const anonymizedSet = new Set(this.anonymizedDonors);
      donations.forEach((donation) => {
        if (anonymizedSet.has(donation[DonationField.DonorName])) {
          donation[DonationField.DonorName] = ANONYMIZED_DONOR_KEYWORD;
          donation[DonationField.DonorType] = DonorType.AnonymizedDonor;
          delete donation[DonationField.Address][AddressField.State];
        }
      });
    }

    const sortedYears = Array.from(yearsSet).toSorted();
    const donationData = {
      years: fillYears(sortedYears.at(0)!, sortedYears.at(-1)!),
      parties: Array.from(parties)
        // sort by party sum descending
        .toSorted((a, b) => partySums[b] - partySums[a])
        .map<Party>((party) => {
          const config = this.partyConfig(party);

          if (config.color === RANDOM_COLOR_MARKER) {
            config.color = generatePartyColor(config.code);
          }

          const years = [...(partyYears[party] ?? [])].toSorted();
          assertNonEmptyArray(years);

          return {
            [PartyField.Id]: config.code as ReceiverId,
            [PartyField.Name]: config.name,
            [PartyField.Short]: config.short,
            [PartyField.Color]: config.color,
            [PartyField.Wiki]: config.wiki,
            [PartyField.Sum]: partySums[party],
            [PartyField.Years]: [firstItem(years), lastItem(years)],
          };
        }),
    };

    assertNoDuplicateIds(donations);

    const lastDonationDate = donations.reduce<string | undefined>((acc, d) => {
      const date = d[DonationField.Date];
      if (!date) return acc;
      if (!acc) return date;
      return date > acc ? date : acc;
    }, undefined);

    const { donorFilters, receiverFilters, ...countryConfig } =
      rawUnloadedCountryConfig;

    return {
      donations,
      countryConfig: {
        ...countryConfig,
        years: donationData.years,
        parties: donationData.parties,
        lastDonationDate,
        ...(hasDonationType
          ? { usedDonationTypes: [...foundDonationTypes].toSorted() }
          : undefined),
        ...(hasDonorType
          ? { usedDonorTypes: [...foundDonorTypes].toSorted() }
          : undefined),
      },
      transparencyData: {
        donorFilters,
        receiverFilters,
        filteredDonors: [...filteredOutDonors].toSorted(([a], [b]) =>
          b.localeCompare(a),
        ),
        filteredReceivers: [...filteredOutReceivers].toSorted(([a], [b]) =>
          b.localeCompare(a),
        ),
        normalizedDonors: Object.entries(normalizedDonors)
          .toSorted(([a], [b]) => a.localeCompare(b))
          .map(([name, variants]) => [name, variants.toSorted()]),
        normalizedReceivers: Object.entries(normalizedReceivers)
          .filter(([, variants]) => variants.size > 1)
          .map<[string, string[]]>(([receiver, variants]) => [
            receiver,
            [...variants].toSorted(),
          ])
          .toSorted(([a], [b]) => a.localeCompare(b)),
      },
      donorMeta: this.donorMeta,
    };
  }

  /**
   * Write processed donation data to the filesystem.
   */
  private async writeProcessedData(
    processedData: ProcessedDonationData,
  ): Promise<void> {
    await fs.mkdir(this.dataDir, { recursive: true });
    await fs.mkdir(this.taskDataDir, { recursive: true });

    const changed = await Promise.all([
      writeIfChanged(
        this.transparencyDataPath,
        jsonAsTsModule(JSON.stringify(processedData.transparencyData)),
      ),
      writeIfChanged(
        this.donationsDataPath,
        jsonAsTsModuleWithType(JSON.stringify(processedData.donations), {
          name: "Donation[]",
          as: "Donation[]",
          import: 'import { Donation } from "../../../src/utils/types";',
        }),
      ),
      writeIfChanged(
        this.donorMetaPath,
        jsonAsTsModuleWithType(JSON.stringify(processedData.donorMeta), {
          name: "DonorMetaDefinition",
          as: "DonorMetaDefinition",
          import:
            'import type { DonorMetaDefinition } from "../../../src/utils/types";',
        }),
      ),
      writeIfChanged(
        this.countryConfigPath,
        jsonAsTsModuleWithType(JSON.stringify(processedData.countryConfig), {
          name: `CountryConfig`,
          as: `CountryConfig`,
          import:
            'import type { CountryConfig } from "@/types/country-config";',
        }),
      ),
    ]);

    if (!changed.some(Boolean)) {
      this.log("No change in donation data, skipping build meta write");
      return;
    }

    await fs.writeFile(
      this.buildMetaPath,
      jsonAsTsModule(
        JSON.stringify({
          t: Date.now(),
        }),
      ),
    );
  }

  protected async loadAnonymizedDonors(): Promise<void> {
    try {
      // check if file exists and is readable
      await fs.access(this.anonymizedDonorsPath, constants.R_OK);

      const anonymizedDonorsContent = await fs.readFile(
        this.anonymizedDonorsPath,
        "utf-8",
      );
      this.anonymizedDonors = JSON.parse(anonymizedDonorsContent);
    } catch (error) {
      this.log("Proceeding without anonymization", error);
      this.anonymizedDonors = [];
    }
  }

  public async run(years: string[]) {
    await this.loadAnonymizedDonors();

    years = years.filter((year) => year >= this.minimumProcessedYear);

    this.log("Running data loader for years", years);
    const extractedData = await this.extractAllYearData(years);
    const processedData = this.processYearData(extractedData);

    await this.writeProcessedData(processedData);
  }

  private expectNoUnknownParties(
    extractedDonations: ExtractedYearData[],
    donorFiltersRegex: RegExp[],
  ): ExtractedYearData[] {
    const knownPartyRequirements = COUNTRY_CONFIG[this.country]
      .knownPartyRequirements ?? {
      sum: 0,
      count: 0,
    };

    const partySumCounts: Record<string, { count: number; sum: number }> = {};

    extractedDonations.forEach((extracted) => {
      const party = extracted[DonationField.Receiver];

      // Skip counting this donation if it's from an ignored donor
      if (
        !applyDonorReceiverFilters(
          extracted[DonationField.DonorName],
          donorFiltersRegex,
        )
      )
        return;

      partySumCounts[party] ??= { count: 0, sum: 0 };
      partySumCounts[party].count++;
      partySumCounts[party].sum += extracted[DonationField.Amount];
    });

    const isAbovePartyRrequirements = (value: {
      count: number;
      sum: number;
    }) => {
      if (knownPartyRequirements.sum === -1) {
        return value.count >= knownPartyRequirements.count;
      }
      if (knownPartyRequirements.count === -1) {
        return value.sum >= knownPartyRequirements.sum;
      }

      return (
        value.sum >= knownPartyRequirements.sum ||
        value.count >= knownPartyRequirements.count
      );
    };

    const missingKeys = Object.entries(partySumCounts)
      .filter(([, value]) => isAbovePartyRrequirements(value))
      .filter(([party]) => !this.parties[party])
      .map(([party]) => party);

    const keptParties = new Set(
      Object.entries(partySumCounts)
        .filter(([, value]) => isAbovePartyRrequirements(value))
        .map(([party]) => party),
    );
    const droppedParties = Object.entries(partySumCounts)
      .filter(([, value]) => !isAbovePartyRrequirements(value))
      .map(([key, value]) => `${key} (sum ${value.sum}, count ${value.count})`);

    if (missingKeys.length) {
      throw new Error(
        `${missingKeys.length} unknown parties:\n${JSON.stringify(
          Object.fromEntries(
            missingKeys.map((p, i) => [
              p,
              {
                name: p,
                short: p,
                code: `${this.country.toUpperCase()}${i}`,
                color: `#ff0${`${i}`.padStart(3, "0")}`,
              },
            ]),
          ),
        )}`,
      );
    }

    if (droppedParties.length) {
      this.log(
        `Skipping parties due to below threshold (sum ${knownPartyRequirements.sum}, count ${knownPartyRequirements.count}):\n`,
        droppedParties.join("\n"),
      );
    }

    return extractedDonations.filter((extracted) =>
      keptParties.has(extracted[DonationField.Receiver]),
    );
  }
}

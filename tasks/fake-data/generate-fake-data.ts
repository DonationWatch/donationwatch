import debug from "debug";

import {
  DONOR_WITH_REL_A,
  DONOR_WITH_REL_B,
  DONOR_WITH_WIKIPEDIA_ARTICLE,
} from "../../tests/config";
import { DataLoader } from "../load-data/data-loader";
import { loaders } from "../load-data/loaders";
import { promptCountries } from "../utils";
import { writeWikipediaArticles } from "../wikipedia/util";

import type { ExtractedYearData, PartyConfig } from "../load-data/data-loader";
import type {
  Country,
  CountryCode,
  UnloadedCountryConfig,
} from "@/utils/countries";
import type {
  DonorMetaDefinition,
  ExtractedDonationAddress,
} from "@/utils/types";

import { COUNTRY_CONFIG } from "@/utils/countries";
import { fillYears } from "@/utils/date";
import { AddressField, DonationField, RelationKind } from "@/utils/types";

debug.enable("data-loader:*");

const FAKE_PARTY_CONFIG: PartyConfig = {
  color: "#BADA55",
  code: "FAKE",
  short: "Fake",
  name: "Fake Party",
};

class FakeDataLoader extends DataLoader {
  parties: Record<string, PartyConfig> = {
    "Fake Party": FAKE_PARTY_CONFIG,
  };

  constructor(
    countryCode: CountryCode,
    country: Country,
    originalDataLoader: DataLoader,
  ) {
    super(countryCode, country);
    this.parties = originalDataLoader.parties;
  }

  // Fake donorMeta with the test donor as they need a Wikipedia article
  public readonly donorMeta: DonorMetaDefinition = {
    donors: {
      [DONOR_WITH_WIKIPEDIA_ARTICLE]: {
        wiki: 12345, // Fake wiki ID for testing
      },
    },
    relations: [
      [
        [DONOR_WITH_REL_A, RelationKind.family],
        [DONOR_WITH_REL_B, RelationKind.family],
      ],
    ],
  };

  private pickRandomParty(): string {
    const partyKeys = Object.keys(this.parties);
    return partyKeys[Math.floor(Math.random() * partyKeys.length)];
  }

  cacheFile(): string {
    // Fake data loader doesn't use cache files
    return "";
  }

  async loadYearDataToCache(): Promise<void> {
    // No-op: fake data doesn't need to load from external sources
  }

  override normalizeDonor(
    donor: string,
    address: ExtractedDonationAddress,
  ): string {
    const normalized = super.normalizeDonor(donor, address);
    return normalized === "Fake Donor 1"
      ? "Normalized Fake Donor 1"
      : normalized;
  }

  async extractYearData(year: string): Promise<ExtractedYearData[]> {
    const countryConfig = COUNTRY_CONFIG[this.country];

    const extracted: ExtractedYearData[] = [];
    let idx = 0;

    // create fake wikipedia donor donation
    extracted.push({
      idx: `fake-${year}-${idx++}`,
      [DonationField.DonorName]: DONOR_WITH_WIKIPEDIA_ARTICLE,
      [DonationField.Date]: `${year}-01-01`,
      [DonationField.Amount]: countryConfig.minPublicDonationAmount + 1,
      [DonationField.Receiver]: this.pickRandomParty(),
      [DonationField.Address]: { [AddressField.Country]: "??" },
    } as ExtractedYearData);

    // Create dummy donations for donor meta relations to avoid postprocessing issues
    this.donorMeta.relations?.forEach((rel) => {
      rel.forEach(([donorName]) => {
        extracted.push({
          idx: `fake-${year}-${idx++}`,
          [DonationField.DonorName]: donorName,
          [DonationField.Date]: `${year}-01-01`,
          [DonationField.Amount]: countryConfig.minPublicDonationAmount + 1,
          [DonationField.Receiver]: this.pickRandomParty(),
          [DonationField.Address]: { [AddressField.Country]: "??" },
        } as ExtractedYearData);
      });
    });

    // Create fake donations
    const donationsPerParty =
      countryConfig.knownPartyRequirements?.count ?? 100;

    Object.keys(this.parties).forEach((partyName) => {
      for (let j = 0; j < donationsPerParty; j++) {
        const isEu = countryConfig.code === "EU";

        extracted.push({
          idx: `fake-${year}-${idx++}`,
          [DonationField.DonorName]: `Fake Donor ${j + 1}`,
          [DonationField.Date]: `${year}-${String(
            Math.floor(Math.random() * 12) + 1,
          ).padStart(2, "0")}-${String(
            Math.floor(Math.random() * 28) + 1,
          ).padStart(2, "0")}`,
          [DonationField.Amount]: countryConfig.minPublicDonationAmount + 1,
          [DonationField.Receiver]: partyName,
          [DonationField.Address]:
            // if country has origin, create a state donation for the first donation
            countryConfig.hasOrigin && j === 0
              ? {
                  [AddressField.Country]: isEu ? "DE" : countryConfig.code,
                  [AddressField.State]: isEu
                    ? "DE"
                    : countryConfig.states.at(0),
                }
              : { [AddressField.Country]: "??" },
        } as ExtractedYearData);
      }
    });

    return extracted;
  }
}

const useCountries = await promptCountries(
  "What country to generate fake data for?",
);

const generateFakeWikipediaArticles = async (
  countryConfig: UnloadedCountryConfig,
  donorMeta: DonorMetaDefinition,
) => {
  const fakeText = "This is a fake Wikipedia article for testing purposes.";
  const wikipediaArticles: Record<number, string> = {};
  const originalDataLoader = loaders[countryConfig.id];

  const wikiIds = new Set<number>([
    ...[
      ...Object.values(donorMeta.donors),
      ...Object.values(originalDataLoader.parties),
    ]
      .filter((d): d is { wiki: number } => typeof d.wiki === "number")
      .map((d) => d.wiki!),
  ]);

  wikiIds.forEach((id) => {
    wikipediaArticles[id] = fakeText;
  });

  await writeWikipediaArticles(countryConfig.id, wikipediaArticles);
};

const main = async () => {
  const currentYear = `${new Date().getFullYear()}`;
  for (const country of useCountries) {
    const countryConfig = COUNTRY_CONFIG[country];
    const originalDataLoader = loaders[countryConfig.id];

    const loader = new FakeDataLoader(
      countryConfig.code,
      country,
      originalDataLoader,
    );

    await loader.run(fillYears(countryConfig.minYear, currentYear));
    await generateFakeWikipediaArticles(countryConfig, loader.donorMeta);
  }
};

main();

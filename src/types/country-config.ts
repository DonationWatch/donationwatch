import type { Party } from "@/types/party";
import type { NonEmptyArray } from "@/utils/array";
import type { Country, CountryCode, Currency } from "@/utils/countries";
import type { LambertConformalConicParams } from "@/utils/map";
import type {
  DonationType,
  DonorFilter,
  DonorType,
  IsoDate,
  ReceiverFilter,
} from "@/utils/types";

// This is the raw country config containing everything relevant to the country.
// This will get stripped down before being available to the next app.
export interface UnloadedCountryConfig {
  readonly id: Country;
  readonly legislativeYears?: NonEmptyArray<NonEmptyArray<string>>;

  // minimum year from which the data isn't complete yet
  readonly preliminaryDataSince?: string;
  readonly lastDonationDate?: string;
  readonly minPublicDonationAmount: number;
  readonly source: { name: string; url: string };
  readonly currency: Currency;
  readonly code: CountryCode;

  // Minimum year that this country has data for.
  // Is used to e.g. skip scraping for years that are not available for a country
  readonly minYear: string;

  // markers in timeseries charts
  readonly markers: {
    label: string;
    dates: IsoDate[];
  };

  // list of iso state codes
  readonly states: readonly string[];

  // Which wiki language should be used when linking/load a wiki article
  readonly wikiCountry: "en" | "de";

  // features that the country has, used to determine which information can be shown
  readonly features: number;

  // Include parties if they have count over this threshold or sum over the threshold.
  // Use -1 if it should only check the other condition
  readonly knownPartyRequirements?: {
    count: number;
    sum: number;
  };

  // Lambert Conformal Conic projection parameters for the country
  readonly projection?: LambertConformalConicParams;

  // filter out donations by donor
  readonly donorFilters?: DonorFilter[];

  // filtered out donation receivers
  readonly receiverFilters?: ReceiverFilter[];

  // bitmask of the donor types that are used in the country
  readonly usedDonorTypes?: DonorType[];
  // bitmask of the donation types that are used in the country
  readonly usedDonationTypes?: DonationType[];
}

// This is the config type that's available to the next app
export type CountryConfig = Omit<
  UnloadedCountryConfig,
  "donorFilters" | "receiverFilters"
> & {
  readonly years: string[];
  // This is sorted by sum. Meaning first entry is the party with the highest sum of donations.
  readonly parties: Party[];
};

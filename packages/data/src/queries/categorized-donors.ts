import "server-only";
import type {
  DonorInterestAttribution,
  DonorInterestMap,
} from "@donationwatch/core/types/interests";

import { Country } from "@donationwatch/core/utils/countries";

export type CategorizedDonorItem = [string, DonorInterestAttribution[]];

const COUNTRY_DONOR_INTEREST_LOADERS: Partial<
  Record<Country, () => Promise<{ default: DonorInterestMap }>>
> = {
  [Country.australia]: () => import("../countries/australia/donor-interests"),
  [Country.germany]: () => import("../countries/germany/donor-interests"),
  [Country.unitedkingdom]: () =>
    import("../countries/unitedkingdom/donor-interests"),
};

/**
 * Dynamically loads the donor-interest lookup map for a given country on the server,
 * or returns an empty map when the country has no donor-interest metadata registered.
 */
export const getCountryDonorInterests = async (
  countryId: Country,
): Promise<DonorInterestMap> => {
  const loader = COUNTRY_DONOR_INTEREST_LOADERS[countryId as Country];
  if (!loader) {
    return {};
  }
  const mod = await loader();
  return mod.default;
};

/**
 * Returns categorized policy interest attributions for donors in a country,
 * sorted alphabetically by donor name.
 */
export const getCountryCategorizedDonors = async (
  countryId: Country,
): Promise<CategorizedDonorItem[]> => {
  const interests = await getCountryDonorInterests(countryId);
  return Object.entries(interests).sort(([a], [b]) => a.localeCompare(b));
};

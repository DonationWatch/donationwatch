import type { CountryConfig } from "@/utils/countries";

export const enum Features {
  // default value, no special features supported
  None = 0,
  // has donations with a date containing more than the year
  Date = 1 << 0,
  // has donations with information about their origin
  Origin = 1 << 1,
  // the donations that specify donor type information
  DonorType = 1 << 2,
  // has donations with unique ids that can be used to link to the source data
  ExternalDonationIds = 1 << 3,
  // has donations with donor names
  Donors = 1 << 4,
}

export const hasFeature = (
  country: Pick<CountryConfig, "features">,
  feature: Features,
): boolean => {
  return (country.features & feature) === feature;
};

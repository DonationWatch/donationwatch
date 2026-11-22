import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { Country } from "@donationwatch/core/utils/countries";
import type { ReceiverId } from "@donationwatch/core/utils/types";

import { getParty } from "../config/parties";

export {
  isValidCountry,
  isValidLocale,
  isValidMetadataLocale,
} from "@donationwatch/core/utils/validate";

export const isValidParty = (
  partyId: string,
  countryConfig: CountryConfig | Country,
): partyId is ReceiverId => {
  const countryId =
    typeof countryConfig === "string" ? countryConfig : countryConfig.id;

  return getParty(countryId, partyId as ReceiverId) !== undefined;
};

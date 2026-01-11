import type { Translations } from "@/messages/translations";
import type { Donation } from "@/utils/types";

import {
  ANONYMIZED_DONOR_KEYWORD,
  REDACTED_DONOR_KEYWORD,
} from "@/utils/config";
import { DonationField } from "@/utils/types";

export const getDonationDonorName = (
  d: Donation,
  translations: Translations,
) => {
  const donor = d[DonationField.DonorName];
  return getDonorName(donor, translations);
};

export const getDonorName = (donor: string, translations: Translations) => {
  if (donor === ANONYMIZED_DONOR_KEYWORD) {
    return translations.common.anonymizedDonor;
  } else if (isRedactedDonor(donor)) {
    return translations.common.redactedDonor;
  }
  return donor;
};

export const isRedactedDonor = (donor: string) => {
  return donor[0] === REDACTED_DONOR_KEYWORD;
};

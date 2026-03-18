import type { StrictNamespacedTranslator } from "@/utils/translator";
import type { Donation } from "@/utils/types";

import {
  ANONYMIZED_DONOR_KEYWORD,
  DONOR_TO_PARTY_BY_YEAR,
  REDACTED_DONOR_KEYWORD,
} from "@/utils/config";
import { DonationField } from "@/utils/types";

export const getDonationDonorName = (
  d: Donation,
  t: StrictNamespacedTranslator<"common">,
) => {
  const donor = d[DonationField.DonorName];
  return getDonorName(donor, t);
};

export const getDonorName = (
  donor: string,
  t: StrictNamespacedTranslator<"common">,
) => {
  if (donor === ANONYMIZED_DONOR_KEYWORD) {
    return t("anonymizedDonor");
  } else if (isRedactedDonor(donor)) {
    return t("redactedDonor");
  } else if (isDonorToPartyByYear(donor)) {
    const [, year] = donor.split("_");
    return t("donorToPartyByYear", {
      year,
    });
  }
  return donor;
};

export const isRedactedDonor = (donor: string) => {
  return donor[0] === REDACTED_DONOR_KEYWORD;
};

export const isDonorToPartyByYear = (donor: string) => {
  return donor[0] === DONOR_TO_PARTY_BY_YEAR;
};

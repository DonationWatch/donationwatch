import type { StrictNamespacedTranslator } from "@/utils/translator";
import type { Donation } from "@/utils/types";

import {
  ANONYMIZED_DONOR_KEYWORD,
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
  }
  return donor;
};

export const isRedactedDonor = (donor: string) => {
  return donor[0] === REDACTED_DONOR_KEYWORD;
};

import type { Donation } from "@/utils/types";

import { DonationField } from "@/utils/types";

type DocumentDonation = Omit<Donation, DonationField.DonorName> & {
  [DonationField.DonorIndex]: number;
};

export interface DonationsDocument {
  donors: [donorName: string, ubos: string[] | null, donorId: string][];
  donations: DocumentDonation[];
}

export interface DonationsDocumentWithoutDonorIds {
  donors: [donorName: string, ubos: string[] | null][];
  donations: DocumentDonation[];
}

// Convert a singular donation document donation to a regular donation
export const donationDocumentDonationToDonation = (
  doc: DonationsDocument | DonationsDocumentWithoutDonorIds,
  donation: DocumentDonation,
): Donation => {
  const donorIndex = donation[DonationField.DonorIndex];
  const [donorName, ubos] = doc.donors[donorIndex];

  return {
    ...donation,
    [DonationField.DonorName]: donorName,
    ...(ubos ? { [DonationField.UBOs]: ubos } : undefined),
  };
};

// Convert an entire donations document to an array of regular donations
export const donationDocumentToDonations = (
  doc: DonationsDocument | DonationsDocumentWithoutDonorIds,
  filter: (donation: DocumentDonation) => boolean = () => true,
): Donation[] => {
  const donations: Donation[] = [];

  doc.donations.forEach((documentDonation) => {
    if (filter(documentDonation)) {
      donations.push(donationDocumentDonationToDonation(doc, documentDonation));
    }
  });

  return donations;
};

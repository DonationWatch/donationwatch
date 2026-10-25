import type { Donation } from "@/utils/types";

import { DonationField } from "@/utils/types";

type DocumentDonation = Omit<
  Donation,
  DonationField.DonorName | DonationField.OriginalReceiver
> & {
  [DonationField.DonorIndex]: number;
  [DonationField.OriginalReceiverIndex]?: number;
};

export interface DonationsDocument {
  donors: [donorName: string, ubos: string[] | null, donorId: string][];
  originalReceivers?: string[];
  donations: DocumentDonation[];
}

export interface DonationsDocumentWithoutDonorIds {
  donors: [donorName: string, ubos: string[] | null][];
  originalReceivers?: string[];
  donations: DocumentDonation[];
}

// Convert a singular donation document donation to a regular donation
export const donationDocumentDonationToDonation = (
  doc: DonationsDocument | DonationsDocumentWithoutDonorIds,
  donation: DocumentDonation,
): Donation => {
  const {
    [DonationField.DonorIndex]: donorIndex,
    [DonationField.OriginalReceiverIndex]: originalReceiverIndex,
    ...rest
  } = donation;
  const [donorName, ubos] = doc.donors[donorIndex];
  const originalReceiver =
    originalReceiverIndex !== undefined && doc.originalReceivers
      ? doc.originalReceivers[originalReceiverIndex]
      : undefined;

  return {
    ...rest,
    [DonationField.DonorName]: donorName,
    ...(ubos ? { [DonationField.UBOs]: ubos } : undefined),
    ...(originalReceiver
      ? { [DonationField.OriginalReceiver]: originalReceiver }
      : undefined),
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

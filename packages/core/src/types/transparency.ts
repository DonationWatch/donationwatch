export interface AnonymizedDonorRecord {
  name: string;
  actionedOn?: string;
}

export type AnonymizedDonorEntry = string | AnonymizedDonorRecord;

export interface TransparencyAnonymisation {
  anonymisedByRequestCount: number;
  redactedUpstreamCount: number;
}

export interface TransparencyData {
  donorFilters?: string[];
  receiverFilters?: string[];
  filteredDonors: string[];
  filteredReceivers: string[];
  normalizedDonors: [string, string[]][];
  normalizedReceivers: [string, string[]][];
  anonymisation?: TransparencyAnonymisation;
}

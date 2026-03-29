import type { Countries } from "@/utils/countries";

import type { PartyYearsSums } from "./loader/party-years-sums";

declare const tags: unique symbol;
export type ReceiverId = string & { [tags]: { receiverId: never } };

export const enum AddressField {
  Country,
  State,
  Zip,
}

export interface DonationAddress {
  [AddressField.Country]: Countries;
  [AddressField.State]?: string;
}

export interface ExtractedDonationAddress extends DonationAddress {
  [AddressField.Zip]?: string;
}

export const enum DonorType {
  Other,
  Individual,
  Company,
  TradeUnion,
  PublicFund,
  UnincorporatedAssociation,
  RegisteredPoliticalParty,
  Trust,
  FriendlySociety,
  LimitedLiabilityPartnership,
  BuildingSociety,
  NonProfitLegalEntity,
  AnonymizedDonor,
}

export const enum DonationField {
  Id,
  Date,
  DonorType,
  DonorName,
  Amount,
  Receiver,
  Address,
  DonorIndex,
  // Ultimate Beneficial Owners
  // see https://en.wikipedia.org/wiki/Beneficial_ownership
  UBOs,
}

export interface Donation {
  [DonationField.Id]: string;
  [DonationField.Amount]: number;
  // name of the donor
  [DonationField.DonorName]: string;
  // either year or year-month-day
  [DonationField.Date]: `${string}` | `${string}-${string}-${string}`;
  [DonationField.Address]: DonationAddress;
  [DonationField.Receiver]: ReceiverId;
  [DonationField.DonorType]?: DonorType;
  [DonationField.UBOs]?: string[];
}

export type IsoDate = `${number}-${number}-${number}`;

// Type for defining that's later post processed into the DonorMeta
// This won't reach the next app
export interface DonorMetaDefinition {
  donors: Record<string, { wiki?: number }>;
  relations?: [donor: string, kind: RelationKind][][];
}

export type DonorMetaRelation = [
  donor: string,
  kind: RelationKind,
  partySum: PartyYearsSums,
];

export interface DonorMeta {
  wiki?: number;
  relations?: DonorMetaRelation[];
}

export const enum RelationKind {
  family,
  company,
  owner,
  organization,
}

// To be used as RegExp
export type DonorFilter = string;

// To be used as RegExp
export type ReceiverFilter = string;

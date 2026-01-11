import { type CountryConfig, getParty } from "./countries";

import type { DonorType, ReceiverId } from "./types";

export const partyColor = (partyId: ReceiverId, country: CountryConfig) => {
  return getParty(country, partyId).color;
};

const chartColors = [
  "#5070dd",
  "#b6d634",
  "#505372",
  "#ff994d",
  "#0ca8df",
  "#ffd10a",
  "#fb628b",
  "#785db0",
  "#3fbe95",
];

// wrapped returning chart colors
export const chartColorFor = (idx: number) =>
  chartColors[idx % chartColors.length];

export const donorTypeColor = (donorType: DonorType) =>
  chartColorFor(donorType);

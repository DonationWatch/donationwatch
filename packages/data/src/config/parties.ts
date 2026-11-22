import "server-only";
import type { Party } from "@donationwatch/core/types/party";
import type { Country } from "@donationwatch/core/utils/countries";
import type { ReceiverId } from "@donationwatch/core/utils/types";

import { PartyField } from "@donationwatch/core/types/party";

import australia from "../countries/australia/parties";
import austria from "../countries/austria/parties";
import canada from "../countries/canada/parties";
import croatia from "../countries/croatia/parties";
import czechrepublic from "../countries/czechrepublic/parties";
import estonia from "../countries/estonia/parties";
import europeanunion from "../countries/europeanunion/parties";
import france from "../countries/france/parties";
import georgia from "../countries/georgia/parties";
import germany from "../countries/germany/parties";
import latvia from "../countries/latvia/parties";
import netherlands from "../countries/netherlands/parties";
import norway from "../countries/norway/parties";
import serbia from "../countries/serbia/parties";
import southafrica from "../countries/southafrica/parties";
import sweden from "../countries/sweden/parties";
import switzerland from "../countries/switzerland/parties";
import ukraine from "../countries/ukraine/parties";
import unitedkingdom from "../countries/unitedkingdom/parties";
import unitedstates from "../countries/unitedstates/parties";

export const PARTIES: Record<Country, Party[]> = {
  australia,
  austria,
  canada,
  croatia,
  czechrepublic,
  estonia,
  europeanunion,
  france,
  georgia,
  germany,
  latvia,
  netherlands,
  norway,
  serbia,
  southafrica,
  sweden,
  switzerland,
  ukraine,
  unitedkingdom,
  unitedstates,
};

export const PARTY_MAP: Record<
  Country,
  Record<ReceiverId, Party>
> = Object.fromEntries(
  Object.entries(PARTIES).map(([country, parties]) => [
    country,
    Object.fromEntries(parties.map((p) => [p[PartyField.Id], p])),
  ]),
) as Record<Country, Record<ReceiverId, Party>>;

export const getPartiesSync = (country: Country): Party[] => {
  return PARTIES[country] ?? [];
};

export const getPartySync = (country: Country, partyId: ReceiverId): Party => {
  const party = PARTY_MAP[country]?.[partyId];

  if (!party) {
    console.error(`Unknown party ${partyId} (${country})`);
  }

  // Note: theoretically this can be undefined but we usually handle it before it reaches any code that requires the party
  return party as Party;
};

export const getParty = getPartySync;

export const findCorrectParty = (
  country: Country,
  possiblePartyId: string,
): Party | undefined => {
  const normalizedPartyId = possiblePartyId
    .toUpperCase()
    // remove anything that's not letter or number
    .replace(/[^A-Z0-9]/g, "")
    .trim();

  return getParty(country, normalizedPartyId as ReceiverId);
};

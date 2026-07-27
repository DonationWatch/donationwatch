import "server-only";
import type { Party } from "@/types/party";
import type { Country } from "@/utils/countries";
import type { ReceiverId } from "@/utils/types";

import australia from "@/data/australia/parties";
import austria from "@/data/austria/parties";
import canada from "@/data/canada/parties";
import croatia from "@/data/croatia/parties";
import czechrepublic from "@/data/czechrepublic/parties";
import estonia from "@/data/estonia/parties";
import europeanunion from "@/data/europeanunion/parties";
import france from "@/data/france/parties";
import georgia from "@/data/georgia/parties";
import germany from "@/data/germany/parties";
import latvia from "@/data/latvia/parties";
import netherlands from "@/data/netherlands/parties";
import norway from "@/data/norway/parties";
import serbia from "@/data/serbia/parties";
import southafrica from "@/data/southafrica/parties";
import sweden from "@/data/sweden/parties";
import switzerland from "@/data/switzerland/parties";
import ukraine from "@/data/ukraine/parties";
import unitedkingdom from "@/data/unitedkingdom/parties";
import { PartyField } from "@/types/party";

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

import { PartyDot } from "./party-dot";
import { PartyLink } from "./party-link";
import { getParty } from "../utils/countries";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { ConstLocale } from "../utils/locales";
import type { ReceiverId } from "../utils/types";

export const TextPartyLink = ({
  truncated = false,
  party: partyId,
  country,
  translations,
  locale,
}: {
  party: ReceiverId;
  country: CountryConfig;
  locale: ConstLocale;
  translations: Translations;
  truncated?: boolean;
}) => {
  const party = getParty(country, partyId);
  return (
    <PartyLink
      className={`${truncated ? "block overflow-hidden" : "inline-flex"} px-0.5 align-bottom`}
      party={partyId}
      country={country}
      translations={translations}
      locale={locale}
    >
      <PartyDot
        party={party.id}
        country={country}
        nameClassName={truncated ? "truncate" : ""}
      />
    </PartyLink>
  );
};

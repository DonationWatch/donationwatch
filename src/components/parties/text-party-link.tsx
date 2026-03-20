import type { CountryConfig } from "@/utils/countries";
import type { ConstLocale } from "@/utils/locales";
import type { ReceiverId } from "@/utils/types";

import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { getParty } from "@/utils/countries";

export const TextPartyLink = ({
  truncated = false,
  party: partyId,
  country,
  locale,
}: {
  party: ReceiverId;
  country: CountryConfig;
  locale: ConstLocale;
  truncated?: boolean;
}) => {
  const party = getParty(country, partyId);
  return (
    <PartyLink
      className={`${truncated ? "block overflow-hidden" : "inline-flex"} px-0.5 align-bottom`}
      party={partyId}
      country={country}
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

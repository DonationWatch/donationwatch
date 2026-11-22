import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { ReceiverId } from "@donationwatch/core/utils/types";

import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";

export const TextPartyLink = ({
  truncated = false,
  party: partyId,
  locale,
}: {
  party: ReceiverId;
  locale: ConstLocale;
  truncated?: boolean;
}) => {
  return (
    <PartyLink
      className={`${truncated ? "block overflow-hidden" : "inline-flex"} px-0.5 align-bottom`}
      party={partyId}
      locale={locale}
    >
      <PartyDot party={partyId} nameClassName={truncated ? "truncate" : ""} />
    </PartyLink>
  );
};

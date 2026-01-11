"use client";

import { type FC, useEffect } from "react";

import { PartyDot } from "./party-dot";
import { PartyLink } from "./party-link";
import { RankingItemLine } from "./ranking-item-line";
import { useTranslations } from "../hooks/use-translations";
import { donationYear } from "../utils/date";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, ReceiverId } from "../utils/types";

export const DonorDonationsDetail: FC<{
  donor: {
    sum: number;
    name: string;
    donations: { party: ReceiverId; donation: Donation }[];
  };
  country: CountryConfig;
  onVisibleChanged?: () => void;
}> = ({ country, donor, onVisibleChanged }) => {
  const { translations, locale } = useTranslations();

  useEffect(() => {
    onVisibleChanged?.();
    return () => {
      onVisibleChanged?.();
    };
  }, [onVisibleChanged]);

  return donor.donations.toReversed().map(({ party, donation }) => (
    <RankingItemLine
      year={donationYear(donation)}
      label={party}
      key={donation[DonationField.Id]}
      date={donation[DonationField.Date]}
      amount={donation[DonationField.Amount]}
      locale={locale}
      country={country}
    >
      <PartyLink
        party={party}
        country={country}
        translations={translations}
        locale={locale}
      >
        <PartyDot party={party} country={country} />
      </PartyLink>
    </RankingItemLine>
  ));
};

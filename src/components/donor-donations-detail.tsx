"use client";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { PartyDot } from "./party-dot";
import { PartyLink } from "./party-link";
import { RankingItemLine } from "./ranking-item-line";
import { donationYear } from "../utils/date";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, ReceiverId } from "../utils/types";

export const DonorDonationsDetail = ({
  country,
  donor,
  onVisibleChanged,
}: {
  donor: {
    sum: number;
    name: string;
    donations: { party: ReceiverId; donation: Donation }[];
  };
  country: CountryConfig;
  onVisibleChanged?: () => void;
}) => {
  const locale = useLocale();

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
      <PartyLink party={party} country={country} locale={locale}>
        <PartyDot party={party} country={country} />
      </PartyLink>
    </RankingItemLine>
  ));
};

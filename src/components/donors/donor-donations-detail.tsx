"use client";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import type { Donation, ReceiverId } from "@/utils/types";

import { RankingItemLine } from "@/components/donations/ranking-item-line";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { donationYear } from "@/utils/date";
import { DonationField } from "@/utils/types";

export const DonorDonationsDetail = ({
  donor,
  onVisibleChanged,
}: {
  donor: {
    sum: number;
    name: string;
    donations: { party: ReceiverId; donation: Donation }[];
  };
  onVisibleChanged?: () => void;
}) => {
  const country = useRequiredCountryConfig();
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

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
      locale={browserBasedLocale}
      country={country}
    >
      <PartyLink party={party} locale={locale}>
        <PartyDot party={party} />
      </PartyLink>
    </RankingItemLine>
  ));
};

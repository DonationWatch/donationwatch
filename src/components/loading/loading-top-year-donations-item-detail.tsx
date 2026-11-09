"use client";
import type { ReactNode } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef } from "react";

import type { Donation, ReceiverId } from "@/utils/types";

import { RankingItemLine } from "@/components/donations/ranking-item-line";
import { DonorLink } from "@/components/donors/donor-link";
import Loading from "@/components/loading/loading";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useBreakpoint } from "@/hooks/use-media-query";
import { donationYear } from "@/utils/date";
import { getDonationDonorName } from "@/utils/donor";
import { DonationField } from "@/utils/types";

export const LoadedTopDonationsItemDetail = ({
  partyId,
  donations,
}: {
  partyId: ReceiverId;
  donations: Donation[];
}) => {
  if (donations.length === 0) {
    return <Loading />;
  }

  return (
    <TopDonationsItemDetail
      donations={donations.filter((d) => d[DonationField.Receiver] === partyId)}
    />
  );
};

export const TopDonationsItemDetailWithParty = ({
  donations,
}: {
  donations: Donation[];
}) => {
  const locale = useLocale();

  return (
    <TopDonationsItemDetail
      donations={donations}
      renderItemExtra={(donation) => (
        <PartyLink
          className="mx-2 shrink-0"
          party={donation[DonationField.Receiver]}
          locale={locale}
        >
          <PartyDot party={donation[DonationField.Receiver]} />
        </PartyLink>
      )}
    />
  );
};

export const TopDonationsItemDetail = ({
  donations,
  renderItemExtra,
}: {
  donations: Donation[];
  renderItemExtra?: (donation: Donation) => ReactNode;
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const browserBasedLocale = useBrowserBasedLocale();
  const parentRef = useRef<HTMLDivElement>(null);
  const isSm = useBreakpoint("sm");

  const rowVirtualizer = useVirtualizer({
    count: donations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isSm ? 32 : 81) + 1,
    overscan: 5,
    directDomUpdates: true,
    directDomUpdatesMode: "transform",
  });

  const sortedDonations = useMemo(() => donations.toReversed(), [donations]);

  // re-trigger measure if mobile changes
  useEffect(() => {
    rowVirtualizer?.measure?.();
    // We can't have rowVirtualizer in the list of dependency due to its always being recreated and in turn causing the effect to fire
    // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
  }, [isSm]);

  return (
    <div
      className="@container max-h-[500px] overflow-x-hidden overflow-y-auto"
      ref={parentRef}
    >
      <ul
        className="relative w-full"
        aria-label={t("party_donations")}
        ref={rowVirtualizer.containerRef}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const donation = sortedDonations[virtualItem.index];

          return (
            <li
              key={virtualItem.key}
              ref={rowVirtualizer.measureElement}
              data-index={virtualItem.index}
              className="border-border absolute top-0 right-0 left-0 flex w-full items-center justify-between space-x-2 border-t first:border-t-0"
            >
              <RankingItemLine
                className="overflow-hidden pr-2"
                year={donationYear(donation)}
                label={getDonationDonorName(donation, tCommon)}
                date={donation[DonationField.Date]}
                amount={donation[DonationField.Amount]}
                locale={browserBasedLocale}
                country={country}
              >
                <div className="flex items-center space-x-1 truncate">
                  <DonorLink
                    className="truncate"
                    donor={donation[DonationField.DonorName]}
                  />
                </div>
                {renderItemExtra?.(donation)}
              </RankingItemLine>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

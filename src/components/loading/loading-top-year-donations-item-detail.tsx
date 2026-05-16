"use client";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Donation, ReceiverId } from "@/utils/types";

import { RankingItemLine } from "@/components/donations/ranking-item-line";
import { DonorLink } from "@/components/donors/donor-link";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { useDonationsByYears } from "@/hooks/use-api";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useBreakpoint } from "@/hooks/use-media-query";
import { useVirtual } from "@/hooks/use-virtual";
import { isNotNullandNotUndefined } from "@/utils/array";
import { donationYear } from "@/utils/date";
import { getDonationDonorName } from "@/utils/donor";
import { DonationField } from "@/utils/types";

import { Skeleton } from "./skeleton";

const TopDonationsItemDetailSkeleton = () => {
  return (
    <div className="py-1.5" aria-label="Loading donations">
      <div className="items-center justify-between border-t border-gray-950/10 first:border-t-0 sm:flex sm:space-x-2">
        <div className="mb-2 grow flex-wrap justify-between space-y-2 px-1 py-1.5 leading-none sm:mb-0 sm:flex sm:space-y-0">
          <Skeleton className="h-4 w-16 basis-1/2 sm:mr-2 sm:basis-auto" />
          <div className="grow basis-full sm:order-none sm:mt-1.5 sm:basis-auto">
            <Skeleton className="order-last h-4 w-40" emphasis />
          </div>
          <Skeleton className="h-4 w-20 shrink-0 basis-1/2 sm:basis-auto" />
        </div>
      </div>
    </div>
  );
};

export const LoadingTopYearDonationsItemDetail = ({
  showDonationParty = false,
  country,
  years,
  partyId,
}: {
  showDonationParty?: boolean;
  country: CountryConfig;
  years: string[];
  partyId: ReceiverId;
}) => {
  const t = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading)
    return (
      <div
        className="cursor-wait"
        aria-label={t("loading")}
        title={t("loading")}
      >
        <TopDonationsItemDetailSkeleton />
      </div>
    );
  if (error) return <div>{t("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <TopDonationsItemDetail
      country={country}
      donations={donations.filter((d) => d[DonationField.Receiver] === partyId)}
      showDonationParty={showDonationParty}
    />
  );
};

export const LoadedTopDonationsItemDetail = ({
  showDonationParty = false,
  country,
  partyId,
  donations,
}: {
  showDonationParty?: boolean;
  country: CountryConfig;
  partyId: ReceiverId;
  donations: Donation[];
}) => {
  return (
    <TopDonationsItemDetail
      country={country}
      donations={donations.filter((d) => d[DonationField.Receiver] === partyId)}
      showDonationParty={showDonationParty}
    />
  );
};

export const TopDonationsItemDetail = ({
  showDonationParty = false,
  country,
  donations,
}: {
  showDonationParty?: boolean;
  country: CountryConfig;
  donations: Donation[];
}) => {
  const t = useTranslations();
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const parentRef = useRef<HTMLDivElement>(null);
  const isSm = useBreakpoint("sm");

  const rowVirtualizer = useVirtual({
    count: donations.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (isSm ? 32 : 81) + 1,
    overscan: 5,
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
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const donation = sortedDonations[virtualItem.index];

          return (
            <li
              key={virtualItem.key}
              className="absolute top-0 right-0 left-0 flex w-full items-center justify-between space-x-2 border-t border-gray-950/10 first:border-t-0"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
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
                    country={country}
                  />
                </div>
                {showDonationParty && (
                  <PartyLink
                    className="mx-2 shrink-0"
                    party={donation[DonationField.Receiver]}
                    country={country}
                    locale={locale}
                  >
                    <PartyDot
                      party={donation[DonationField.Receiver]}
                      country={country}
                    />
                  </PartyLink>
                )}
              </RankingItemLine>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

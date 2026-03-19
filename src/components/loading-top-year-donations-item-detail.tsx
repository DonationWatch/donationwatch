"use client";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useRef } from "react";

import { DonorLink } from "./donor-link";
import { PartyDot } from "./party-dot";
import { PartyLink } from "./party-link";
import { RankingItemLine } from "./ranking-item-line";
import { Skeleton } from "./skeleton";
import { useDonationsByYears } from "../hooks/use-api";
import { useBreakpoint } from "../hooks/use-media-query";
import { useVirtual } from "../hooks/use-virtual";
import { isNotNullandNotUndefined } from "../utils/array";
import { donationYear } from "../utils/date";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, ReceiverId } from "../utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonationDonorName } from "@/utils/donor";

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
  }, [isSm, rowVirtualizer]);

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
                locale={locale}
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

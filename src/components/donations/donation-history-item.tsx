"use client";

import { useLocale } from "next-intl";

import type { ReceiverId } from "@/utils/types";

import { DonorLink } from "@/components/donors/donor-link";
import { PartyDot } from "@/components/parties/party-dot";
import { PartyLink } from "@/components/parties/party-link";
import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { formatCountryCurrency } from "@/utils/formatter";

import { DynamicDonationHistoryDate } from "./dynamic-donation-history-date";

export const DonationHistoryItem = ({
  date,
  amount,
  party,
  donor,
}: {
  date: string;
  party: ReceiverId;
  donor: string;
  amount: number;
}) => {
  const country = useRequiredCountryConfig();
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();
  const fmtAmount = formatCountryCurrency(browserBasedLocale, amount, country);

  return (
    <li
      aria-label={`${party}: ${fmtAmount} ${donor}`}
      className="flex justify-between space-x-2 rounded-sm p-2 odd:bg-white dark:odd:bg-zinc-900/25"
    >
      <div className="grow space-y-1 overflow-hidden">
        <div className="flex justify-between overflow-hidden text-gray-700 dark:text-gray-400">
          <DynamicDonationHistoryDate date={date} />
          <PartyLink
            className="overflow-hidden px-2"
            party={party}
            locale={locale}
          >
            <PartyDot
              className="overflow-hidden text-sm"
              nameClassName="truncate"
              party={party}
            />
          </PartyLink>
        </div>
        <div className="justify-between space-y-1 sm:flex sm:space-y-0">
          <div className="truncate">
            <DonorLink donor={donor} />
          </div>
          <div className="shrink-0 text-sm font-semibold sm:ml-2 sm:text-base">
            {fmtAmount}
          </div>
        </div>
      </div>
    </li>
  );
};

"use client";
import { useLocale } from "next-intl";

import { DonorLink } from "./donor-link";
import { DynamicDonationHistoryDate } from "./dynamic-donation-history-date";
import { PartyDot } from "./party-dot";
import { PartyLink } from "./party-link";
import { formatCountryCurrency } from "../utils/formatter";

import type { CountryConfig } from "../utils/countries";
import type { ReceiverId } from "../utils/types";

export const DonationHistoryItem = ({
  date,
  amount,
  party,
  donor,
  country,
}: {
  date: string;
  party: ReceiverId;
  donor: string;
  amount: number;
  country: CountryConfig;
}) => {
  const locale = useLocale();
  const fmtAmount = formatCountryCurrency(locale, amount, country);

  const now = Date.now();

  return (
    <li
      aria-label={`${party}: ${fmtAmount} ${donor}`}
      className="flex justify-between space-x-2 rounded-sm p-2 odd:bg-white dark:odd:bg-slate-900"
    >
      <div className="grow space-y-1 overflow-hidden">
        <div className="flex justify-between overflow-hidden text-gray-700 dark:text-gray-400">
          <DynamicDonationHistoryDate date={date} now={now} />
          <PartyLink
            className="overflow-hidden px-2"
            party={party}
            country={country}
            locale={locale}
          >
            <PartyDot
              className="overflow-hidden text-sm"
              nameClassName="truncate"
              party={party}
              country={country}
            />
          </PartyLink>
        </div>
        <div className="justify-between space-y-1 sm:flex sm:space-y-0">
          <div className="truncate">
            <DonorLink country={country} donor={donor} />
          </div>
          <div className="shrink-0 text-sm font-semibold sm:ml-2 sm:text-base">
            {fmtAmount}
          </div>
        </div>
      </div>
    </li>
  );
};

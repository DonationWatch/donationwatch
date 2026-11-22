"use client";
import { dateDiffInDays, donationYear } from "@donationwatch/core/utils/date";
import {
  formatDate,
  formatRelativeDate,
} from "@donationwatch/core/utils/formatter";
import { DonationField } from "@donationwatch/core/utils/types";
import { useState } from "react";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";

export const DonationHistoryDate = ({ date }: { date: string }) => {
  const [now] = useState(() => Date.now());
  const browserBasedLocale = useBrowserBasedLocale();

  if (date === donationYear({ [DonationField.Date]: date }))
    return <div className="shrink-0 text-sm">{date}</div>;

  const dateDate = new Date(date);
  const fmtDate = formatDate(browserBasedLocale, dateDate);
  const dateDiff = dateDiffInDays(new Date(now), dateDate);

  return (
    <div className="shrink-0 text-sm">
      <time dateTime={dateDate.toISOString()}>{fmtDate}</time>

      {dateDiff !== 0 ? (
        <span className="hidden lg:inline">
          &nbsp;({formatRelativeDate(browserBasedLocale, dateDiff, "days")})
        </span>
      ) : null}
    </div>
  );
};

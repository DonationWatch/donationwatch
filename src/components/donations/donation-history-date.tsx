"use client";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { dateDiffInDays, donationYear } from "@/utils/date";
import { formatDate, formatRelativeDate } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const DonationHistoryDate = ({ date }: { date: string }) => {
  const now = Date.now();
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

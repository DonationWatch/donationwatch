"use client";
import { useLocale } from "next-intl";

import { dateDiffInDays, donationYear } from "../utils/date";
import { formatDate, formatRelativeDate } from "../utils/formatter";
import { DonationField } from "../utils/types";

export const DonationHistoryDate = ({
  date,
  now,
}: {
  date: string;
  now: number;
}) => {
  const locale = useLocale();

  if (date === donationYear({ [DonationField.Date]: date }))
    return <div className="shrink-0 text-sm">{date}</div>;

  const dateDate = new Date(date);
  const fmtDate = formatDate(locale, dateDate);
  const dateDiff = dateDiffInDays(new Date(now), dateDate);

  return (
    <div className="shrink-0 text-sm">
      <time dateTime={dateDate.toISOString()}>{fmtDate}</time>

      {dateDiff !== 0 ? (
        <span className="hidden lg:inline">
          &nbsp;({formatRelativeDate(locale, dateDiff, "days")})
        </span>
      ) : null}
    </div>
  );
};

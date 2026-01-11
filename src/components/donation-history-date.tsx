"use client";

import { useTranslations } from "../hooks/use-translations";
import { dateDiffInDays, donationYear } from "../utils/date";
import { formatDate, formatRelativeDate } from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { FC } from "react";

export const DonationHistoryDate: FC<{
  date: string;
  now: number;
}> = ({ date, now }) => {
  const { locale } = useTranslations();

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

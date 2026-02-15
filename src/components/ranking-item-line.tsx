import { cn } from "../utils/classname";
import { donationYear } from "../utils/date";
import { formatCountryCurrency, formatTwoDigitDate } from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { ConstLocale } from "../utils/locales";
import type { PropsWithChildren } from "react";

export const RankingItemLine = ({
  country,
  className,
  year,
  amount,
  label,
  date,
  children,
  locale,
}: PropsWithChildren<{
  label: string;
  date: string;
  amount: number;
  locale: ConstLocale;
  country: CountryConfig;
  year: string;
  className?: string;
}>) => {
  const fmtAmount = formatCountryCurrency(locale, amount, country);

  return (
    <section
      aria-label={`${fmtAmount} ${label}`}
      className={cn(
        "mb-2 grow flex-wrap items-center justify-between space-y-2 border-t border-gray-950/10 px-1 py-1.5 leading-none first:border-t-0 odd:bg-white/5 sm:mb-0 sm:flex sm:flex-nowrap sm:space-y-0 dark:odd:bg-slate-900/5",
        className,
      )}
    >
      {date !== donationYear({ [DonationField.Date]: date }) ? (
        <time
          dateTime={date}
          className="basis-1/2 font-mono sm:mr-2 sm:basis-auto"
        >
          {formatTwoDigitDate(locale, new Date(date))}
        </time>
      ) : (
        <div className="basis-1/2 font-mono sm:mr-2 sm:basis-auto">{year}</div>
      )}
      <div className="order-last flex grow basis-full justify-between overflow-hidden font-semibold sm:order-none sm:basis-auto">
        {children}
      </div>
      <div className="shrink-0 basis-1/2 tabular-nums sm:basis-auto sm:text-right">
        {fmtAmount}
      </div>
    </section>
  );
};

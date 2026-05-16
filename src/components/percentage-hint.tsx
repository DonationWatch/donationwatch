import type { BrowserBasedLocale } from "@/utils/locales";

import { formatPercentFormat } from "@/utils/formatter";

export const PercentageHint = ({
  browserBasedLocale,
  percentage,
}: {
  browserBasedLocale: BrowserBasedLocale;
  percentage: number;
}) => {
  return (
    <span className="hidden w-14 text-right text-gray-500 tabular-nums lg:block dark:text-gray-400">
      ({formatPercentFormat(browserBasedLocale, percentage)})
    </span>
  );
};

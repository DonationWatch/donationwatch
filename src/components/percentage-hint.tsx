import { formatPercentFormat } from "../utils/formatter";

import type { ConstLocale } from "../utils/locales";

export const PercentageHint = ({
  locale,
  percentage,
}: {
  locale: ConstLocale;
  percentage: number;
}) => {
  return (
    <span className="hidden w-14 text-right text-gray-500 tabular-nums lg:block dark:text-gray-400">
      ({formatPercentFormat(locale, percentage)})
    </span>
  );
};

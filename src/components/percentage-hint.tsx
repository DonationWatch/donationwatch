import { formatPercentFormat } from "../utils/formatter";

import type { ConstLocale } from "../utils/locales";
import type { FC } from "react";

export const PercentageHint: FC<{
  locale: ConstLocale;
  percentage: number;
}> = ({ locale, percentage }) => {
  return (
    <span className="hidden w-14 text-right text-gray-500 tabular-nums lg:block dark:text-gray-400">
      ({formatPercentFormat(locale, percentage)})
    </span>
  );
};

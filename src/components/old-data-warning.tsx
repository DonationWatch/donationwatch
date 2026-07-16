"use client";

import { Snail } from "lucide-react";

import type { CountryConfig } from "@/types/country-config";

import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { OLD_DATA_MONTHS_THRESHOLD } from "@/utils/config";
import { getCountryName } from "@/utils/countries";
import { formatDate } from "@/utils/formatter";

export const checkOldData = (lastDonationDate?: string) => {
  if (!lastDonationDate) {
    return { isOld: false, lastDate: null, lastDonationDate: null };
  }

  let lastDate: Date;
  if (lastDonationDate.length === 4) {
    lastDate = new Date(`${lastDonationDate}-12-31T00:00:00Z`);
  } else {
    lastDate = new Date(lastDonationDate);
  }

  if (isNaN(lastDate.getTime())) {
    return { isOld: false, lastDate: null, lastDonationDate: null };
  }

  const thresholdDate = new Date();
  thresholdDate.setMonth(thresholdDate.getMonth() - OLD_DATA_MONTHS_THRESHOLD);
  const isOld = lastDate < thresholdDate;

  return { isOld, lastDate, lastDonationDate };
};

export const OldDataWarning = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
  const locale = useBrowserBasedLocale();
  const t = useTranslations("old_data_warning");
  const tCountries = useTranslations("countries");

  const { isOld, lastDate, lastDonationDate } = checkOldData(
    countryConfig.lastDonationDate,
  );

  if (!isOld || !lastDate || !lastDonationDate) return null;

  // Format date nicely
  const formattedDate =
    lastDonationDate.length === 4
      ? lastDonationDate
      : formatDate(locale, lastDate);

  return (
    <div
      role="alert"
      className="card card--warn inline-flex flex-col justify-between gap-6 rounded-lg !py-2 text-sm lg:flex-row lg:items-center"
    >
      <div className="flex items-center gap-3">
        <Snail size={18} />
        <div className="whitespace-pre-wrap">
          {t("description", {
            country: getCountryName(countryConfig, tCountries),
            date: formattedDate,
            source: countryConfig.source.name,
          })}
        </div>
      </div>
    </div>
  );
};

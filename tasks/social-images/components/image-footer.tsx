"use client";

/* eslint-disable react/no-unknown-property */

import type { CountryConfig } from "@/utils/countries";
import type { ConstLocale } from "@/utils/locales";

import { isNotNullandNotUndefined } from "@/utils/array";
import { formatCompactCountryCurrency, formatDate } from "@/utils/formatter";
import { getBuild } from "@/utils/loader/build";

import type { CreateTranslator } from "../utils";

export const ImageFooter = ({
  getTranslations,
  country,
  locale,
}: {
  getTranslations: CreateTranslator;
  locale: ConstLocale;
  country: CountryConfig;
}) => {
  const t = getTranslations();

  return (
    <div tw="shrink-0 flex flex-col text-sm text-slate-600 justify-end px-4 pb-2 font-semibold">
      <div tw="flex justify-start">
        {[
          t("footer.build_since", {
            date: formatDate(locale, new Date(getBuild(country.id).t)),
            year: country.minYear,
          }),
          t("over_min_public_amount", {
            amount: formatCompactCountryCurrency(
              locale,
              country.minPublicDonationAmount,
              country,
            ),
          }),
          country.knownPartyRequirements
            ? t("over_threshold", {
                type:
                  country.knownPartyRequirements.count === -1
                    ? "sum"
                    : country.knownPartyRequirements.sum === -1
                      ? "count"
                      : "both",
                count: country.knownPartyRequirements.count,
                sum: formatCompactCountryCurrency(
                  locale,
                  country.knownPartyRequirements.sum,
                  country,
                ),
              })
            : undefined,
        ]
          .filter(isNotNullandNotUndefined)
          .join(", ")}
      </div>
      <div tw="flex justify-start">
        {[
          t("footer.published_by", {
            source: country.source.name,
          }),
          country.preliminaryDataSince
            ? t("prelim_data", {
                year: country.preliminaryDataSince!,
              })
            : null,
        ]
          .filter(isNotNullandNotUndefined)
          .join(", ")}
      </div>
    </div>
  );
};

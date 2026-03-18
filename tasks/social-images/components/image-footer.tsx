"use client";

/* eslint-disable react/no-unknown-property */

import { isNotNullandNotUndefined } from "../../../src/utils/array";
import {
  formatCompactCountryCurrency,
  formatDate,
} from "../../../src/utils/formatter";
import { getBuild } from "../../../src/utils/loader/build";

import type { CountryConfig } from "../../../src/utils/countries";
import type { ConstLocale } from "../../../src/utils/locales";
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
      <div tw="flex justify-end">
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

/* eslint-disable react/no-unknown-property */

import { t } from "../../../src/app/[locale]/translations";
import { isNotNullandNotUndefined } from "../../../src/utils/array";
import {
  formatCompactCountryCurrency,
  formatDate,
} from "../../../src/utils/formatter";
import { getBuild } from "../../../src/utils/loader/build";

import type { Translations } from "../../../src/messages/translations";
import type { CountryConfig } from "../../../src/utils/countries";
import type { ConstLocale } from "../../../src/utils/locales";

export const ImageFooter = ({
  translations,
  country,
  locale,
}: {
  translations: Translations;
  locale: ConstLocale;
  country: CountryConfig;
}) => {
  return (
    <div tw="shrink-0 flex flex-col text-sm text-slate-600 justify-end pr-4 pb-2 font-semibold">
      <div tw="flex justify-end">
        {[
          t(translations.footer.build_since, {
            date: formatDate(locale, new Date(getBuild(country.id).t)),
            year: country.minYear,
          }),
          t(translations.over_min_public_amount, {
            amount: formatCompactCountryCurrency(
              locale,
              country.minPublicDonationAmount,
              country,
            ),
          }),
          country.knownPartyRequirements
            ? t(translations.over_threshold, {
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
          t(translations.footer.published_by, {
            source: country.source.name,
          }),
          country.preliminaryDataSince
            ? t(translations.prelim_data, {
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

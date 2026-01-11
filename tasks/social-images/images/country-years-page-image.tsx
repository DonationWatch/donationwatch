import { donationYear } from "../../../src/utils/date";
import { ImageFooter } from "../components/image-footer";
import { ImageYearsHeader } from "../components/image-years-header";
import { ThumbnailWrapper } from "../components/utils";

import type { Translations } from "../../../src/messages/translations";
import type { CountryConfig } from "../../../src/utils/countries";
import type { PartyYearsSums } from "../../../src/utils/loader/party-years-sums";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation } from "../../../src/utils/types";

export const CountryYearsPageImage = async (
  locale: ConstLocale,
  countryConfig: CountryConfig,
  translations: Translations,
  donations: Donation[],
  years: string[],
  partyYearSums: PartyYearsSums,
) => {
  return (
    <ThumbnailWrapper>
      <ImageYearsHeader
        donations={donations.filter((donation) =>
          years.includes(donationYear(donation)),
        )}
        country={countryConfig}
        translations={translations}
        locale={locale}
        years={years}
        partyYearSums={partyYearSums}
      />
      <ImageFooter
        country={countryConfig}
        translations={translations}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};

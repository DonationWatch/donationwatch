import { donationYear } from "../../../src/utils/date";
import { ImageFooter } from "../components/image-footer";
import { ImageYearsHeader } from "../components/image-years-header";
import { ThumbnailWrapper } from "../components/utils";

import type { CountryConfig } from "../../../src/utils/countries";
import type { PartyYearsSums } from "../../../src/utils/loader/party-years-sums";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation } from "../../../src/utils/types";
import type { CreateTranslator } from "../utils";

export const CountryYearsPageImage = async (
  locale: ConstLocale,
  getTranslations: CreateTranslator,
  countryConfig: CountryConfig,
  donations: Donation[],
  years: string[],
  partyYearSums: PartyYearsSums,
) => {
  return (
    <ThumbnailWrapper>
      <ImageYearsHeader
        getTranslations={getTranslations}
        donations={donations.filter((donation) =>
          years.includes(donationYear(donation)),
        )}
        country={countryConfig}
        locale={locale}
        years={years}
        partyYearSums={partyYearSums}
      />
      <ImageFooter
        getTranslations={getTranslations}
        country={countryConfig}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};

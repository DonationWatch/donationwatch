import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { ImageLocale } from "@donationwatch/core/utils/locales";
import type { Donation } from "@donationwatch/core/utils/types";
import type { PartyYearsSums } from "@donationwatch/data/loader/party-years-sums";

import { donationYear } from "@donationwatch/core/utils/date";

import type { CreateTranslator } from "../utils";

import { ImageFooter } from "../components/image-footer";
import { ImageYearsHeader } from "../components/image-years-header";
import { ThumbnailWrapper } from "../components/utils";

export const CountryYearsPageImage = async (
  locale: ImageLocale,
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

import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";
import type { ConstLocale } from "@/utils/locales";
import type { Donation } from "@/utils/types";

import { donationYear } from "@/utils/date";

import type { CreateTranslator } from "../utils";

import { ImageFooter } from "../components/image-footer";
import { ImageYearsHeader } from "../components/image-years-header";
import { ThumbnailWrapper } from "../components/utils";

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

import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { ImageLocale } from "@donationwatch/core/utils/locales";
import type { Donation } from "@donationwatch/core/utils/types";
import type { BigDonor } from "@donationwatch/data/loader/biggest-donors";

import { DonationField } from "@donationwatch/core/utils/types";

import type { CreateTranslator } from "../utils";

import { DonorHeader } from "../components/donor-header";
import { ImageFooter } from "../components/image-footer";
import { ThumbnailWrapper } from "../components/utils";

export const DonorImage = async (
  locale: ImageLocale,
  getTranslations: CreateTranslator,
  countryConfig: CountryConfig,
  donor: BigDonor,
  donations: Donation[],
) => {
  return (
    <ThumbnailWrapper>
      <DonorHeader
        getTranslations={getTranslations}
        donor={donor}
        donations={donations.filter(
          (donation) => donor.name === donation[DonationField.DonorName],
        )}
        country={countryConfig}
        locale={locale}
      />
      <ImageFooter
        getTranslations={getTranslations}
        country={countryConfig}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};

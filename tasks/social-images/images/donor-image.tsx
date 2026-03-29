import type { CountryConfig } from "@/types/country-config";
import type { BigDonor } from "@/utils/loader/biggest-donors";
import type { ConstLocale } from "@/utils/locales";
import type { Donation } from "@/utils/types";

import { DonationField } from "@/utils/types";

import type { CreateTranslator } from "../utils";

import { DonorHeader } from "../components/donor-header";
import { ImageFooter } from "../components/image-footer";
import { ThumbnailWrapper } from "../components/utils";

export const DonorImage = async (
  locale: ConstLocale,
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

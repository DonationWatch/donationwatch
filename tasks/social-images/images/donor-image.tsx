import { DonationField } from "../../../src/utils/types";
import { DonorHeader } from "../components/donor-header";
import { ImageFooter } from "../components/image-footer";
import { ThumbnailWrapper } from "../components/utils";

import type { CountryConfig } from "../../../src/utils/countries";
import type { BigDonor } from "../../../src/utils/loader/biggest-donors";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation } from "../../../src/utils/types";
import type { CreateTranslator } from "../utils";

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

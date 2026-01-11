import { DonationField } from "../../../src/utils/types";
import { DonorHeader } from "../components/donor-header";
import { ImageFooter } from "../components/image-footer";
import { ThumbnailWrapper } from "../components/utils";

import type { Translations } from "../../../src/messages/translations";
import type { CountryConfig } from "../../../src/utils/countries";
import type { BigDonor } from "../../../src/utils/loader/biggest-donors";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation } from "../../../src/utils/types";

export const DonorImage = async (
  locale: ConstLocale,
  countryConfig: CountryConfig,
  translations: Translations,
  donor: BigDonor,
  donations: Donation[],
) => {
  return (
    <ThumbnailWrapper>
      <DonorHeader
        donor={donor}
        donations={donations.filter(
          (donation) => donor.name === donation[DonationField.DonorName],
        )}
        country={countryConfig}
        translations={translations}
        locale={locale}
      />
      <ImageFooter
        country={countryConfig}
        translations={translations}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};

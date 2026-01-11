import { DonationField } from "../../../src/utils/types";
import { ImageFooter } from "../components/image-footer";
import { ImagePartyHeader } from "../components/image-party-header";
import { ThumbnailWrapper } from "../components/utils";

import type { Translations } from "../../../src/messages/translations";
import type { CountryConfig } from "../../../src/utils/countries";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation, ReceiverId } from "../../../src/utils/types";

export const PartyPageImage = async (
  locale: ConstLocale,
  countryConfig: CountryConfig,
  translations: Translations,
  partyId: ReceiverId,
  donations: Donation[],
) => {
  const party = countryConfig.partiesById[partyId];

  return (
    <ThumbnailWrapper>
      <ImagePartyHeader
        donations={donations.filter(
          (donation) => donation[DonationField.Receiver] === party.id,
        )}
        country={countryConfig}
        translations={translations}
        locale={locale}
        party={party}
      />
      <ImageFooter
        country={countryConfig}
        translations={translations}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};

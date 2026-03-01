import { DonationField } from "../../../src/utils/types";
import { ImageFooter } from "../components/image-footer";
import { ImagePartyHeader } from "../components/image-party-header";
import { ThumbnailWrapper } from "../components/utils";

import type { CountryConfig } from "../../../src/utils/countries";
import type { ConstLocale } from "../../../src/utils/locales";
import type { Donation, ReceiverId } from "../../../src/utils/types";
import type { CreateTranslator } from "../utils";

export const PartyPageImage = async (
  locale: ConstLocale,
  getTranslations: CreateTranslator,
  countryConfig: CountryConfig,
  partyId: ReceiverId,
  donations: Donation[],
) => {
  const party = countryConfig.parties.find((p) => p.id === partyId)!;

  return (
    <ThumbnailWrapper>
      <ImagePartyHeader
        getTranslations={getTranslations}
        donations={donations.filter(
          (donation) => donation[DonationField.Receiver] === party.id,
        )}
        country={countryConfig}
        locale={locale}
        party={party}
      />
      <ImageFooter
        getTranslations={getTranslations}
        country={countryConfig}
        locale={locale}
      />
    </ThumbnailWrapper>
  );
};

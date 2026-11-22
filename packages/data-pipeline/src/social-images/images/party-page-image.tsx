import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { ImageLocale } from "@donationwatch/core/utils/locales";
import type { Donation, ReceiverId } from "@donationwatch/core/utils/types";

import { PartyField } from "@donationwatch/core/types/party";
import { DonationField } from "@donationwatch/core/utils/types";
import { getParty } from "@donationwatch/data/config/parties";

import type { CreateTranslator } from "../utils";

import { ImageFooter } from "../components/image-footer";
import { ImagePartyHeader } from "../components/image-party-header";
import { ThumbnailWrapper } from "../components/utils";

export const PartyPageImage = async (
  locale: ImageLocale,
  getTranslations: CreateTranslator,
  countryConfig: CountryConfig,
  partyId: ReceiverId,
  donations: Donation[],
) => {
  const party = getParty(countryConfig.id, partyId)!;

  return (
    <ThumbnailWrapper>
      <ImagePartyHeader
        getTranslations={getTranslations}
        donations={donations.filter(
          (donation) =>
            donation[DonationField.Receiver] === party[PartyField.Id],
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

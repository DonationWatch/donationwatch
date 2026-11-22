import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { ConstLocale } from "@donationwatch/core/utils/locales";

import { PartyField } from "@donationwatch/core/types/party";
import { getPartiesSync } from "@donationwatch/data/config/parties";

import { PartyPillList } from "@/components/parties/party-pill-list";

export const PartiesHero = ({
  country,
  locale,
}: {
  country: CountryConfig;
  locale: ConstLocale;
}) => {
  const parties = getPartiesSync(country.id);
  const allParties = parties.toSorted(
    (a, b) => b[PartyField.Sum] - a[PartyField.Sum],
  );

  return (
    <PartyPillList allParties={allParties} country={country} locale={locale} />
  );
};

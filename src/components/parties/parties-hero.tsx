import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";

import { PartyPillList } from "@/components/parties/party-pill-list";
import { getPartiesSync } from "@/config/parties";
import { PartyField } from "@/types/party";

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

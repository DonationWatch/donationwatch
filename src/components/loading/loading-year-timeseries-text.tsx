"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { Donation } from "@/utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { PartyField } from "@/types/party";
import { getCountryName } from "@/utils/countries";
import { donationYear } from "@/utils/date";
import { formatYearsRange } from "@/utils/formatter";
import { DonationField } from "@/utils/types";

export const YearTimeseriesText = ({
  parties,
  years,
  country,
  donations,
}: {
  country: CountryConfig;
  parties: Party[];
  years: string[];
  donations: Donation[];
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p[PartyField.Id]));

  const uniqueDonationDates = new Set<string>();

  donations.forEach((donation: Donation & { [DonationField.Date]: string }) => {
    if (donation[DonationField.Date] === donationYear(donation)) return;
    if (!yearsSet.has(donationYear(donation))) return;
    if (!partiesSet.has(donation[DonationField.Receiver])) return;

    uniqueDonationDates.add(donation[DonationField.Date]);
  });

  return (
    <p>
      {t("timeline.days", {
        years: formatYearsRange(years),
        country: getCountryName(country, tCountries),
        n: uniqueDonationDates.size,
      })}
    </p>
  );
};

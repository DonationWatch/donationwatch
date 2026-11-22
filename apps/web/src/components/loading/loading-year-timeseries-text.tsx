"use client";

import type { Party } from "@donationwatch/core/types/party";
import type { Donation } from "@donationwatch/core/utils/types";

import { PartyField } from "@donationwatch/core/types/party";
import { getCountryName } from "@donationwatch/core/utils/countries";
import { donationYear } from "@donationwatch/core/utils/date";
import { formatYearsRange } from "@donationwatch/core/utils/formatter";
import { DonationField } from "@donationwatch/core/utils/types";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const YearTimeseriesText = ({
  parties,
  years,
  donations,
}: {
  parties: Party[];
  years: string[];
  donations: Donation[];
}) => {
  const country = useRequiredCountryConfig();
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

"use client";

import Loading from "./loading";
import { useDonationsByYears } from "../hooks/use-api";
import { isNotNullandNotUndefined } from "../utils/array";
import { getCountryName } from "../utils/countries";
import { donationYear } from "../utils/date";
import { formatYearsRange } from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation, Party } from "../utils/types";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const LoadingYearTimeseriesText = ({
  parties,
  years,
  country,
}: {
  country: CountryConfig;
  parties: Party[];
  years: string[];
}) => {
  const t = useTranslations();
  const tData = useTranslations("data");
  const tCountries = useTranslations("countries");
  const results = useDonationsByYears(country, years);

  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  const yearsSet = new Set<string>(years);
  const partiesSet = new Set<string>(parties.map((p) => p.id));
  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

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

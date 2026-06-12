import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import { ClientDonationStackedYears } from "@/components/charts/client-donation-stacked-years";

import { donationStackedYearsPartySumsData } from "./donation-stacked-years-data";

export const DonationStackedYears = ({
  country,
  partyYearsSums,
}: {
  country: CountryConfig;
  partyYearsSums: PartyYearsSums;
}) => {
  const data = donationStackedYearsPartySumsData(partyYearsSums);

  return <ClientDonationStackedYears country={country} data={data} />;
};

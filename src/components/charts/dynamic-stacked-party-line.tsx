import type { CountryConfig } from "@/types/country-config";
import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import {
  ClientAbsoluteMultiplePartySumsGradient,
  ClientStackedPartyDonations,
} from "./client-dynamic-stacked-party-line";
import { partyYearsSumsToStackedConfig } from "./stacked-party-line-config";

export const DynamicStackedPartyDonations = ({
  country,
  years,
  partyYearsSums,
  direction,
}: {
  country: CountryConfig;
  years: string[];
  partyYearsSums: PartyYearsSums;
  direction?: "horizontal" | "vertical";
}) => {
  const data = partyYearsSumsToStackedConfig(years, partyYearsSums);
  return (
    <ClientStackedPartyDonations
      country={country}
      data={data}
      direction={direction}
    />
  );
};

export const DynamicAbsoluteMultiplePartySumsGradient = ({
  country,
  years,
  partyYearsSums,
}: {
  country: CountryConfig;
  years: string[];
  partyYearsSums: PartyYearsSums;
}) => {
  const data = partyYearsSumsToStackedConfig(years, partyYearsSums);
  return (
    <ClientAbsoluteMultiplePartySumsGradient country={country} data={data} />
  );
};

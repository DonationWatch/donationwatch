import type { PartyYearsSums } from "@/utils/loader/party-years-sums";

import {
  AbsoluteMultiplePartySumsGradient,
  StackedPartyDonations,
} from "./stacked-party-line";
import { partyYearsSumsToStackedConfig } from "./stacked-party-line-config";

export const DynamicStackedPartyDonations = ({
  years,
  partyYearsSums,
  direction,
}: {
  years: string[];
  partyYearsSums: PartyYearsSums;
  direction?: "horizontal" | "vertical";
}) => {
  const data = partyYearsSumsToStackedConfig(years, partyYearsSums);
  return <StackedPartyDonations data={data} direction={direction} />;
};

export const DynamicAbsoluteMultiplePartySumsGradient = ({
  years,
  partyYearsSums,
}: {
  years: string[];
  partyYearsSums: PartyYearsSums;
}) => {
  const data = partyYearsSumsToStackedConfig(years, partyYearsSums);
  return <AbsoluteMultiplePartySumsGradient data={data} />;
};

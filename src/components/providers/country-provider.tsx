"use client";

import type { ReactNode } from "react";

import { createContext, useContext } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";
import type { ReceiverId } from "@/utils/types";

import { PartyField } from "@/types/party";

interface CountryContextValue {
  countryConfig: CountryConfig;
  parties: Party[];
}

export type PartiesMap = Record<ReceiverId, Party>;

const CountryContext = createContext<CountryContextValue | null>(null);

export interface CountryProviderProps {
  countryConfig: CountryConfig;
  parties?: Party[];
  children: ReactNode;
}

export const CountryProvider = ({
  countryConfig,
  parties = [],
  children,
}: CountryProviderProps) => {
  return (
    <CountryContext.Provider value={{ countryConfig, parties }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useRequiredCountryConfig = (): CountryConfig => {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error("useCountryConfig must be used within a CountryProvider");
  }
  return ctx.countryConfig;
};

export const useOptionalCountryConfig = (): CountryConfig | null => {
  const ctx = useContext(CountryContext);
  return ctx?.countryConfig ?? null;
};

export const useParties = (): Party[] => {
  const ctx = useContext(CountryContext);
  if (!ctx) {
    throw new Error("useParties must be used within a CountryProvider");
  }
  return ctx.parties;
};

export const usePartiesMap = (): PartiesMap => {
  const parties = useParties();
  const partiesMap: PartiesMap = {};

  parties.forEach((party) => {
    partiesMap[party[PartyField.Id]] = party;
  });

  return partiesMap;
};

export const useParty = (partyId: ReceiverId): Party => {
  const partiesMap = usePartiesMap();
  return partiesMap[partyId] as Party;
};

"use client";

import type { Messages } from "next-intl";
import type { ReactNode } from "react";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { FilterProvider } from "@/components/filter/filter-context";
import { ScopedClientIntlProvider } from "@/components/i18n/scoped-provider";
import { CountryProvider } from "@/components/providers/country-provider";

export interface CountryLayoutProvidersProps {
  countryConfig: CountryConfig;
  parties: Party[];
  filterMessages: Partial<Messages>;
  children: ReactNode;
}

export function CountryLayoutProviders({
  countryConfig,
  parties,
  filterMessages,
  children,
}: CountryLayoutProvidersProps) {
  return (
    <CountryProvider countryConfig={countryConfig} parties={parties}>
      <FilterProvider>
        <ScopedClientIntlProvider messages={filterMessages}>
          {children}
        </ScopedClientIntlProvider>
      </FilterProvider>
    </CountryProvider>
  );
}

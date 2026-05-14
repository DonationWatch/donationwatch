"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { DonationPartyOrigin } from "@/components/donations/donation-origin";
import Loading from "@/components/loading/loading";
import { useDonationsByParty } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

interface PartyOriginClientPageProps {
  country: CountryConfig;
  party: Party;
  years: string[];
}

export const PartyOriginClientPage = ({
  country,
  party,
  years,
}: PartyOriginClientPageProps) => {
  const tData = useTranslations("data");
  const { data, error, isLoading, isSuccess } = useDonationsByParty(
    country,
    party,
  );

  useScrollToHash(isSuccess);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{tData("error")}</div>;

  return (
    <DonationPartyOrigin
      country={country}
      party={party}
      years={years}
      donations={data.flat()}
    />
  );
};

"use client";

import type { CountryConfig } from "@/types/country-config";
import type { Party } from "@/types/party";

import { DonationYearOrigin } from "@/components/donations/donation-origin";
import Loading from "@/components/loading/loading";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { isNotNullandNotUndefined } from "@/utils/array";

interface YearsOriginClientPageProps {
  country: CountryConfig;
  parties: Party[];
  years: string[];
}

export const YearsOriginClientPage = ({
  country,
  parties,
  years,
}: YearsOriginClientPageProps) => {
  const tData = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const isLoading = results.some((r) => r.isLoading);
  const error = results.some((r) => r.error);
  const isSuccess = results.every((r) => r.isSuccess);

  useScrollToHash(isSuccess);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <DonationYearOrigin
      country={country}
      parties={parties}
      years={years}
      donations={donations}
    />
  );
};

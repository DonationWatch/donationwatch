"use client";
import { Suspense } from "react";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { isNotNullandNotUndefined } from "@/utils/array";

import Loading from "../../loading";
import { RacingBarsContent } from "./racing-bars-content";

export const RacingBars = () => {
  const countryConfig = useRequiredCountryConfig();
  const t = useTranslations("data");

  // Always load ALL years
  const results = useDonationsByYears(countryConfig, countryConfig.years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;

  if (error) return <div>{t("error")}</div>;

  const allDonations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <Suspense fallback={<Loading />}>
      <RacingBarsContent allDonations={allDonations} />
    </Suspense>
  );
};

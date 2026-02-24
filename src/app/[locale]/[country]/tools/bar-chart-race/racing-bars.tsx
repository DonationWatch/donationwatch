"use client";
import { Suspense } from "react";

import { RacingBarsContent } from "./racing-bars-content";
import { useDonationsByYears } from "../../../../../hooks/use-api";
import { isNotNullandNotUndefined } from "../../../../../utils/array";
import Loading from "../../loading";

import type { CountryConfig } from "../../../../../utils/countries";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const RacingBars = ({
  countryConfig,
}: {
  countryConfig: CountryConfig;
}) => {
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
      <RacingBarsContent
        countryConfig={countryConfig}
        allDonations={allDonations}
      />
    </Suspense>
  );
};

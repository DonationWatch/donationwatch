"use client";

import { notFound } from "next/navigation";

import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";

import { Article } from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByDonorId } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { Features, hasFeature } from "@/utils/features";

import { DonorClientPageContent } from "./_components/donor-client-page-content";
import { DonorDonationTable } from "./_components/donor-donation-table";
import { DonorDonationTimeline } from "./_components/donor-donation-timeline";
import { DonorDonationTypes } from "./_components/donor-donation-types";

export const DonorClientPage = ({
  donorId,
  countryConfig,
}: {
  donorId: string;
  countryConfig: CountryConfig;
  country: Country;
}) => {
  const t = useTranslations("data");
  const { data, isLoading, error } = useDonationsByDonorId(
    countryConfig,
    donorId,
  );

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );

  if (error || !data) return t("error");

  if (!data || !data.length) {
    return notFound();
  }

  return (
    <Article fullWidth={true}>
      <DonorClientPageContent
        donorId={donorId}
        countryConfig={countryConfig}
        donations={data}
      />
      <DonorDonationTimeline
        donorId={donorId}
        countryConfig={countryConfig}
        donations={data}
      />
      {hasFeature(countryConfig, Features.DonationType) ? (
        <DonorDonationTypes countryConfig={countryConfig} donations={data} />
      ) : null}
      <DonorDonationTable countryConfig={countryConfig} donations={data} />
    </Article>
  );
};

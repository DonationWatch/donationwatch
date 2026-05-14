"use client";

import { notFound } from "next/navigation";

import type { CountryConfig } from "@/types/country-config";
import type { Country } from "@/utils/countries";

import { Article } from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByDonorId } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
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
  const { data, isLoading, error, isSuccess } = useDonationsByDonorId(
    countryConfig,
    donorId,
  );

  useScrollToHash(isSuccess);

  return (
    <Article fullWidth={true}>
      {isLoading ? (
        <div className="flex h-screen items-center justify-center">
          <Loading />
        </div>
      ) : error || !data || !data.length ? (
        error || !data ? (
          t("error")
        ) : (
          notFound()
        )
      ) : (
        <>
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
            <DonorDonationTypes
              countryConfig={countryConfig}
              donations={data}
            />
          ) : null}
          <DonorDonationTable countryConfig={countryConfig} donations={data} />
        </>
      )}
    </Article>
  );
};

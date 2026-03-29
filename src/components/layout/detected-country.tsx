"use client";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";

import type { CountryConfig } from "@/types/country-config";
import type { CountryCode } from "@/utils/countries";

import { useDetectedCountry } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { countryCodesToCountry } from "@/utils/countries";

export const DetectedCountryContent = ({
  detectedCountryCode,
}: {
  detectedCountryCode?: CountryCode;
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const detectedCountry = t.raw(`countries.${detectedCountryCode ?? "??"}`);

  const destinationLink = detectedCountryCode
    ? `/${locale}/${countryCodesToCountry[detectedCountryCode]}`
    : "#";

  return (
    <a
      data-testid="detected-country"
      aria-hidden={!detectedCountryCode}
      rel="nofollow"
      href={destinationLink}
      title={t("detect_country.action", {
        country: detectedCountry,
      })}
      className="card card--action inline-flex flex-col justify-between gap-6 rounded-lg !py-2 text-sm lg:flex-row lg:items-center"
    >
      <div className="flex items-center gap-3">
        <ArrowUpRight size={18} />
        <div>
          {t("detect_country.title", { country: detectedCountry })}
          <br />
          {t("detect_country.description", {
            country: detectedCountry,
          })}
        </div>
      </div>
    </a>
  );
};

const DetectedCountryFallback = () => {
  return (
    <div className="hidden lg:invisible lg:block" aria-hidden={true}>
      <DetectedCountryContent />
    </div>
  );
};

export const DetectedCountry = ({ country }: { country?: CountryConfig }) => {
  const { data, isLoading, error } = useDetectedCountry();

  const notDoneLoadingComponent = <DetectedCountryFallback />;

  if (isLoading) return notDoneLoadingComponent;
  if (error) return notDoneLoadingComponent;
  if (!data?.country) return notDoneLoadingComponent;
  if (country && data.country === country.code) return notDoneLoadingComponent;

  return <DetectedCountryContent detectedCountryCode={data.country} />;
};

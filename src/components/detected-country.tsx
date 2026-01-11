"use client";

import { ArrowUpRight } from "lucide-react";

import { t } from "../app/[locale]/translations";
import { useDetectedCountry } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";
import { countryCodesToCountry } from "../utils/countries";

import type { CountryConfig, CountryCode } from "../utils/countries";
import type { FC } from "react";

export const DetectedCountryContent: FC<{
  detectedCountryCode?: CountryCode;
}> = ({ detectedCountryCode }) => {
  const { locale, translations } = useTranslations();
  const detectedCountry = translations.countries[detectedCountryCode ?? "??"];

  const destinationLink = detectedCountryCode
    ? `/${locale}/${countryCodesToCountry[detectedCountryCode]}`
    : "#";

  return (
    <a
      data-testid="detected-country"
      aria-hidden={!detectedCountryCode}
      rel="nofollow"
      href={destinationLink}
      title={t(translations.detect_country.action, {
        country: detectedCountry,
      })}
      className="card card--action inline-flex flex-col justify-between gap-6 rounded-lg !py-2 text-sm lg:flex-row lg:items-center"
    >
      <div className="flex items-center gap-3">
        <ArrowUpRight size={18} />
        <div>
          {t(translations.detect_country.title, { country: detectedCountry })}
          <br />
          {t(translations.detect_country.description, {
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

export const DetectedCountry: FC<{
  country?: CountryConfig;
}> = ({ country }) => {
  const { data, isLoading, error } = useDetectedCountry();

  const notDoneLoadingComponent = <DetectedCountryFallback />;

  if (isLoading) return notDoneLoadingComponent;
  if (error) return notDoneLoadingComponent;
  if (!data?.country) return notDoneLoadingComponent;
  if (country && data.country === country.code) return notDoneLoadingComponent;

  return <DetectedCountryContent detectedCountryCode={data.country} />;
};

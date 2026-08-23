"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import type { ConstLocale } from "@/utils/locales";

import { useRequiredCountryConfig } from "@/components/providers/country-provider";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

const YearsFooterLink = ({
  next,
  year,
  locale,
}: {
  year: number;
  locale: ConstLocale;
  next?: boolean;
}) => {
  const country = useRequiredCountryConfig();
  const t = useTranslations("years");
  return (
    <Link
      prefetch={false}
      title={t("goto_year", { year })}
      className="hover:text-primary-800 dark:hover:text-primary-400 flex items-center space-x-2 rounded-sm border border-transparent px-5 py-2 font-semibold uppercase hover:border-zinc-300 dark:hover:border-zinc-700"
      href={`/${locale}/${country.id}/${year}`}
    >
      {!next && <ArrowLeft size={16} />}
      <span>{year}</span>
      {next && <ArrowRight size={16} />}
    </Link>
  );
};

export const YearsFooterNav = ({
  years,
  locale,
}: {
  years: string[];
  locale: ConstLocale;
}) => {
  const country = useRequiredCountryConfig();
  const firstYearNumber = parseInt(years.at(0)!, 10);
  const lastYearNumber = parseInt(years.at(-1)!, 10);

  if (firstYearNumber !== lastYearNumber) {
    // if we have a range, don't show the singular year nav
    return null;
  }

  const countryYears = country.years;

  // if year is before the first year, hide
  if (`${firstYearNumber}` < countryYears.at(0)!) return null;

  // if year is after the last year, hide
  if (`${firstYearNumber}` > countryYears.at(-1)!) return null;

  const prevYear = firstYearNumber - 1;
  const nextYear = firstYearNumber + 1;

  const canGoBack = countryYears.includes(`${prevYear}`);
  const canGoNext = countryYears.includes(`${nextYear}`);

  return (
    <>
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
      <div className="flex justify-between py-4">
        {canGoBack ? (
          <YearsFooterLink locale={locale} year={prevYear} />
        ) : (
          <div></div>
        )}
        {canGoNext ? (
          <YearsFooterLink locale={locale} year={nextYear} next={true} />
        ) : (
          <div></div>
        )}
      </div>
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
    </>
  );
};

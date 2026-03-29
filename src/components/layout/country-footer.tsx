"use client";
import { useLocale } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { formatDate } from "@/utils/formatter";
import { getBuild } from "@/utils/loader/build";

import { PageLogo } from "./page-logo";

export const CountryFooter = ({ country }: { country: CountryConfig }) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="container mx-auto shrink-0 px-4 text-gray-600 dark:text-gray-400">
      <div className="grid-cols-3 items-start justify-between py-2 sm:grid sm:justify-items-center">
        <div className="sm:justify-self-start">
          <Link
            prefetch={false}
            href={`/${locale}/${country.id}`}
            className="group hover:text-primary-700 dark:hover:text-primary-400 flex items-center space-x-1 p-2 dark:text-white"
          >
            <PageLogo size={16} />
            <div className="text-sm font-semibold">DonationWatch</div>
          </Link>
        </div>

        <div className="px-2 text-sm sm:p-2">
          {t("footer.build", {
            date: formatDate(locale, new Date(getBuild(country.id).t)),
          })}
        </div>

        <div className="flex sm:justify-self-end">
          <a
            className="hover:text-primary-800 dark:hover:text-primary-400 p-2 text-sm"
            target="_blank"
            href={country.source.url}
            rel="noreferrer"
          >
            {t("navigation.sources")}
          </a>
          <Link
            className="hover:text-primary-800 dark:hover:text-primary-400 p-2 text-sm"
            href={`/${locale}/${country.id}/transparency`}
            prefetch={false}
            rel="nofollow"
          >
            {t("navigation.transparency")}
          </Link>
        </div>
      </div>
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
    </section>
  );
};

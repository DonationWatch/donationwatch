import type { CountryConfig } from "@donationwatch/core/types/country-config";
import type { Country } from "@donationwatch/core/utils/countries";
import type { ConstLocale } from "@donationwatch/core/utils/locales";

import { formatDate } from "@donationwatch/core/utils/formatter";
import { getBuild } from "@donationwatch/data/loader/build";
import { PageLogo } from "@donationwatch/ui/components/page-logo";
import { useTranslations } from "next-intl";
import Link from "next/link";

export interface CountryFooterProps {
  locale: ConstLocale;
  country: Country;
  source: CountryConfig["source"];
}

export const CountryFooter = ({
  locale,
  country,
  source,
}: CountryFooterProps) => {
  const t = useTranslations();

  return (
    <section className="container mx-auto shrink-0 px-4 text-gray-600 dark:text-gray-400">
      <div className="grid-cols-3 items-start justify-between py-2 sm:grid sm:justify-items-center">
        <div className="sm:justify-self-start">
          <Link
            prefetch={false}
            href={`/${locale}/${country}`}
            className="group hover:text-primary-700 dark:hover:text-primary-400 flex items-center space-x-1 p-2 dark:text-white"
          >
            <PageLogo size={16} />
            <div className="text-sm font-semibold">DonationWatch</div>
          </Link>
        </div>

        <div className="px-2 text-sm sm:p-2" suppressHydrationWarning>
          {t("footer.build", {
            date: formatDate(locale, new Date(getBuild(country).t)),
          })}
        </div>

        <div className="flex sm:justify-self-end">
          <a
            className="hover:text-primary-800 dark:hover:text-primary-400 p-2 text-sm"
            target="_blank"
            href={source.url}
            rel="noreferrer"
          >
            {t("navigation.sources")}
          </a>
          <Link
            className="hover:text-primary-800 dark:hover:text-primary-400 p-2 text-sm"
            href={`/${locale}/${country}/methodology`}
            prefetch={false}
          >
            {t("navigation.methodology")}
          </Link>
        </div>
      </div>
      <div className="border-t border-t-gray-200 dark:border-t-gray-800"></div>
    </section>
  );
};

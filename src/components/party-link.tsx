import Link from "next/link";

import { t } from "../app/[locale]/translations";
import { cn } from "../utils/classname";
import { type CountryConfig, getParty } from "../utils/countries";

import type { Translations } from "../messages/translations";
import type { ConstLocale } from "../utils/locales";
import type { ReceiverId } from "../utils/types";
import type { PropsWithChildren } from "react";

export const PartyLink = ({
  locale,
  party,
  className,
  children,
  country,
  translations,
}: PropsWithChildren<{
  party: ReceiverId;
  locale: ConstLocale;
  className?: string;
  country: CountryConfig;
  translations: Translations;
}>) => {
  return (
    <Link
      prefetch={false}
      href={`/${locale}/${country.id}/party/${party}/donors`}
      className={cn(
        "hover:text-primary-700 dark:hover:text-primary-400 flex items-center rounded-sm font-medium",
        className,
      )}
      title={t(translations.view_party, {
        party: getParty(country, party).short,
      })}
    >
      {children}
    </Link>
  );
};

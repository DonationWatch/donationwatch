"use client";
import Link from "next/link";


import { cn } from "../utils/classname";
import { type CountryConfig, getParty } from "../utils/countries";

import type { ConstLocale } from "../utils/locales";
import type { ReceiverId } from "../utils/types";
import type { PropsWithChildren } from "react";

import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

export const PartyLink = ({
  locale,
  party,
  className,
  children,
  country,
}: PropsWithChildren<{
  party: ReceiverId;
  locale: ConstLocale;
  className?: string;
  country: CountryConfig;
}>) => {
  const t = useTranslations();

  return (
    <Link
      prefetch={false}
      href={`/${locale}/${country.id}/party/${party}/donors`}
      className={cn(
        "hover:text-primary-700 dark:hover:text-primary-400 flex items-center rounded-sm font-medium",
        className,
      )}
      title={t("view_party", {
        party: getParty(country, party).short,
      })}
    >
      {children}
    </Link>
  );
};

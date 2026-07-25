"use client";
import type { PropsWithChildren } from "react";

import Link from "next/link";

import type { ConstLocale } from "@/utils/locales";
import type { ReceiverId } from "@/utils/types";

import {
  useParty,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { cn } from "@/lib/utils";
import { PartyField } from "@/types/party";

export const PartyLink = ({
  locale,
  party: partyId,
  className,
  children,
}: PropsWithChildren<{
  party: ReceiverId;
  locale: ConstLocale;
  className?: string;
}>) => {
  const t = useTranslations();
  const country = useRequiredCountryConfig();
  const party = useParty(partyId);

  return (
    <Link
      prefetch={false}
      href={`/${locale}/${country.id}/party/${partyId}/donors`}
      className={cn(
        "hover:text-primary-700 dark:hover:text-primary-400 flex items-center rounded-sm font-medium",
        className,
      )}
      title={t("view_party", {
        party: party[PartyField.Short],
      })}
    >
      {children}
    </Link>
  );
};

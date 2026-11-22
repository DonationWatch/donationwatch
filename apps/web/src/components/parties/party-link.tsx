"use client";
import type { ConstLocale } from "@donationwatch/core/utils/locales";
import type { ReceiverId } from "@donationwatch/core/utils/types";
import type { PropsWithChildren } from "react";

import { PartyField } from "@donationwatch/core/types/party";
import { cn } from "@donationwatch/ui/lib/utils";
import Link from "next/link";

import {
  useParty,
  useRequiredCountryConfig,
} from "@/components/providers/country-provider";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";

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

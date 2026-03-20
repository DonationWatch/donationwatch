"use client";

import type { PropsWithChildren } from "react";

import { useLocale } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/utils/countries";

import { DonorName } from "@/components/donors/donor-name";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { useHash } from "@/hooks/use-hash";
import { cn } from "@/lib/utils";

export const DonorLink = ({
  children,
  donor,
  country,
  className,
}: PropsWithChildren<{
  donor: string;
  className?: string;
  country: CountryConfig;
}>) => {
  const t = useTranslations();
  const locale = useLocale();
  const { hash, isHashing, error } = useHash(donor);

  if (isHashing || error)
    return <span className={cn("font-semibold", className)}>{donor}</span>;

  return (
    <Link
      prefetch={false}
      href={`/${locale}/${country.id}/donor/${hash}`}
      rel={"nofollow"}
      className={cn(
        "hover:text-primary-700 dark:hover:text-primary-400 font-medium",
        className,
      )}
      title={t("donor_dialog.title")}
    >
      {children ?? <DonorName donor={donor} />}
    </Link>
  );
};

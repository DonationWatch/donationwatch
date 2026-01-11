import Link from "next/link";

import { useHash } from "../hooks/use-hash";
import { useTranslations } from "../hooks/use-translations";
import { cn } from "../utils/classname";

import type { CountryConfig } from "../utils/countries";
import type { FC, PropsWithChildren } from "react";

import { getDonorName } from "@/utils/donor";

export const DonorLink: FC<
  PropsWithChildren & {
    donor: string;
    className?: string;
    country: CountryConfig;
  }
> = ({ children, donor, country, className }) => {
  const { translations, locale } = useTranslations();
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
      title={translations.donor_dialog.title}
    >
      {children ?? getDonorName(donor, translations)}
    </Link>
  );
};

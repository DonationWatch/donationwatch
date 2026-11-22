"use client";
import type { Country } from "@donationwatch/core/utils/countries";

import { COUNTRIES } from "@donationwatch/core/utils/countries";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NotFoundButton = () => {
  const pathname = usePathname();

  const [lang, country] = pathname.substring(1).split("/");

  const url =
    lang && COUNTRIES.has(country as Country)
      ? `/${lang}/${country}`
      : lang
        ? `/${lang}`
        : "/";

  return (
    <Link
      prefetch={false}
      className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-800 inline-block rounded-sm px-4 py-2 text-center text-white"
      href={url}
    >
      Return Home
    </Link>
  );
};

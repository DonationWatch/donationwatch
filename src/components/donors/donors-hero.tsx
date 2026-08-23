"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

import type { StackedPartiesConfig } from "@/components/charts/stacked-party-line-config";
import type { CountryConfig } from "@/types/country-config";
import type { ConstLocale } from "@/utils/locales";

import { StackedPartyDonations } from "@/components/charts/stacked-party-line";
import { DonorName } from "@/components/donors/donor-name";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { formatCountryCurrency } from "@/utils/formatter";

// Only the fields BigDonorPill needs to render, with the heavy per-year
// PartyYearsSums already reduced to StackedPartiesConfig by the caller -
// keeps the unused Count/LastDonation/HasYearOnlyDonations breakdown off
// the server <> client boundary entirely.
export interface DonorHeroItem {
  id: string;
  name: string;
  sum: number;
  stackedConfig: StackedPartiesConfig;
}

export const BigDonorPill = ({
  country,
  donor,
  locale,
  sum,
}: {
  donor: DonorHeroItem;
  locale: ConstLocale;
  country: CountryConfig;
  sum: string;
}) => {
  return (
    <li className="basis-full overflow-hidden p-1 sm:basis-1/2 lg:basis-1/4">
      <Link
        className="flex rounded-md bg-white p-2 shadow-sm transition-all hover:bg-zinc-50 hover:shadow-md hover:saturate-100 dark:bg-zinc-900 dark:hover:bg-zinc-950"
        prefetch={false}
        href={`/${locale}/${country.id}/donor/${donor.id}`}
      >
        <div className="w-2 shrink-0 overflow-hidden rounded-full">
          <StackedPartyDonations
            data={donor.stackedConfig}
            direction={"vertical"}
          />
        </div>
        <div className="overflow-hidden pl-2 text-sm">
          <div className="truncate font-semibold">
            <DonorName donor={donor.name} />
          </div>
          <div className="tabular-nums">{sum}</div>
        </div>
      </Link>
    </li>
  );
};

export const DonorsHero = ({
  country,
  biggestDonors,
}: {
  country: CountryConfig;
  // Already sliced to TOP_DONORS_TO_SHOW by the caller, so the unused rest
  // of the list never crosses the RSC boundary into this client component's
  // hydration payload.
  biggestDonors: DonorHeroItem[];
}) => {
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

  return (
    <ul className="flex flex-wrap pt-4">
      {biggestDonors.map((bigDonor) => (
        <BigDonorPill
          locale={locale}
          donor={bigDonor}
          country={country}
          key={bigDonor.id}
          sum={formatCountryCurrency(browserBasedLocale, bigDonor.sum, country)}
        />
      ))}
    </ul>
  );
};

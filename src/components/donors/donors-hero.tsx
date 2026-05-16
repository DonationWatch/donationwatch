"use client";
import { useLocale } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { BigDonor } from "@/utils/loader/biggest-donors";
import type { BrowserBasedLocale, ConstLocale } from "@/utils/locales";

import { DynamicStackedPartyDonations } from "@/components/charts/dynamic-stacked-party-line";
import { DonorName } from "@/components/donors/donor-name";
import { useBrowserBasedLocale } from "@/hooks/use-browser-based-locale";
import { useHash } from "@/hooks/use-hash";
import { formatCountryCurrency } from "@/utils/formatter";

const TOP_DONORS_TO_SHOW = 8;

export const BigDonorPill = ({
  country,
  donor,
  locale,
  browserBasedLocale,
}: {
  donor: Omit<BigDonor, "id"> & { id?: string };
  locale: ConstLocale;
  browserBasedLocale: BrowserBasedLocale;
  country: CountryConfig;
}) => {
  const { hash } = useHash(donor.name);

  const donorId = donor.id ?? hash;

  return (
    <li className="basis-full overflow-hidden p-1 sm:basis-1/2 lg:basis-1/4">
      <Link
        className="flex rounded-md bg-white p-2 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md hover:saturate-100 dark:bg-gray-900 dark:hover:bg-gray-950"
        prefetch={false}
        href={donorId ? `/${locale}/${country.id}/donor/${donorId}` : "#"}
      >
        <div className="w-2 shrink-0 overflow-hidden rounded-full">
          <DynamicStackedPartyDonations
            country={country}
            years={country.years}
            partyYearsSums={donor.partyYearSums}
            direction={"vertical"}
          />
        </div>
        <div className="overflow-hidden pl-2 text-sm">
          <div className="truncate font-semibold">
            <DonorName donor={donor.name} />
          </div>
          <div className="tabular-nums">
            {formatCountryCurrency(browserBasedLocale, donor.sum, country)}
          </div>
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
  biggestDonors: BigDonor[];
}) => {
  const locale = useLocale();
  const browserBasedLocale = useBrowserBasedLocale();

  return (
    <ul className="flex flex-wrap pt-4">
      {biggestDonors.slice(0, TOP_DONORS_TO_SHOW).map((bigDonor) => (
        <BigDonorPill
          locale={locale}
          browserBasedLocale={browserBasedLocale}
          donor={bigDonor}
          country={country}
          key={bigDonor.id}
        />
      ))}
    </ul>
  );
};

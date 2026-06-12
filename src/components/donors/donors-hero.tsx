import { useLocale } from "next-intl";
import Link from "next/link";

import type { CountryConfig } from "@/types/country-config";
import type { BigDonor } from "@/utils/loader/biggest-donors";
import type { ConstLocale } from "@/utils/locales";

import { FormattedCountryCurrency } from "@/components/browser-based-formatter";
import { DynamicStackedPartyDonations } from "@/components/charts/dynamic-stacked-party-line";
import { DonorName } from "@/components/donors/donor-name";

const TOP_DONORS_TO_SHOW = 8;

export const BigDonorPill = ({
  country,
  donor,
  locale,
}: {
  donor: BigDonor;
  locale: ConstLocale;
  country: CountryConfig;
}) => {
  return (
    <li className="basis-full overflow-hidden p-1 sm:basis-1/2 lg:basis-1/4">
      <Link
        className="flex rounded-md bg-white p-2 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md hover:saturate-100 dark:bg-gray-900 dark:hover:bg-gray-950"
        prefetch={false}
        href={`/${locale}/${country.id}/donor/${donor.id}`}
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
            <FormattedCountryCurrency value={donor.sum} country={country} />
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

  return (
    <ul className="flex flex-wrap pt-4">
      {biggestDonors.slice(0, TOP_DONORS_TO_SHOW).map((bigDonor) => (
        <BigDonorPill
          locale={locale}
          donor={bigDonor}
          country={country}
          key={bigDonor.id}
        />
      ))}
    </ul>
  );
};

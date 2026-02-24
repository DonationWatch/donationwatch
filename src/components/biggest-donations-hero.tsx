"use client";
import { useLocale } from "next-intl";

import { DonorLink } from "./donor-link";
import { FormatAnd } from "./formatter";
import { TextPartyLink } from "./text-party-link";
import { getCountryName } from "../utils/countries";
import { donationYear } from "../utils/date";
import { formatCountryCurrency } from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { CountryConfig } from "../utils/countries";
import type { Donation } from "../utils/types";

import { Translation } from "@/components/translation";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { getDonationDonorName } from "@/utils/donor";

export const BiggestDonationsHero = ({
  country,
  biggestDonations,
}: {
  country: CountryConfig;
  biggestDonations: Donation[];
}) => {
  const tBiggestDonations = useTranslations("biggest_donations");
  const tCountries = useTranslations("countries");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  if (!biggestDonations.length) return null;

  const biggestDonation = biggestDonations.at(0)!;
  const biggestDonationYear = donationYear(biggestDonation);

  return (
    <p className="mt-12 lg:w-10/12" data-testid="biggest-donations">
      <Translation
        text={tBiggestDonations.raw("text")}
        variables={{
          minYear: country.minYear,
          country: getCountryName(country, tCountries),
          amount: formatCountryCurrency(
            locale,
            biggestDonation[DonationField.Amount],
            country,
          ),
          year: biggestDonationYear,
          donor: (
            <DonorLink
              country={country}
              donor={getDonationDonorName(biggestDonation, tCommon)}
            />
          ),
          party: (
            <TextPartyLink
              locale={locale}
              party={biggestDonation[DonationField.Receiver]}
              country={country}
            />
          ),
          others: (
            <FormatAnd
              locale={locale}
              items={biggestDonations.slice(1).map((donation) => (
                <Translation
                  key={donation[DonationField.Id]}
                  text={tBiggestDonations.raw("list")}
                  variables={{
                    amount: formatCountryCurrency(
                      locale,
                      donation[DonationField.Amount],
                      country,
                    ),
                    donor: (
                      <DonorLink
                        country={country}
                        donor={getDonationDonorName(donation, tCommon)}
                      />
                    ),
                    receiver: (
                      <TextPartyLink
                        locale={locale}
                        party={donation[DonationField.Receiver]}
                        country={country}
                      />
                    ),
                  }}
                />
              ))}
            />
          ),
        }}
      />
    </p>
  );
};

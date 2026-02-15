"use client";

import { DonorLink } from "./donor-link";
import { FormatAnd } from "./formatter";
import { TextPartyLink } from "./text-party-link";
import { Translation } from "./translation";
import { getCountryName } from "../utils/countries";
import { donationYear } from "../utils/date";
import { formatCountryCurrency } from "../utils/formatter";
import { DonationField } from "../utils/types";

import type { Translations } from "../messages/translations";
import type { CountryConfig } from "../utils/countries";
import type { ConstLocale } from "../utils/locales";
import type { Donation } from "../utils/types";

import { getDonationDonorName } from "@/utils/donor";

export const BiggestDonationsHero = ({
  country,
  locale,
  translations,
  biggestDonations,
}: {
  locale: ConstLocale;
  country: CountryConfig;
  translations: Translations;
  biggestDonations: Donation[];
}) => {
  if (!biggestDonations.length) return null;

  const biggestDonation = biggestDonations.at(0)!;
  const biggestDonationYear = donationYear(biggestDonation);

  return (
    <p className="mt-12 lg:w-10/12" data-testid="biggest-donations">
      <Translation
        text={translations.home.biggest_donations.text}
        variables={{
          minYear: country.minYear,
          country: getCountryName(country, translations),
          amount: formatCountryCurrency(
            locale,
            biggestDonation[DonationField.Amount],
            country,
          ),
          year: biggestDonationYear,
          donor: (
            <DonorLink
              country={country}
              donor={getDonationDonorName(biggestDonation, translations)}
            />
          ),
          party: (
            <TextPartyLink
              locale={locale}
              party={biggestDonation[DonationField.Receiver]}
              country={country}
              translations={translations}
            />
          ),
          others: (
            <FormatAnd
              locale={locale}
              items={biggestDonations.slice(1).map((donation) => (
                <Translation
                  key={donation[DonationField.Id]}
                  text={translations.home.biggest_donations.list}
                  variables={{
                    amount: formatCountryCurrency(
                      locale,
                      donation[DonationField.Amount],
                      country,
                    ),
                    donor: (
                      <DonorLink
                        country={country}
                        donor={getDonationDonorName(donation, translations)}
                      />
                    ),
                    receiver: (
                      <TextPartyLink
                        locale={locale}
                        party={donation[DonationField.Receiver]}
                        country={country}
                        translations={translations}
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

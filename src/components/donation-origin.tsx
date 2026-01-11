"use client";

import { type FC, useState } from "react";

import { DonationOriginVisual } from "./donation-origin-visual";
import Loading from "./loading";
import { OriginDonationsItem } from "./origin-donations-item";
import { t } from "../app/[locale]/translations";
import { useDonationsByParty, useDonationsByYears } from "../hooks/use-api";
import { useTranslations } from "../hooks/use-translations";
import { isNotNullandNotUndefined } from "../utils/array";
import {
  Country,
  type CountryConfig,
  getCountryName,
} from "../utils/countries";
import { getOriginDonations } from "../utils/data/get-origin-donations";
import { formatCountryCurrency, formatYearsRange } from "../utils/formatter";
import { AddressField, DonationField } from "../utils/types";
import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "./layout/article";

import type { OriginPartySum } from "../utils/data/get-origin-donations";
import type { Donation, Party } from "../utils/types";

const CurrentCountryPart: FC<{
  country: CountryConfig;
  sums: OriginPartySum[];
  donations: Donation[];
  years: string[];
  parties: Party[];
  sum: number;
  subtitle: string;
}> = ({ sums, donations, sum, years, parties, country, subtitle }) => {
  const { translations, locale } = useTranslations();
  const [expandedDonors, setExpandedDonors] = useState<string[]>([]);
  const onToggleExpanded = (state: string) => {
    setExpandedDonors((prev) =>
      prev.includes(state)
        ? prev.filter((id) => id !== state)
        : [...prev, state],
    );
  };

  if (sums.length === 0) return null;

  const largestDonationSum: OriginPartySum | undefined = sums[0];
  let largesDonationCount: OriginPartySum | undefined = sums[0];

  sums.forEach((sum) => {
    if (
      (largesDonationCount?.[1].donations.length ?? 0) < sum[1].donations.length
    )
      largesDonationCount = sum;
  });

  const isEU = country.id === Country.europeanunion;
  const countries = translations.countries as Record<string, string>;
  const states = (translations.state as Record<string, Record<string, string>>)[
    country.id
  ];

  return (
    <ArticleSectionWrapper id={"sec-current-country"}>
      <ArticleSectionTwoColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            as={"h2"}
            id={"sec-current-country"}
            title={t(translations.origin.country.title, {
              country: getCountryName(country, translations),
            })}
          />
          <p className="mb-6">
            {t(translations.origin.country.summary, {
              from: years.at(0)!,
              until: years.at(-1)!,
              stateCount: sums.length,
              highestState: isEU
                ? countries[largestDonationSum[1].state!]
                : states[largestDonationSum[1].state!],
              highestSum: formatCountryCurrency(
                locale,
                largestDonationSum[1].sum,
                country,
              ),
              largesDonationCountNum: largesDonationCount[1].donations.length,
              largesDonationCountState: isEU
                ? countries[largesDonationCount[1].state!]
                : states[largesDonationCount[1].state!],
            })}
          </p>

          <ul className="mb-6 space-y-1">
            {sums.map(([bucket, data], idx) => (
              <OriginDonationsItem
                id={"current"}
                translations={translations}
                rank={idx + 1}
                key={bucket}
                amount={data.sum}
                sum={sum}
                donations={data.donations}
                country={country}
                expanded={expandedDonors.includes(data.state!)}
                onToggleExpanded={() => onToggleExpanded(data.state!)}
              />
            ))}
          </ul>
        </ArticleSectionColumn>
        <ArticleSectionColumn>
          <div>
            <DonationOriginVisual
              donations={donations}
              country={country}
              years={years}
              parties={parties}
              subtitle={subtitle}
            />
          </div>
        </ArticleSectionColumn>
      </ArticleSectionTwoColumns>
    </ArticleSectionWrapper>
  );
};

const OtherCountryPart: FC<{
  country: CountryConfig;
  sums: OriginPartySum[];
  years: string[];
  sum: number;
}> = ({ sums, sum, years, country }) => {
  const { translations, locale } = useTranslations();
  const [expandedCountries, setExpandedCountries] = useState<string[]>([]);
  const onToggleExpanded = (state: string) => {
    setExpandedCountries((prev) =>
      prev.includes(state)
        ? prev.filter((id) => id !== state)
        : [...prev, state],
    );
  };

  if (sums.length === 0) return null;

  const largesOtherDonationSum: OriginPartySum | undefined = sums[0];
  let largesOtherDonationCount: OriginPartySum | undefined = sums[0];

  sums.forEach((sum) => {
    if (
      (largesOtherDonationCount?.[1].donations.length ?? 0) <
      sum[1].donations.length
    )
      largesOtherDonationCount = sum;
  });

  return (
    <ArticleSectionWrapper id={"sec-other-country"}>
      <ArticleSectionOneColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            as={"h2"}
            id={"sec-other-country"}
            title={t(translations.origin.elsewhere.title, {
              country: getCountryName(country, translations),
            })}
          />

          <p className="mb-6">
            {t(translations.origin.elsewhere.summary, {
              from: years.at(0)!,
              until: years.at(-1)!,
              countryCount: sums.length,
              highestCountry:
                translations.countries[
                  largesOtherDonationSum[1].donations[0][DonationField.Address][
                    AddressField.Country
                  ]!
                ],
              highestSum: formatCountryCurrency(
                locale,
                largesOtherDonationSum[1].sum,
                country,
              ),
              largesDonationCountNum:
                largesOtherDonationCount[1].donations.length,
              largesDonationCountState:
                translations.countries[
                  largesOtherDonationCount[1].donations[0][
                    DonationField.Address
                  ][AddressField.Country]
                ],
            })}
          </p>

          <ul className="mb-6 space-y-1">
            {sums.map(([bucket, data], idx) => (
              <OriginDonationsItem
                id={"other"}
                translations={translations}
                rank={idx + 1}
                key={bucket}
                amount={data.sum}
                sum={sum}
                donations={data.donations}
                country={country}
                expanded={expandedCountries.includes(
                  data.donations.at(0)![DonationField.Address][
                    AddressField.Country
                  ],
                )}
                onToggleExpanded={() =>
                  onToggleExpanded(
                    data.donations.at(0)![DonationField.Address][
                      AddressField.Country
                    ],
                  )
                }
              />
            ))}
          </ul>
        </ArticleSectionColumn>
      </ArticleSectionOneColumns>
    </ArticleSectionWrapper>
  );
};

export const DonationYearOrigin: FC<{
  years: string[];
  parties: Party[];
  country: CountryConfig;
}> = ({ country, years, parties }) => {
  const { translations } = useTranslations();
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{translations.data_error}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <DonationOrigin
      years={years}
      parties={parties}
      country={country}
      donations={donations}
      subtitle={t(translations.origin.country.subtitle, {
        country: getCountryName(country, translations),
        years: formatYearsRange(years),
      })}
    />
  );
};

export const DonationPartyOrigin: FC<{
  years: string[];
  party: Party;
  country: CountryConfig;
}> = ({ country, years, party }) => {
  const { translations } = useTranslations();
  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{translations.data_error}</div>;

  return (
    <DonationOrigin
      years={years}
      parties={[party]}
      country={country}
      donations={data.flat()}
      subtitle={t(translations.origin.party.subtitle, {
        party: party.short,
        country: getCountryName(country, translations),
      })}
    />
  );
};

const DonationOrigin: FC<{
  years: string[];
  parties: Party[];
  country: CountryConfig;
  donations: Donation[];
  subtitle: string;
}> = ({ country, years, parties, donations, subtitle }) => {
  const { translations, locale } = useTranslations();
  const { sum, sums } = getOriginDonations(country, donations, parties, years);

  const isEu = country.id === Country.europeanunion;

  const countryDonationSums = sums.filter((sum) =>
    isEu
      ? country.states.includes(
          sum[1].donations[0][DonationField.Address][AddressField.State]!,
        )
      : sum[1].donations[0][DonationField.Address][AddressField.Country] ===
          country.code &&
        sum[1].donations[0][DonationField.Address][AddressField.State],
  );
  const otherDonationSums = sums.filter((sum) =>
    isEu
      ? !country.states.includes(
          sum[1].donations[0][DonationField.Address][AddressField.State]!,
        )
      : sum[1].donations[0][DonationField.Address][AddressField.Country] !==
          country.code ||
        !sum[1].donations[0][DonationField.Address][AddressField.State],
  );

  const sumCountry = countryDonationSums.reduce(
    (all, [, { sum }]) => all + sum,
    0,
  );
  const sumOthers = otherDonationSums.reduce(
    (all, [, { sum }]) => all + sum,
    0,
  );

  return (
    <Article fullWidth={true}>
      <ArticleSectionWrapper id={"sec-origin"}>
        <ArticleSectionOneColumns>
          <ArticleSectionColumn>
            <ArticleSectionTitle
              as={"h1"}
              id={"sec-origin"}
              title={translations.origin.detail.title}
            />
            <p className="mb-6">
              {t(translations.origin.detail.summary, {
                country: getCountryName(country, translations),
              })}
            </p>
            {country.id === Country.austria ? (
              <p className="mb-6">
                {t(translations.origin.detail.country[country.id], {
                  country: getCountryName(country, translations),
                })}
              </p>
            ) : null}
            <p>
              {t(translations.origin.detail.sum, {
                years:
                  years.length > 1
                    ? formatYearsRange(years)
                    : (years.at(0) as string),
                country: getCountryName(country, translations),
                sumCountry: formatCountryCurrency(locale, sumCountry, country),
                sumOthers: formatCountryCurrency(locale, sumOthers, country),
              })}
            </p>
          </ArticleSectionColumn>
        </ArticleSectionOneColumns>
      </ArticleSectionWrapper>
      <CurrentCountryPart
        donations={donations}
        country={country}
        sums={countryDonationSums}
        years={years}
        parties={parties}
        sum={sum}
        subtitle={subtitle}
      />
      <OtherCountryPart
        country={country}
        sums={otherDonationSums}
        years={years}
        sum={sum}
      />
    </Article>
  );
};

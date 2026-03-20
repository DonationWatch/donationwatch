"use client";
import { useLocale } from "next-intl";
import { useState } from "react";

import type { OriginPartySum } from "@/utils/data/get-origin-donations";
import type { Donation, Party } from "@/utils/types";

import {
  Article,
  ArticleSectionColumn,
  ArticleSectionOneColumns,
  ArticleSectionTitle,
  ArticleSectionTwoColumns,
  ArticleSectionWrapper,
} from "@/components/layout/article";
import Loading from "@/components/loading/loading";
import { useDonationsByParty, useDonationsByYears } from "@/hooks/use-api";
import { useClientTranslations as useTranslations } from "@/hooks/use-client-translations";
import { isNotNullandNotUndefined } from "@/utils/array";
import { Country, type CountryConfig, getCountryName } from "@/utils/countries";
import { getOriginDonations } from "@/utils/data/get-origin-donations";
import { formatCountryCurrency, formatYearsRange } from "@/utils/formatter";
import { AddressField, DonationField } from "@/utils/types";

import { DonationOriginVisual } from "./donation-origin-visual";
import { OriginDonationsItem } from "./origin-donations-item";

const CurrentCountryPart = ({
  sums,
  donations,
  sum,
  years,
  parties,
  country,
  subtitle,
}: {
  country: CountryConfig;
  sums: OriginPartySum[];
  donations: Donation[];
  years: string[];
  parties: Party[];
  sum: number;
  subtitle: string;
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const locale = useLocale();
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

  return (
    <ArticleSectionWrapper id={"sec-current-country"}>
      <ArticleSectionTwoColumns>
        <ArticleSectionColumn>
          <ArticleSectionTitle
            as={"h2"}
            id={"sec-current-country"}
            title={t("origin.country.title", {
              country: getCountryName(country, tCountries),
            })}
          />
          <p className="mb-6">
            {t("origin.country.summary", {
              from: years.at(0)!,
              until: years.at(-1)!,
              stateCount: sums.length,
              highestState: isEU
                ? // @ts-expect-error - we know that state is defined because it is used in the bucket
                  t(`countries.${largestDonationSum[1].state!}`)
                : // @ts-expect-error - we know that state is defined because it is used in the bucket
                  t(`state.${country.id}.${largestDonationSum[1].state!}`),
              highestSum: formatCountryCurrency(
                locale,
                largestDonationSum[1].sum,
                country,
              ),
              largesDonationCountNum: largesDonationCount[1].donations.length,
              largesDonationCountState: isEU
                ? // @ts-expect-error - we know that state is defined because it is used in the bucket
                  t(`countries.${largesDonationCount[1].state!}`)
                : // @ts-expect-error - we know that state is defined because it is used in the bucket
                  t(`state.${country.id}.${largesDonationCount[1].state!}`),
            })}
          </p>

          <ul className="mb-6 space-y-1">
            {sums.map(([bucket, data], idx) => (
              <OriginDonationsItem
                id={"current"}
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

const OtherCountryPart = ({
  sums,
  sum,
  years,
  country,
}: {
  country: CountryConfig;
  sums: OriginPartySum[];
  years: string[];
  sum: number;
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const locale = useLocale();
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
            title={t("origin.elsewhere.title", {
              country: getCountryName(country, tCountries),
            })}
          />

          <p className="mb-6">
            {t("origin.elsewhere.summary", {
              from: years.at(0)!,
              until: years.at(-1)!,
              countryCount: sums.length,
              highestCountry: t(
                `countries.${largesOtherDonationSum[1].donations[0][
                  DonationField.Address
                ][AddressField.Country]!}`,
              ),
              highestSum: formatCountryCurrency(
                locale,
                largesOtherDonationSum[1].sum,
                country,
              ),
              largesDonationCountNum:
                largesOtherDonationCount[1].donations.length,
              largesDonationCountState: t(
                `countries.${
                  largesOtherDonationCount[1].donations[0][
                    DonationField.Address
                  ][AddressField.Country]
                }`,
              ),
            })}
          </p>

          <ul className="mb-6 space-y-1">
            {sums.map(([bucket, data], idx) => (
              <OriginDonationsItem
                id={"other"}
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

export const DonationYearOrigin = ({
  country,
  years,
  parties,
}: {
  years: string[];
  parties: Party[];
  country: CountryConfig;
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const tData = useTranslations("data");
  const results = useDonationsByYears(country, years);
  const error = results.some((r) => r.error);
  const isLoading = results.some((r) => r.isLoading);

  if (isLoading) return <Loading />;
  if (error) return <div>{tData("error")}</div>;

  const donations = results
    .flatMap((r) => r.data)
    .filter(isNotNullandNotUndefined);

  return (
    <DonationOrigin
      years={years}
      parties={parties}
      country={country}
      donations={donations}
      subtitle={t("origin.country.subtitle", {
        country: getCountryName(country, tCountries),
        years: formatYearsRange(years),
      })}
    />
  );
};

export const DonationPartyOrigin = ({
  country,
  years,
  party,
}: {
  years: string[];
  party: Party;
  country: CountryConfig;
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const tData = useTranslations("data");
  const { data, error, isLoading } = useDonationsByParty(country, party);

  if (isLoading) return <Loading />;
  if (error || !data) return <div>{tData("error")}</div>;

  return (
    <DonationOrigin
      years={years}
      parties={[party]}
      country={country}
      donations={data.flat()}
      subtitle={t("origin.party.subtitle", {
        party: party.short,
        country: getCountryName(country, tCountries),
      })}
    />
  );
};

const DonationOrigin = ({
  country,
  years,
  parties,
  donations,
  subtitle,
}: {
  years: string[];
  parties: Party[];
  country: CountryConfig;
  donations: Donation[];
  subtitle: string;
}) => {
  const t = useTranslations();
  const tCountries = useTranslations("countries");
  const locale = useLocale();
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
              title={t("origin.detail.title")}
            />
            <p className="mb-6">
              {t("origin.detail.summary", {
                country: getCountryName(country, tCountries),
              })}
            </p>
            {country.id === Country.austria ? (
              <p className="mb-6">
                {t(`origin.detail.country.${country.id}`, {
                  country: getCountryName(country, tCountries),
                })}
              </p>
            ) : null}
            <p>
              {t("origin.detail.sum", {
                years:
                  years.length > 1
                    ? formatYearsRange(years)
                    : (years.at(0) as string),
                country: getCountryName(country, tCountries),
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
